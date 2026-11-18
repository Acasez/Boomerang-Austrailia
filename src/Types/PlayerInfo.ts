import type { Activity } from "./Card";

export interface PlayerInfo {
  id: number;
  totalScore: number;

  roundScore: number;
  throwScore: number;
  animalScore: number;
  collectionScore: number;
  activityScore: number;
  mapScore: number;

  selectedActivity: Activity | null;
}
