import type { ServerWebSocket } from "bun";
import Game from "../src/classes/Game";
import Player from "../src/classes/Player";
import type { PlayedCardsRow, ServerMessage } from "../src/Types/ServerMessage";
import { isActivityChoice, isHandIndex, isRecord } from "./serverTypeChecks";

type Client = { id: number; player: Player };

const clients = new Map<ServerWebSocket, Client>();
const game = new Game();
let nextPlayerId = 1;

function sendMessage(socket: ServerWebSocket, message: ServerMessage): void {
  socket.send(JSON.stringify(message));
}

function forEachActiveClient(
  callback: (socket: ServerWebSocket, client: Client) => void,
): void {
  for (const [socket, client] of clients) {
    if (game.activePlayers.includes(client.player)) {
      callback(socket, client);
    }
  }
}

function getPlayedRows(): PlayedCardsRow[] {
  const clientsByPlayer = new Map(
    Array.from(clients.values(), (client) => [client.player, client]),
  );

  return game.activePlayers.map((player) => {
    const client = clientsByPlayer.get(player);
    if (!client) {
      throw new Error("An active player has no connected client.");
    }

    return {
      player: {
        id: client.id,
        totalScore: player.totalScore,
        roundScores: player.roundScores,
        visitedSites: player.visitedSites,
        claimedRegions: player.claimedRegions,
        selectedActivity: player.selectedActivity,
        activitySelectionMade: player.activitySelectionMade,
        usedActivities: player.usedActivities,
      },
      cards: player.currentPlays,
    };
  });
}

function sendResolvedTurn(
  socket: ServerWebSocket,
  client: Client,
  playedRows: PlayedCardsRow[],
): void {
  sendMessage(socket, {
    type: "turnResolved",
    hand: client.player.hand,
    currentPlays: client.player.currentPlays,
    playedRows,
    turnNumber: game.turnNumber,
    gameOver: game.activePlayers.every((player) => player.hand.length === 0),
  });
}

function broadcastSelectionProgress(): void {
  const message: ServerMessage = {
    type: "selectionProgress",
    readyCount: game.activePlayers.filter(
      (player) => player.selectedCard !== null,
    ).length,
    playerCount: game.activePlayers.length,
  };
  forEachActiveClient((socket) => sendMessage(socket, message));
}

function broadcastActivityScoringProgress(): void {
  const message: ServerMessage = {
    type: "activityScoringProgress",
    readyCount: game.activePlayers.filter(
      (player) => player.activitySelectionMade,
    ).length,
    playerCount: game.activePlayers.length,
    playedRows: getPlayedRows(),
  };
  forEachActiveClient((socket) => sendMessage(socket, message));
}

function broadcastActivityScored(): void {
  const message: ServerMessage = {
    type: "activityScored",
    playedRows: getPlayedRows(),
  };
  forEachActiveClient((socket) => sendMessage(socket, message));
}

function broadcastRoundStarted(): void {
  const playedRows = getPlayedRows();
  forEachActiveClient((socket, client) => {
    sendMessage(socket, {
      type: "roundStarted",
      hand: client.player.hand,
      playedRows,
      turnNumber: game.turnNumber,
      round: game.round,
      passRight: game.passRight,
      alternatePassDirection: game.alternatePassDirection,
    });
  });
}

function broadcastResolvedTurn(): void {
  const playedRows = getPlayedRows();
  forEachActiveClient((socket, client) =>
    sendResolvedTurn(socket, client, playedRows),
  );
}

function handleStartGame(
  socket: ServerWebSocket,
  activePlayers: Player[],
  allowSolo = false,
): void {
  try {
    game.startGame(activePlayers, allowSolo);
  } catch (error) {
    if (!(error instanceof Error)) throw error;
    sendMessage(socket, { type: "error", message: error.message });
    return;
  }

  const playedRows = getPlayedRows();
  for (const [clientSocket, client] of clients) {
    if (!game.activePlayers.includes(client.player)) {
      sendMessage(clientSocket, { type: "gameInactive" });
      continue;
    }

    sendMessage(clientSocket, {
      type: "gameStarted",
      hand: client.player.hand,
      playedRows,
      turnNumber: game.turnNumber,
      round: game.round,
      passRight: game.passRight,
      alternatePassDirection: game.alternatePassDirection,
    });
  }
}

