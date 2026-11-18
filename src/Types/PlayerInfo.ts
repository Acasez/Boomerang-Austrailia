import type { Activity } from "./Card";

export interface PlayerInfo {
  id: number;
  score: number;

  throwScore: number;
  animalScore: number;
  collectionScore: number;

  scoredActivities: Activity[];
}
