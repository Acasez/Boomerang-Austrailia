import { useEffect, useRef, useState } from "react";
import "./index.css";
import HandDisplay from "./Components/HandDisplay";
import ChatBox from "./Components/ChatBox";
import type { ChatMessage } from "./Types/ChatMessage";
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
        setGameError(null);
      }
      if (data.type === "error") {
        setGameError(String(data.message ?? "The game could not be started."));
      }
      if (data.type === "chat") setMessages((prev) => [...prev, data]);
    };

    return () => ws.close();
  }, []);

  const refreshPlayerState = () => {
    setPlayerState((current) => ({ player: current.player }));
  };

  const startGame = () => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      setGameError("Connect to the game server before starting.");
      return;
    }

    ws.send(JSON.stringify({ type: "startGame" }));
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
          <PlayedCardDisplay player={playerState.player} />
        </div>
        {gameError && <p role="alert">{gameError}</p>}
        <HandDisplay
          player={playerState.player}
          onStateChange={refreshPlayerState}
          gameStarted={gameStarted}
          hasHand={hasHand}
        />
      </div>
    </>
  );
}
