import { useEffect, useRef, useState } from "react";
import "./index.css";
import CardDisplay from "./Components/CardDisplay";
import ChatBox from "./Components/ChatBox";
import type { ChatMessage } from "./Types/ChatMessage";

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [myId, setMyId] = useState<number | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

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

  return (
    <div className="mx-auto p-8 text-center bg-gray-100">
      <ChatBox wsRef={wsRef} messages={messages} myId={myId} />
      <CardDisplay />
    </div>
  );
}
