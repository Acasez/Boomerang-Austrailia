import type { Activity } from "./Card";
import type { RegionName, Site } from "./Regions";

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
  claimedRegions: RegionName[];
  selectedActivity: Activity | null;
  activitySelectionMade: boolean;
  usedActivities: Activity[];
}
