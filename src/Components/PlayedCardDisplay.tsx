import CardComponent from "./CardComponent";
import type { Card } from "@/Types/Card";

interface PlayedCardDisplayProps {
  cards: Card[];
}

export default function PlayedCardDisplay({ cards }: PlayedCardDisplayProps) {
  return (
    <div className="bg-green-200 rounded-xl p-3">
      <h1 className="text-2xl underline mb-2">Played this round</h1>
      <div className="flex flex-wrap gap-4">
        {cards.map((card, index) => (
          <CardComponent
            key={`${card.name}-${index}`}
            card={card}
            selected={false}
          />
        ))}
      </div>
    </div>
  );
}
