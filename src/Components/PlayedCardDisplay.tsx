import type { PlayedCardsRow } from "@/Types/ServerMessage";
import CardComponent from "./CardComponent";
import PlayerScoreBoard from "./PlayerScoreBoard";

interface PlayedCardDisplayProps {
  ownPlayerId: number | null;
  rows: PlayedCardsRow[];
}

export default function PlayedCardDisplay({
  rows,
  ownPlayerId,
}: PlayedCardDisplayProps) {
  return (
    <div className="bg-green-200 rounded-xl px-3 pb-3">
      <h1 className="text-2xl underline mb-2 bg-green-100 p-1">Played Cards</h1>
      <div className="flex flex-col gap-4">
        {rows.map((row) => (
          <div key={row.player.id} className="flex items-center gap-4">
            <PlayerScoreBoard player={row.player} />
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
