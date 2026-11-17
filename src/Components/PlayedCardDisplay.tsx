import CardComponent from "./CardComponent";
import type { Card } from "@/Types/Card";

interface PlayedCardDisplayProps {
  ownPlayerId: number | null;
  rows: { playerId: number; cards: Card[] }[];
}

export default function PlayedCardDisplay({
  rows,
  ownPlayerId,
}: PlayedCardDisplayProps) {
  return (
    <div className="bg-green-200 rounded-xl p-3">
      <h1 className="text-2xl underline mb-2">Played Cards</h1>
      <div className="flex flex-col gap-4">
        {rows.map((row) => (
          <div key={row.playerId} className="flex items-center gap-4">
            <h2 className="bg-green-400 p-2 rounded-xl text-center">
              Player {row.playerId}
            </h2>
            <div className="flex flex-row flex-nowrap gap-4 overflow-x-auto">
              {row.cards.map((card, index) => (
                <CardComponent
                  key={`${card.name}-${index}`}
                  card={card}
                  selected={false}
                  hidden={index === 0 && row.playerId !== ownPlayerId}
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
