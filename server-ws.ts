import type { ServerWebSocket } from "bun";
import { HAND_SIZE } from "./src/consts/handzide";
import Game from "./src/classes/Game";
import Player from "./src/classes/Player";

const clients = new Map<ServerWebSocket, { id: number; player: Player }>();
const game = new Game();
let nextPlayerId = 1;

Bun.serve({
  port: 2048,
  fetch(req, server) {
    if (server.upgrade(req)) return;
    return new Response("Expected WebSocket connection", { status: 400 });
  },
  websocket: {
    open(ws) {
      const player = new Player();
      if (game.deck.length < HAND_SIZE) {
        const message = "Not enough cards remain to deal another player.";
        ws.send(JSON.stringify({ type: "error", message }));
        ws.close(1013, message);
        return;
      }

      game.players.push(player);
      game.setupHands(game.deck);

      const id = nextPlayerId++;
      clients.set(ws, { id, player });
      ws.send(
        JSON.stringify({ type: "welcome", playerId: id, hand: player.hand }),
      );
      console.log(`Player ${id} connected`);
    },
    message(ws, message) {
      const client = clients.get(ws);
      if (!client) {
        console.error("Received a message from an unregistered client.");
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
