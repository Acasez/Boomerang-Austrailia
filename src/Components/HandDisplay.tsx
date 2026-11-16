import CardComponent from "./CardComponent";
import type Player from "@/classes/Player";
import type { Card } from "@/Types/Card";

interface HandDisplayProps {
  player: Player;
  onStateChange: () => void;
}

export default function HandDisplay({
  player,
  onStateChange,
}: HandDisplayProps) {
  const playCard = (card: Card) => {
    player.playCard(card);
    onStateChange();
  };

  return (
    <div className="bg-blue-200 rounded-xl p-3">
      <h1 className="text-2xl underline mb-2">Hand</h1>
      <div className="flex flex-wrap gap-4 ">
        {player.hand.map((card, index) => (
          <CardComponent
            key={`${card.name}-${index}`}
            card={card}
            onPlay={playCard}
          />
        ))}
      </div>
    </div>
  );
}
