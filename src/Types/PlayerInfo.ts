import type { Activity } from "./Card";
import type { RegionName, Site } from "./Regions";
import type { RoundScores } from "./Scores";

export interface PlayerInfo {
  id: number;
  totalScore: number;

  roundScores: RoundScores[];
  visitedSites: Site[];
  claimedRegions: RegionName[];
  selectedActivity: Activity | null;
  activitySelectionMade: boolean;
  usedActivities: Activity[];
}
