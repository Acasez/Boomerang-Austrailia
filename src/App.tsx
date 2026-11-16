import { useEffect, useRef, useState } from "react";
import "./index.css";
import HandDisplay from "./Components/HandDisplay";
import ChatBox from "./Components/ChatBox";
import type { ChatMessage } from "./Types/ChatMessage";
import type { Card } from "./Types/Card";
import PlayedCardDisplay from "./Components/PlayedCardDisplay";
import Player from "./classes/Player";
import Header from "./Components/Header";

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [myId, setMyId] = useState<number | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [playerState, setPlayerState] = useState(() => ({
    player: new Player(),
  }));
  const [gameError, setGameError] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [hasHand, setHasHand] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [playedCards, setPlayedCards] = useState<Card[]>([]);
  const [selectionProgress, setSelectionProgress] = useState<{
    readyCount: number;
    playerCount: number;
  } | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:2048");
    wsRef.current = ws;

    ws.onmessage = (event) => {
      let data: any;
      try {
        data = JSON.parse(event.data);
      } catch {
        console.log("Non-JSON message:", event.data);
        return;
      }
      if (data.type === "welcome") {
        setMyId(data.playerId);
        setPlayerState({ player: new Player() });
        setGameStarted(Boolean(data.gameStarted));
        setHasHand(false);
        setGameOver(false);
        setPlayedCards([]);
        setSelectionProgress(null);
        setGameError(null);
      }
      if (data.type === "gameStarted") {
        if (!Array.isArray(data.hand)) {
          const error = "Game start message did not include a valid hand.";
          console.error(error);
          setGameError(error);
          return;
        }

        const player = new Player();
        player.hand = data.hand;
        setPlayerState({ player });
        setGameStarted(true);
        setHasHand(true);
        setGameOver(false);
        setPlayedCards([]);
        setSelectionProgress(null);
        setGameError(null);
      }
      if (data.type === "selectionProgress") {
        if (
          !Number.isInteger(data.readyCount) ||
          !Number.isInteger(data.playerCount)
        ) {
          setGameError("Server sent invalid draft progress.");
          return;
        }

        setSelectionProgress({
          readyCount: data.readyCount,
          playerCount: data.playerCount,
        });
      }
      if (data.type === "roundResolved") {
        if (
          !Array.isArray(data.hand) ||
          !Array.isArray(data.currentPlays) ||
          !Array.isArray(data.playedCards)
        ) {
          setGameError("Server sent invalid draft results.");
          return;
        }

        const player = new Player();
        player.hand = data.hand;
        player.currentPlays = data.currentPlays;
        setPlayerState({ player });
        setHasHand(true);
        setPlayedCards(data.playedCards);
        setSelectionProgress(null);
        setGameOver(Boolean(data.gameOver));
        setGameError(null);
      }
      if (data.type === "error") {
        setGameError(String(data.message ?? "The game could not be started."));
      }
      if (data.type === "selectionError") {
        setPlayerState((current) => {
          const player = new Player();
          player.hand = current.player.hand;
          player.currentPlays = current.player.currentPlays;
          player.score = current.player.score;
          return { player };
        });
        setGameError(String(data.message ?? "The card could not be selected."));
      }
      if (data.type === "chat") setMessages((prev) => [...prev, data]);
    };

    return () => ws.close();
  }, []);

  const startGame = () => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      setGameError("Connect to the game server before starting.");
      return;
    }

    ws.send(JSON.stringify({ type: "startGame" }));
  };

  const selectCard = (handIndex: number) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      setGameError("Connect to the game server before selecting a card.");
      return;
    }

    const player = playerState.player;
    const card = player.hand[handIndex];
    if (!card || player.selectedCard !== null) return;

    try {
      ws.send(JSON.stringify({ type: "selectCard", handIndex }));
      player.selectCard(card);
      setPlayerState({ player });
      setGameError(null);
    } catch (error) {
      if (!(error instanceof Error)) throw error;
      setGameError(error.message);
    }
  };

  return (
    <>
      <Header
        gameStarted={gameStarted}
        disabled={myId === null}
        onStartGame={startGame}
      />
      <div className="mx-auto p-8 text-center bg-gray-100">
        <div className="flex flex-row gap-5">
          <ChatBox wsRef={wsRef} messages={messages} myId={myId} />
          <PlayedCardDisplay cards={playedCards} />
        </div>
        {gameError && <p role="alert">{gameError}</p>}
        <HandDisplay
          player={playerState.player}
          onSelectCard={selectCard}
          gameStarted={gameStarted}
          hasHand={hasHand}
          gameOver={gameOver}
          selectionProgress={selectionProgress}
        />
      </div>
    </>
  );
}
