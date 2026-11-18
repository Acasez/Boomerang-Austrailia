import type { Card } from "./Card";
import type { PlayerInfo } from "./PlayerInfo";

export interface PlayedCardsRow {
  player: PlayerInfo;
  cards: Card[];
}

export type ServerMessage =
  | { type: "welcome"; playerId: number; gameStarted: boolean }
  | {
      type: "gameStarted";
      hand: Card[];
      playedRows: PlayedCardsRow[];
      turnNumber: number;
    }
  | { type: "selectionProgress"; readyCount: number; playerCount: number }
  | {
      type: "turnResolved";
      hand: Card[];
      currentPlays: Card[];
      playedRows: PlayedCardsRow[];
      turnNumber: number;
      gameOver: boolean;
    }
  | {
      type: "activityScoringProgress";
      readyCount: number;
      playerCount: number;
      playedRows: PlayedCardsRow[];
    }
  | { type: "activityScored"; playedRows: PlayedCardsRow[] }
  | { type: "error"; message: string }
  | { type: "selectionError"; message: string }
  | { type: "chat"; senderId: number; text: string };
