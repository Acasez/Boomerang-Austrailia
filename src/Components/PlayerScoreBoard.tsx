import type { PlayerInfo } from "@/Types/PlayerInfo";
import { ACTIVITIES } from "@/consts/activities";
import ActivityScoreMarker from "./ActivityScoreMarker";
import type { Activity } from "@/Types/Card";

interface PlayerScoreBoardProps {
  player: PlayerInfo;
  ownPlayerId: number | null;
  activityScoring: boolean;
  activityScored: boolean;
  onSelectActivity: (activity: Activity) => void;
}

export default function PlayerScoreBoard({
  player,
  ownPlayerId,
  activityScoring,
  activityScored,
  onSelectActivity,
}: PlayerScoreBoardProps) {
  const canSelect = activityScoring && player.id === ownPlayerId;

  return (
    <div className="flex flex-row gap-2">
      <div className="flex flex-col gap-1.5">
        {ACTIVITIES.map((symbol) => (
          <ActivityScoreMarker
            key={symbol}
            symbol={symbol}
            scoringMarker={canSelect}
            scored={activityScored && player.selectedActivity === symbol}
            selected={player.selectedActivity === symbol}
            onSelect={canSelect ? () => onSelectActivity(symbol) : undefined}
          />
        ))}
      </div>
      <div key={player.id} className="flex items-center gap-4">
        <div className="bg-green-400 p-2 rounded-xl text-center">
          <h2 className="text-xl underline">Player {player.id}</h2>
          <h3>Score: {player.totalScore}</h3>
          <h3 className="text-sm">Throw Score: {player.throwScore}</h3>
          <h3 className="text-sm">Animal Score: {player.animalScore}</h3>
          <h3 className="text-sm">
            Collection Score: {player.collectionScore}
          </h3>
          <h3 className="text-sm">Activity Score: {player.activityScore}</h3>
        </div>
      </div>
    </div>
  );
}
