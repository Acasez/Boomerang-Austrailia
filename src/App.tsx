import { useEffect, useRef, useState } from "react";
import "./index.css";
import HandDisplay from "./Components/HandDisplay";
import ChatBox from "./Components/ChatBox";
import type { ChatMessage } from "./Types/ChatMessage";
import PlayedCardDisplay from "./Components/PlayedCardDisplay";
import Player from "./classes/Player";

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [myId, setMyId] = useState<number | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [playerState, setPlayerState] = useState(() => ({
    player: new Player(),
  }));
  const [gameError, setGameError] = useState<string | null>(null);

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
        if (!Array.isArray(data.hand)) {
          const error = "Server welcome message did not include a valid hand.";
          console.error(error);
          setGameError(error);
          return;
        }

        const player = new Player();
        player.hand = data.hand;
        setMyId(data.playerId);
        setPlayerState({ player });
        setGameError(null);
      }
      if (data.type === "error") setGameError(data.message);
      if (data.type === "chat") setMessages((prev) => [...prev, data]);
    };

    return () => ws.close();
  }, []);

  const refreshPlayerState = () => {
    setPlayerState((current) => ({ player: current.player }));
  };

  return (
    <div className="mx-auto p-8 text-center bg-gray-100">
      <div className="flex flex-row gap-5">
        <ChatBox wsRef={wsRef} messages={messages} myId={myId} />
        <PlayedCardDisplay player={playerState.player} />
      </div>
      {gameError && <p role="alert">{gameError}</p>}
      <HandDisplay
        player={playerState.player}
        onStateChange={refreshPlayerState}
      />
    </div>
  );
}
