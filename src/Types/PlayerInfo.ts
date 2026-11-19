import type { Activity, Site } from "./Card";

export interface PlayerInfo {
  id: number;
  totalScore: number;

  roundScore: number;
  throwScore: number;
  animalScore: number;
  collectionScore: number;
  activityScore: number;
  mapScore: number;

  visitedSites: Site[];
  selectedActivity: Activity | null;
  activitySelectionMade: boolean;
  usedActivities: Activity[];
}
