import CardComponent from "./CardComponent";
import type Player from "@/classes/Player";

interface PlayedCardDisplayProps {
  player: Player;
}

export default function PlayedCardDisplay({
  player,
}: PlayedCardDisplayProps) {
  return (
    <div>
      <div className="flex flex-wrap gap-4">
        {player.currentPlays.map((card, index) => (
          <CardComponent key={`${card.name}-${index}`} card={card} />
        ))}
      </div>
    </div>
  );
}
