import { useEffect, useRef, useState } from "react";
import "./index.css";
import HandDisplay from "./Components/HandDisplay";
import ChatBox from "./Components/ChatBox";
import type { ChatMessage } from "./Types/ChatMessage";
import PlayedCardDisplay from "./Components/PlayedCardDisplay";
import Game from "./classes/Game";
import Player from "./classes/Player";

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [myId, setMyId] = useState<number | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [gameState, setGameState] = useState(() => {
    const game = new Game();
    const player = new Player();
    player.drawCard(game.deck);
    return { game, player };
  });

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
      if (data.type === "welcome") setMyId(data.playerId);
      if (data.type === "chat") setMessages((prev) => [...prev, data]);
    };

    return () => ws.close();
  }, []);

  const refreshGameState = () => {
    setGameState((current) => ({ ...current }));
  };

  return (
    <div className="mx-auto p-8 text-center bg-gray-100">
      <div className="flex flex-row gap-5">
        <ChatBox wsRef={wsRef} messages={messages} myId={myId} />
        <PlayedCardDisplay player={gameState.player} />
      </div>
      <HandDisplay
        game={gameState.game}
        player={gameState.player}
        onStateChange={refreshGameState}
      />
    </div>
  );
}
