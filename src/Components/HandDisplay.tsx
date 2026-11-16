import CardComponent from "./CardComponent";
import type Game from "../classes/Game";
import type Player from "@/classes/Player";
import type { Card } from "@/Types/Card";

interface HandDisplayProps {
  game: Game;
  player: Player;
  onStateChange: () => void;
}

export default function HandDisplay({
  game,
  player,
  onStateChange,
}: HandDisplayProps) {
  const deal = () => {
    player.drawCard(game.deck);
    onStateChange();
  };

  const playCard = (card: Card) => {
    player.playCard(card);
    onStateChange();
  };

  return (
    <div>
      {" "}
      <button
        className="p-2 border-2 border-blue-600 bg-blue-400 rounded-2xl mb-2"
        onClick={deal}
        disabled={game.deck.length === 0}
      >
        Deal random card
      </button>
      {game.deck.length === 0 && <p>No cards left in the deck.</p>}
      <div className="flex flex-wrap gap-4">
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
