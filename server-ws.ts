import type { ServerWebSocket } from "bun";

const clients = new Map<ServerWebSocket, number>();
let nextPlayerId = 1;

Bun.serve({
  port: 2048,
  fetch(req, server) {
    if (server.upgrade(req)) return;
    return new Response("Expected WebSocket connection", { status: 400 });
  },
  websocket: {
    open(ws) {
      const id = nextPlayerId++;
      clients.set(ws, id);
      ws.send(JSON.stringify({ type: "welcome", playerId: id }));
      console.log(`Player ${id} connected`);
    },
    message(ws, message) {
      const senderId = clients.get(ws)!;
      const payload = JSON.stringify({
        type: "chat",
        senderId,
        text: String(message),
      });
      for (const client of clients.keys()) {
        client.send(payload);
      }
    },
    close(ws) {
      const id = clients.get(ws);
      clients.delete(ws);
      console.log(`Player ${id} disconnected`);
    },
  },
});
