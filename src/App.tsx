import { useEffect, useRef, useState } from "react";
import "./index.css";
import CardDisplay from "./Components/CardDisplay";

type ChatMessage = { senderId: number; text: string };

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [myId, setMyId] = useState<number | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:2048");
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "welcome") setMyId(data.playerId);
      if (data.type === "chat") setMessages((prev) => [...prev, data]);
    };

    return () => ws.close();
  }, []);

  const send = () => {
    wsRef.current?.send(input);
    setInput("");
  };

  return (
    <div className="max-w-7xl mx-auto p-8 text-center">
      <h1 className="text-3xl font-bold mb-4 text-green-400">Chat test</h1>
      <div className="border p-4 mb-4 text-left h-64 overflow-y-auto">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={msg.senderId === myId ? "text-blue-400" : "text-red-400"}
          >
            Player {msg.senderId}: {msg.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2 justify-center mb-5">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          className="border px-2 py-1"
        />
        <button onClick={send} className="border px-4 py-1">
          Send
        </button>
      </div>
      <CardDisplay />
    </div>
  );
}
