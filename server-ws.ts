import type { ServerWebSocket } from "bun";
import Game from "./src/classes/Game";
import Player from "./src/classes/Player";

const clients = new Map<ServerWebSocket, { id: number; player: Player }>();
const game = new Game();
let nextPlayerId = 1;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isMessageType(
  value: unknown,
  type: string,
): value is Record<string, unknown> {
  return isRecord(value) && value.type === type;
}

function broadcastSelectionProgress(): void {
  const readyCount = game.activePlayers.filter(
    (player) => player.selectedCard !== null,
  ).length;
  const payload = JSON.stringify({
    type: "selectionProgress",
    readyCount,
    playerCount: game.activePlayers.length,
  });

  for (const [clientSocket, client] of clients) {
    if (game.activePlayers.includes(client.player)) {
      clientSocket.send(payload);
    }
  }
}

function getPlayedRows(): { playerId: number; cards: Player["currentPlays"] }[] {
  return game.activePlayers.map((player) => {
    const connectedClient = Array.from(clients.values()).find(
      (client) => client.player === player,
    );
    if (!connectedClient) {
      throw new Error("An active player has no connected client.");
    }

    return {
      playerId: connectedClient.id,
      cards: player.currentPlays,
    };
  });
}

function broadcastResolvedRound(): void {
  const gameOver = game.activePlayers.every((player) => player.hand.length === 0);
  const playedRows = getPlayedRows();

  for (const [clientSocket, client] of clients) {
    if (!game.activePlayers.includes(client.player)) continue;

    clientSocket.send(
      JSON.stringify({
        type: "roundResolved",
        hand: client.player.hand,
        currentPlays: client.player.currentPlays,
        playedRows,
        roundNumber: game.roundNumber,
        gameOver,
      }),
    );
  }
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

      if (isMessageType(request, "startGame")) {
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
              playedRows: getPlayedRows(),
            }),
          );
        }
        return;
      }

      if (isMessageType(request, "selectCard")) {
        const handIndex = request.handIndex;
        if (typeof handIndex !== "number" || !Number.isInteger(handIndex)) {
          ws.send(
            JSON.stringify({
              type: "selectionError",
              message: "The selected hand index is invalid.",
            }),
          );
          return;
        }

        try {
          const playedCards = game.selectCard(client.player, handIndex);
          if (playedCards) {
            broadcastResolvedRound();
          } else {
            broadcastSelectionProgress();
          }
        } catch (error) {
          if (!(error instanceof Error)) throw error;
          ws.send(
            JSON.stringify({ type: "selectionError", message: error.message }),
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
      const playedCards = game.removePlayer(client.player);
      if (playedCards) {
        broadcastResolvedRound();
      } else {
        broadcastSelectionProgress();
      }
      console.log(`Player ${client.id} disconnected`);
    },
  },
});
