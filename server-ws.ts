import type { ServerWebSocket } from "bun";
import { ACTIVITIES } from "./src/consts/activities";
import Game from "./src/classes/Game";
import Player from "./src/classes/Player";
import type { Activity } from "./src/Types/Card";
import type { PlayedCardsRow } from "./src/Types/ServerMessage";

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

function isHandIndex(value: unknown): value is number | null {
  return (
    value === null || (typeof value === "number" && Number.isInteger(value))
  );
}

function isActivity(value: unknown): value is Activity {
  return (
    typeof value === "string" &&
    (ACTIVITIES as readonly string[]).includes(value)
  );
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

function getPlayedRows(): PlayedCardsRow[] {
  return game.activePlayers.map((player) => {
    const connectedClient = Array.from(clients.values()).find(
      (client) => client.player === player,
    );
    if (!connectedClient) {
      throw new Error("An active player has no connected client.");
    }

    return {
      player: {
        id: connectedClient.id,
        score: player.roundScore,
        throwScore: player.throwScore,
        animalScore: player.animalScore,
        collectionScore: player.collectionScore,
        activityScore: player.activityScore,
        selectedActivity: player.selectedActivity,
      },
      cards: player.currentPlays,
    };
  });
}

function sendResolvedRound(
  clientSocket: ServerWebSocket,
  client: { id: number; player: Player },
  playedRows: PlayedCardsRow[],
): void {
  const gameOver = game.activePlayers.every(
    (player) => player.hand.length === 0,
  );
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

function broadcastActivityScoringProgress(): void {
  const readyCount = game.activePlayers.filter(
    (player) => player.selectedActivity !== null,
  ).length;
  const payload = JSON.stringify({
    type: "activityScoringProgress",
    readyCount,
    playerCount: game.activePlayers.length,
    playedRows: getPlayedRows(),
  });

  for (const [clientSocket, client] of clients) {
    if (game.activePlayers.includes(client.player)) {
      clientSocket.send(payload);
    }
  }
}

function broadcastActivityScored(): void {
  const payload = JSON.stringify({
    type: "activityScored",
    playedRows: getPlayedRows(),
  });

  for (const [clientSocket, client] of clients) {
    if (game.activePlayers.includes(client.player)) {
      clientSocket.send(payload);
    }
  }
}

function broadcastResolvedRound(): void {
  const playedRows = getPlayedRows();
  for (const [clientSocket, client] of clients) {
    if (!game.activePlayers.includes(client.player)) continue;
    sendResolvedRound(clientSocket, client, playedRows);
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
      ws.send(
        JSON.stringify({
          type: "welcome",
          playerId: id,
          gameStarted: game.started,
        }),
      );
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
              roundNumber: game.roundNumber,
            }),
          );
        }
        return;
      }

      if (isMessageType(request, "selectCard")) {
        const handIndex = request.handIndex;
        const roundNumber = request.roundNumber;
        if (
          !isHandIndex(handIndex) ||
          typeof roundNumber !== "number" ||
          !Number.isInteger(roundNumber)
        ) {
          ws.send(
            JSON.stringify({
              type: "selectionError",
              message: "The selection request is invalid.",
            }),
          );
          return;
        }

        if (!game.activePlayers.includes(client.player)) {
          ws.send(
            JSON.stringify({
              type: "selectionError",
              message: "This player is not in the active game.",
            }),
          );
          return;
        }

        if (roundNumber !== game.roundNumber) {
          sendResolvedRound(ws, client, getPlayedRows());
          return;
        }

        try {
          const playedCards = game.selectCard(
            client.player,
            handIndex,
            roundNumber,
          );
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

      if (isMessageType(request, "selectActivity")) {
        if (!isActivity(request.activity)) {
          ws.send(
            JSON.stringify({
              type: "error",
              message: "The selected activity is invalid.",
            }),
          );
          return;
        }

        try {
          if (game.selectActivity(client.player, request.activity)) {
            broadcastActivityScored();
          } else {
            broadcastActivityScoringProgress();
          }
        } catch (error) {
          if (!(error instanceof Error)) throw error;
          ws.send(JSON.stringify({ type: "error", message: error.message }));
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
      const activityScoringWasComplete = game.activityScoringComplete;
      const playedCards = game.removePlayer(client.player);
      if (playedCards) {
        broadcastResolvedRound();
      } else if (
        !activityScoringWasComplete &&
        game.activityScoringComplete
      ) {
        broadcastActivityScored();
      } else if (
        game.started &&
        game.activePlayers.length > 0 &&
        game.activePlayers.every((player) => player.hand.length === 0)
      ) {
        broadcastActivityScoringProgress();
      } else {
        broadcastSelectionProgress();
      }
      console.log(`Player ${client.id} disconnected`);
    },
  },
});
