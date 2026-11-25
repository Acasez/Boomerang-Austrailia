import type { Activity, Card } from "@/Types/Card";
import { ACTIVITIES } from "@/consts/activities";
import regions from "@/Data/regions";
import type { PlayedCardsRow, ServerMessage } from "@/Types/ServerMessage";
import type { RegionName, Site } from "@/Types/Regions";
import type { RoundScores } from "@/Types/Scores";

const CARD_TRAITS = ["collection", "animal", "activity"] as const;
const SITE_NAMES = new Set<string>(regions.flatMap((region) => region.sites));
const REGION_NAMES = new Set<string>(regions.map((region) => region.name));

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

function isActivity(value: unknown): value is Activity {
  return (
    typeof value === "string" &&
    (ACTIVITIES as readonly string[]).includes(value)
  );
}

function isActivityArray(value: unknown): value is Activity[] {
  return Array.isArray(value) && value.every(isActivity);
}

function isSiteArray(value: unknown): value is Site[] {
  return (
    Array.isArray(value) &&
    value.every((site) => typeof site === "string" && SITE_NAMES.has(site))
  );
}

function isRegionNameArray(value: unknown): value is RegionName[] {
  return (
    Array.isArray(value) &&
    value.every(
      (regionName) =>
        typeof regionName === "string" && REGION_NAMES.has(regionName),
    )
  );
}

function isRoundScoresArray(value: unknown): value is RoundScores[] {
  return (
    Array.isArray(value) &&
    value.every(
      (score) =>
        isRecord(score) &&
        typeof score.roundScore === "number" &&
        typeof score.throwScore === "number" &&
        typeof score.animalScore === "number" &&
        typeof score.collectionScore === "number" &&
        typeof score.activityScore === "number" &&
        typeof score.mapScore === "number",
    )
  );
}

function isPlayedCardsRow(value: unknown): value is PlayedCardsRow {
  return (
    isRecord(value) &&
    isRecord(value.player) &&
    typeof value.player.id === "number" &&
    Number.isInteger(value.player.id) &&
    typeof value.player.totalScore === "number" &&
    isRoundScoresArray(value.player.roundScores) &&
    isSiteArray(value.player.visitedSites) &&
    isRegionNameArray(value.player.claimedRegions) &&
    (value.player.selectedActivity === null ||
      isActivity(value.player.selectedActivity)) &&
    typeof value.player.activitySelectionMade === "boolean" &&
    isActivityArray(value.player.usedActivities) &&
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
    case "gameInactive":
      return { type: "gameInactive" };
    case "gameStarted":
      if (
        isCardArray(value.hand) &&
        isPlayedCardsRowArray(value.playedRows) &&
        typeof value.turnNumber === "number" &&
        Number.isInteger(value.turnNumber) &&
        typeof value.round === "number" &&
        Number.isInteger(value.round)
      ) {
        return {
          type: "gameStarted",
          hand: value.hand,
          playedRows: value.playedRows,
          turnNumber: value.turnNumber,
          round: value.round,
        };
      }
      return null;
    case "roundStarted":
      if (
        isCardArray(value.hand) &&
        isPlayedCardsRowArray(value.playedRows) &&
        typeof value.turnNumber === "number" &&
        Number.isInteger(value.turnNumber) &&
        typeof value.round === "number" &&
        Number.isInteger(value.round)
      ) {
        return {
          type: "roundStarted",
          hand: value.hand,
          playedRows: value.playedRows,
          turnNumber: value.turnNumber,
          round: value.round,
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
    case "turnResolved":
      if (
        isCardArray(value.hand) &&
        isCardArray(value.currentPlays) &&
        isPlayedCardsRowArray(value.playedRows) &&
        typeof value.turnNumber === "number" &&
        Number.isInteger(value.turnNumber) &&
        typeof value.gameOver === "boolean"
      ) {
        return {
          type: "turnResolved",
          hand: value.hand,
          currentPlays: value.currentPlays,
          playedRows: value.playedRows,
          turnNumber: value.turnNumber,
          gameOver: value.gameOver,
        };
      }
      return null;
    case "activityScoringProgress":
      if (
        typeof value.readyCount === "number" &&
        Number.isInteger(value.readyCount) &&
        typeof value.playerCount === "number" &&
        Number.isInteger(value.playerCount) &&
        isPlayedCardsRowArray(value.playedRows)
      ) {
        return {
          type: "activityScoringProgress",
          readyCount: value.readyCount,
          playerCount: value.playerCount,
          playedRows: value.playedRows,
        };
      }
      return null;
    case "activityScored":
      if (isPlayedCardsRowArray(value.playedRows)) {
        return { type: "activityScored", playedRows: value.playedRows };
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
