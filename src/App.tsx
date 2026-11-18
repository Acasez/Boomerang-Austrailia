import { useCallback, useEffect, useRef, useState } from "react";
import "./index.css";
import HandDisplay from "./Components/HandDisplay";
import ChatBox from "./Components/ChatBox";
import type { ChatMessage } from "./Types/ChatMessage";
import type { Activity } from "./Types/Card";
import type { PlayedCardsRow, ServerMessage } from "./Types/ServerMessage";
import { parseServerMessage } from "./Utils/parseServerMessage";
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
  const [playedRows, setPlayedRows] = useState<PlayedCardsRow[]>([]);
  const [turnNumber, setTurnNumber] = useState(0);
  const [roundNumber, setRoundNumber] = useState(1);
  const [selectionProgress, setSelectionProgress] = useState<{
    readyCount: number;
    playerCount: number;
  } | null>(null);
  const [activityScoring, setActivityScoring] = useState(false);
  const [activityScored, setActivityScored] = useState(false);
  const [activityProgress, setActivityProgress] = useState<{
    readyCount: number;
    playerCount: number;
  } | null>(null);

  const handleServerMessage = useCallback((message: ServerMessage) => {
    switch (message.type) {
      case "welcome":
        setMyId(message.playerId);
        setPlayerState({ player: new Player() });
        setGameStarted(message.gameStarted);
        setHasHand(false);
        setGameOver(false);
        setPlayedRows([]);
        setTurnNumber(0);
        setRoundNumber(1);
        setSelectionProgress(null);
        setActivityScoring(false);
        setActivityScored(false);
        setActivityProgress(null);
        setGameError(null);
        return;
      case "gameStarted": {
        const player = new Player();
        player.hand = message.hand;
        setPlayerState({ player });
        setGameStarted(true);
        setHasHand(true);
        setGameOver(false);
        setPlayedRows(message.playedRows);
        setTurnNumber(message.turnNumber);
        setRoundNumber(message.round);
        setSelectionProgress(null);
        setActivityScoring(false);
        setActivityScored(false);
        setActivityProgress(null);
        setGameError(null);
        return;
      }
      case "roundStarted": {
        const player = new Player();
        player.hand = message.hand;
        setPlayerState({ player });
        setHasHand(true);
        setGameOver(false);
        setPlayedRows(message.playedRows);
        setTurnNumber(message.turnNumber);
        setRoundNumber(message.round);
        setSelectionProgress(null);
        setActivityScoring(false);
        setActivityScored(false);
        setActivityProgress(null);
        setGameError(null);
        return;
      }
      case "selectionProgress":
        setSelectionProgress({
          readyCount: message.readyCount,
          playerCount: message.playerCount,
        });
        return;
      case "turnResolved": {
        const player = new Player();
        player.hand = message.hand;
        player.currentPlays = message.currentPlays;
        setPlayerState({ player });
        setHasHand(true);
        setPlayedRows(message.playedRows);
        setTurnNumber(message.turnNumber);
        setSelectionProgress(null);
        setGameOver(message.gameOver);
        setActivityScoring(message.gameOver);
        setActivityScored(false);
        setActivityProgress(null);
        setGameError(null);
        return;
      }
      case "activityScoringProgress":
        setPlayedRows(message.playedRows);
        setActivityScoring(true);
        setActivityProgress({
          readyCount: message.readyCount,
          playerCount: message.playerCount,
        });
        return;
      case "activityScored":
        setPlayedRows(message.playedRows);
        setActivityScoring(false);
        setActivityScored(true);
        setActivityProgress(null);
        setGameError(null);
        return;
      case "error":
        setGameError(message.message);
        return;
      case "selectionError":
        setPlayerState((current) => {
          const player = new Player();
          player.hand = current.player.hand;
          player.currentPlays = current.player.currentPlays;
          player.roundScore = current.player.roundScore;
          return { player };
        });
        setGameError(message.message);
        return;
      case "chat":
        setMessages((previous) => [...previous, message]);
        return;
      default: {
        const exhaustiveCheck: never = message;
        return exhaustiveCheck;
      }
    }
  }, []);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:2048");
    wsRef.current = ws;

    ws.onmessage = (event) => {
      let payload: unknown;
      try {
        payload = JSON.parse(event.data);
      } catch (error) {
        console.error("Could not parse a server message.", error);
        setGameError("The server sent an invalid message.");
        return;
      }
      const message = parseServerMessage(payload);
      if (!message) {
        const error = "The server sent an unknown or invalid message.";
        console.error(error, payload);
        setGameError(error);
        return;
      }

      handleServerMessage(message);
    };

    return () => ws.close();
  }, [handleServerMessage]);

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
    if (!card) return;
    const nextSelection = player.selectedCard === card ? null : card;

    try {
      ws.send(
        JSON.stringify({
          type: "selectCard",
          handIndex: nextSelection === null ? null : handIndex,
          turnNumber,
        }),
      );
      player.selectCard(nextSelection);
      setPlayerState({ player });
      setGameError(null);
    } catch (error) {
      if (!(error instanceof Error)) throw error;
      setGameError(error.message);
    }
  };

  const selectActivity = (activity: Activity | null) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      setGameError("Connect to the game server before choosing an activity.");
      return;
    }

    ws.send(JSON.stringify({ type: "selectActivity", activity }));
    setGameError(null);
  };

  const skipActivity = () => {
    selectActivity(null);
  };

  return (
    <>
      <Header
        gameStarted={gameStarted}
        disabled={myId === null}
        onStartGame={startGame}
        roundNumber={roundNumber}
      />
      <div className="mx-auto p-3 pt-1 text-center bg-gray-100">
        <div className="flex flex-row gap-5">
          <ChatBox wsRef={wsRef} messages={messages} myId={myId} />
          <HandDisplay
            player={playerState.player}
            onSelectCard={selectCard}
            gameStarted={gameStarted}
            hasHand={hasHand}
            gameOver={gameOver}
            activityScored={activityScored}
            selectionProgress={selectionProgress}
          />
        </div>
        {gameError && <p role="alert">{gameError}</p>}
        <PlayedCardDisplay
          ownPlayerId={myId}
          rows={playedRows}
          activityScoring={activityScoring}
          activityProgress={activityProgress}
          onSelectActivity={selectActivity}
          onSkipActivity={skipActivity}
        />
      </div>
    </>
  );
}
