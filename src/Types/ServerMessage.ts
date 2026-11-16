import type { Card } from "./Card";

export interface PlayedCardsRow {
  playerId: number;
  cards: Card[];
}

export type ServerMessage =
  | { type: "welcome"; playerId: number; gameStarted: boolean }
  | {
      type: "gameStarted";
      hand: Card[];
      playedRows: PlayedCardsRow[];
      roundNumber: number;
    }
  | { type: "selectionProgress"; readyCount: number; playerCount: number }
  | {
      type: "roundResolved";
      hand: Card[];
      currentPlays: Card[];
      playedRows: PlayedCardsRow[];
      roundNumber: number;
      gameOver: boolean;
    }
  | { type: "error"; message: string }
  | { type: "selectionError"; message: string }
  | { type: "chat"; senderId: number; text: string };
