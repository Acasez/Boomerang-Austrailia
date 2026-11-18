import type { Activity } from "./Card";

export interface PlayerInfo {
  id: number;
  score: number;

  throwScore: number;
  animalScore: number;
  collectionScore: number;
  activityScore: number;

  selectedActivity: Activity | null;
}
