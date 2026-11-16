import type { ServerWebSocket } from "bun";
import Game from "./src/classes/Game";
import Player from "./src/classes/Player";

const clients = new Map<ServerWebSocket, { id: number; player: Player }>();
const game = new Game();
let nextPlayerId = 1;

function isStartGameMessage(value: unknown): boolean {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    value.type === "startGame"
  );
}

Bun.serve({
  port: 2048,
  fetch(req, server) {
    if (server.upgrade(req)) return;
    return new Response("Expected WebSocket connection", { status: 400 });
  },
  websocket: {
    open(ws) {
      const player = new Player();
      game.players.push(player);

      const id = nextPlayerId++;
      clients.set(ws, { id, player });
      ws.send(JSON.stringify({
        type: "welcome",
        playerId: id,
        gameStarted: game.started,
      }));
      console.log(`Player ${id} connected`);
    },
    message(ws, message) {
      const client = clients.get(ws);
      if (!client) {
        console.error("Received a message from an unregistered client.");
        return;
      }

      let request: unknown;
      try {
        request = JSON.parse(String(message));
      } catch {
        request = null;
      }

      if (isStartGameMessage(request)) {
        try {
          game.startGame();
        } catch (error) {
          if (!(error instanceof Error)) throw error;
          ws.send(JSON.stringify({ type: "error", message: error.message }));
          return;
        }

        for (const [clientSocket, connectedClient] of clients) {
          clientSocket.send(
            JSON.stringify({
              type: "gameStarted",
              hand: connectedClient.player.hand,
            }),
          );
        }
        return;
      }

      const payload = JSON.stringify({
        type: "chat",
        senderId: client.id,
        text: String(message),
      });
      for (const client of clients.keys()) {
        client.send(payload);
      }
    },
    close(ws) {
      const client = clients.get(ws);
      if (!client) return;

      clients.delete(ws);
      game.removePlayer(client.player);
      console.log(`Player ${client.id} disconnected`);
    },
  },
});
