import type { Card } from "@/Types/Card";
import type { PlayedCardsRow, ServerMessage } from "@/Types/ServerMessage";

const CARD_TRAITS = ["collection", "animal", "activity"] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isCard(value: unknown): value is Card {
  return (
    isRecord(value) &&
    typeof value.name === "string" &&
    typeof value.site === "string" &&
    typeof value.region === "string" &&
    typeof value.throwValue === "number" &&
    CARD_TRAITS.filter((trait) => typeof value[trait] === "string").length === 2
  );
}

function isCardArray(value: unknown): value is Card[] {
  return Array.isArray(value) && value.every(isCard);
}

function isPlayedCardsRow(value: unknown): value is PlayedCardsRow {
  return (
    isRecord(value) &&
    typeof value.playerId === "number" &&
    Number.isInteger(value.playerId) &&
    isCardArray(value.cards)
  );
}

function isPlayedCardsRowArray(value: unknown): value is PlayedCardsRow[] {
  return Array.isArray(value) && value.every(isPlayedCardsRow);
}

export function parseServerMessage(value: unknown): ServerMessage | null {
  if (!isRecord(value) || typeof value.type !== "string") return null;

  switch (value.type) {
    case "welcome":
      if (
        typeof value.playerId === "number" &&
        Number.isInteger(value.playerId) &&
        typeof value.gameStarted === "boolean"
      ) {
        return {
          type: "welcome",
          playerId: value.playerId,
          gameStarted: value.gameStarted,
        };
      }
      return null;
    case "gameStarted":
      if (
        isCardArray(value.hand) &&
        isPlayedCardsRowArray(value.playedRows) &&
        typeof value.roundNumber === "number" &&
        Number.isInteger(value.roundNumber)
      ) {
        return {
          type: "gameStarted",
          hand: value.hand,
          playedRows: value.playedRows,
          roundNumber: value.roundNumber,
        };
      }
      return null;
    case "selectionProgress":
      if (
        typeof value.readyCount === "number" &&
        Number.isInteger(value.readyCount) &&
        typeof value.playerCount === "number" &&
        Number.isInteger(value.playerCount)
      ) {
        return {
          type: "selectionProgress",
          readyCount: value.readyCount,
          playerCount: value.playerCount,
        };
      }
      return null;
    case "roundResolved":
      if (
        isCardArray(value.hand) &&
        isCardArray(value.currentPlays) &&
        isPlayedCardsRowArray(value.playedRows) &&
        typeof value.roundNumber === "number" &&
        Number.isInteger(value.roundNumber) &&
        typeof value.gameOver === "boolean"
      ) {
        return {
          type: "roundResolved",
          hand: value.hand,
          currentPlays: value.currentPlays,
          playedRows: value.playedRows,
          roundNumber: value.roundNumber,
          gameOver: value.gameOver,
        };
      }
      return null;
    case "error":
    case "selectionError":
      return {
        type: value.type,
        message:
          typeof value.message === "string"
            ? value.message
            : "The server returned an error.",
      };
    case "chat":
      if (
        typeof value.senderId === "number" &&
        typeof value.text === "string"
      ) {
        return {
          type: "chat",
          senderId: value.senderId,
          text: value.text,
        };
      }
      return null;
    default:
      return null;
  }
}