function handleSetAlternatePassDirection(enabled: boolean): void {
  game.alternatePassDirection = enabled;
  const message: ServerMessage = {
    type: "passDirectionUpdated",
    passRight: game.passRight,
    alternatePassDirection: game.alternatePassDirection,
  };
  for (const socket of clients.keys()) {
    sendMessage(socket, message);
  }
}

function handleSelectCard(
  socket: ServerWebSocket,
  client: Client,
  request: Record<string, unknown>,
): void {
  const { handIndex, turnNumber } = request;
  if (
    !isHandIndex(handIndex) ||
    typeof turnNumber !== "number" ||
    !Number.isInteger(turnNumber)
  ) {
    sendMessage(socket, {
      type: "selectionError",
      message: "The selection request is invalid.",
    });
    return;
  }

  if (!game.activePlayers.includes(client.player)) {
    sendMessage(socket, {
      type: "selectionError",
      message: "This player is not in the active game.",
    });
    return;
  }

  if (turnNumber !== game.turnNumber) {
    sendResolvedTurn(socket, client, getPlayedRows());
    return;
  }

  try {
    const playedCards = game.selectCard(client.player, handIndex, turnNumber);
    if (playedCards) {
      broadcastResolvedTurn();
    } else {
      broadcastSelectionProgress();
    }
  } catch (error) {
    if (!(error instanceof Error)) throw error;
    sendMessage(socket, {
      type: "selectionError",
      message: error.message,
    });
  }
}

function handleSelectActivity(
  socket: ServerWebSocket,
  client: Client,
  request: Record<string, unknown>,
): void {
  if (!isActivityChoice(request.activity)) {
    sendMessage(socket, {
      type: "error",
      message: "The activity selection is invalid.",
    });
    return;
  }

  try {
    const previousRound = game.round;
    if (game.selectActivity(client.player, request.activity)) {
      if (game.round !== previousRound) {
        broadcastRoundStarted();
      } else {
        broadcastActivityScored();
      }
    } else {
      broadcastActivityScoringProgress();
    }
  } catch (error) {
    if (!(error instanceof Error)) throw error;
    sendMessage(socket, { type: "error", message: error.message });
  }
}

function handleChat(client: Client, message: string | Buffer): void {
  const payload: ServerMessage = {
    type: "chat",
    senderId: client.id,
    text: String(message),
  };
  for (const socket of clients.keys()) {
    sendMessage(socket, payload);
  }
}

function handleMessage(
  socket: ServerWebSocket,
  message: string | Buffer,
): void {
  const client = clients.get(socket);
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

  if (isRecord(request)) {
    switch (request.type) {
      case "startGame":
        handleStartGame(
          socket,
          Array.from(clients.values(), (connectedClient) => connectedClient.player),
        );
        return;
      case "startSolo":
        handleStartGame(socket, [client.player], true);
        return;
      case "selectCard":
        handleSelectCard(socket, client, request);
        return;
      case "selectActivity":
        handleSelectActivity(socket, client, request);
        return;
      case "setAlternatePassDirection":
        if (typeof request.enabled !== "boolean") {
          sendMessage(socket, {
            type: "error",
            message: "The alternate pass direction setting is invalid.",
          });
          return;
        }
        handleSetAlternatePassDirection(request.enabled);
        return;
    }
  }

  handleChat(client, message);
}

function handleClose(socket: ServerWebSocket): void {
  const client = clients.get(socket);
  if (!client) return;

  clients.delete(socket);
  const previousRound = game.round;
  const activityScoringWasComplete = game.activityScoringComplete;
  const playedCards = game.removePlayer(client.player);
  if (playedCards) {
    broadcastResolvedTurn();
  } else if (game.round !== previousRound) {
    broadcastRoundStarted();
  } else if (!activityScoringWasComplete && game.activityScoringComplete) {
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
}

Bun.serve({
  port: 2048,
  fetch(req, server) {
    if (server.upgrade(req)) return;
    return new Response("Expected WebSocket connection", { status: 400 });
  },
  websocket: {
    open(socket) {
      const player = new Player();
      game.players.push(player);

      const id = nextPlayerId++;
      clients.set(socket, { id, player });
      sendMessage(socket, {
        type: "welcome",
        playerId: id,
        gameStarted: game.started,
        passRight: game.passRight,
        alternatePassDirection: game.alternatePassDirection,
      });
      console.log(`Player ${id} connected`);
    },
    message: handleMessage,
    close: handleClose,
  },
});
