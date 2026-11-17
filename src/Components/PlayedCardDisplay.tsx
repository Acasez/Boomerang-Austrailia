import type { PlayedCardsRow } from "@/Types/ServerMessage";
import type { Card } from "@/Types/Card";
import CardComponent from "./CardComponent";

interface PlayedCardDisplayProps {
  ownPlayerId: number | null;
  rows: PlayedCardsRow[];
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
          <div key={row.player.id} className="flex items-center gap-4">
            <div className="bg-green-400 p-2 rounded-xl text-center">
              <h2>Player {row.player.id}</h2>
              <h3>Score: {row.player.score}</h3>
            </div>
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
