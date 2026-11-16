import type { ChatMessage } from "@/Types/ChatMessage";
import { useState } from "react";

interface ChatBoxProps {
  wsRef: React.RefObject<WebSocket | null>;
  messages: ChatMessage[];
  myId: number | null;
}

export default function ChatBox({ wsRef, messages, myId }: ChatBoxProps) {
  const [input, setInput] = useState("");

  const send = () => {
    wsRef.current?.send(input);
    setInput("");
  };

  return (
    <div className="max-w-90">
      <h1 className="text-3xl font-bold mb-4 text-green-400">
        Chat {myId !== null && `(You are player ${myId})`}
      </h1>
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
    </div>
  );
}
