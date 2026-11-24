import type { PlayedCardsRow } from "@/Types/ServerMessage";
import type { Activity } from "@/Types/Card";
import CardComponent from "./CardComponent";
import PlayerScoreBoard from "./PlayerScoreBoard";

interface PlayedCardDisplayProps {
  ownPlayerId: number | null;
  rows: PlayedCardsRow[];
  activityScoring: boolean;
  activityProgress: { readyCount: number; playerCount: number } | null;
  onSelectActivity: (activity: Activity) => void;
  onSkipActivity: () => void;
}

export default function PlayedCardDisplay({
  rows,
  ownPlayerId,
  activityScoring,
  activityProgress,
  onSelectActivity,
  onSkipActivity,
}: PlayedCardDisplayProps) {
  return (
    <div className="bg-green-200 rounded-2xl px-3 pb-3 mt-5">
      <h1 className="text-2xl underline mb-2 bg-green-100 p-1 -mx-3 -mt-3 rounded-t-2xl px-3">
        Played Cards
      </h1>
      {activityScoring && (
        <p className="mb-2">
          Choose an unused activity to score, or skip this round.
          {activityProgress &&
            ` Players selected: ${activityProgress.readyCount}/${activityProgress.playerCount}.`}
        </p>
      )}
      <div className="flex flex-col gap-3">
        {rows.map((row) => (
          <div
            key={row.player.id}
            className="flex items-center gap-4 border-b-4 border-green-500 pb-1"
          >
            <PlayerScoreBoard
              player={row.player}
              ownPlayerId={ownPlayerId}
              activityScoring={activityScoring}
              onSelectActivity={onSelectActivity}
              onSkipActivity={onSkipActivity}
            />
            <div className="flex flex-row flex-nowrap gap-4 overflow-x-auto">
              {row.cards.map((card, index) => (
                <CardComponent
                  key={`${card.name}-${index}`}
                  card={card}
                  selected={false}
                  hidden={index === 0 && row.player.id !== ownPlayerId}
                />
              ))}
            </div>
          </div>
        ))}
        {rows.length === 0 && <p>No cards played yet.</p>}
      </div>
    </div>
  );
}
