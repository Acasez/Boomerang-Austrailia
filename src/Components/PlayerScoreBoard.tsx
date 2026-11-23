import type { PlayerInfo } from "@/Types/PlayerInfo";
import { ACTIVITIES } from "@/consts/activities";
import ActivityScoreMarker from "./ActivityScoreMarker";
import type { Activity } from "@/Types/Card";
import SiteMarker from "./SiteMarker";

interface PlayerScoreBoardProps {
  player: PlayerInfo;
  ownPlayerId: number | null;
  activityScoring: boolean;
  onSelectActivity: (activity: Activity) => void;
  onSkipActivity: () => void;
}

export default function PlayerScoreBoard({
  player,
  ownPlayerId,
  activityScoring,
  onSelectActivity,
  onSkipActivity,
}: PlayerScoreBoardProps) {
  const canSelect = activityScoring && player.id === ownPlayerId;

  return (
    <div className="flex flex-row gap-2">
      <div className="flex flex-col gap-1.5">
        {ACTIVITIES.map((symbol) => (
          <ActivityScoreMarker
            key={symbol}
            symbol={symbol}
            scoringMarker={canSelect && !player.usedActivities.includes(symbol)}
            scored={player.usedActivities.includes(symbol)}
            selected={player.selectedActivity === symbol}
            onSelect={
              canSelect && !player.usedActivities.includes(symbol)
                ? () => onSelectActivity(symbol)
                : undefined
            }
          />
        ))}
        {canSelect && (
          <button
            type="button"
            className={`rounded-lg px-2 py-1 text-xs ${player.activitySelectionMade && player.selectedActivity === null ? "bg-blue-600 text-white" : "bg-gray-100"}`}
            onClick={onSkipActivity}
          >
            Skip
          </button>
        )}
      </div>
      <div key={player.id} className="flex flex-col items-center gap-2">
        <div className="bg-green-400 p-2 rounded-xl text-center">
          <h2 className="text-xl underline">Player {player.id}</h2>
          <h3>
            Score: [<span className="text-blue-600">{player.totalScore}</span>]{" "}
            + {player.roundScore}
          </h3>
          <h3 className="text-sm">Throw Score: {player.throwScore}</h3>
          <h3 className="text-sm">Animal Score: {player.animalScore}</h3>
          <h3 className="text-sm">
            Collection Score: {player.collectionScore}
          </h3>
          <h3 className="text-sm">Activity Score: {player.activityScore}</h3>
          <h3 className="text-sm">Map Score: {player.mapScore}</h3>
          {activityScoring &&
            player.id === ownPlayerId &&
            player.activitySelectionMade && (
              <p className="text-xs">
                {player.selectedActivity
                  ? `Selected: ${player.selectedActivity}`
                  : "Skipping this round"}
              </p>
            )}
        </div>
        <div className="flex flex-wrap max-w-35 ml-3">
          {[...player.visitedSites]
            .sort((a, b) => a.localeCompare(b))
            .map((site) => (
              <SiteMarker
                key={site}
                site={site}
                visitedSite={true}
                inCollection={true}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
