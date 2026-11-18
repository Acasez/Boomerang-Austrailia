import CardComponent from "./CardComponent";
import type Player from "@/classes/Player";

interface HandDisplayProps {
  player: Player;
  onSelectCard: (handIndex: number) => void;
  gameStarted: boolean;
  hasHand: boolean;
  gameOver: boolean;
  activityScored: boolean;
  selectionProgress: { readyCount: number; playerCount: number } | null;
}

export default function HandDisplay({
  player,
  onSelectCard,
  gameStarted,
  hasHand,
  gameOver,
  activityScored,
  selectionProgress,
}: HandDisplayProps) {
  const canSelect = gameStarted && hasHand && !gameOver;
  return (
    <div className="bg-blue-200 rounded-xl p-3">
      <h1 className="text-2xl underline">Hand</h1>
      {!hasHand && (
        <p>
          {gameStarted
            ? "You joined after the game started. Restart to receive cards."
            : "Start the game to be dealt cards."}
        </p>
      )}
      {player.selectedCard && (
        <p>
          Selected. Click another card to swap, or click this card to unselect.
        </p>
      )}
      {selectionProgress && (
        <p>
          Waiting for players: {selectionProgress.readyCount}/
          {selectionProgress.playerCount} selected.
        </p>
      )}
      {gameOver &&
        (activityScored ? (
          <p>Game complete. Restart to play again.</p>
        ) : (
          <p>All cards have been played. Choose an activity to score.</p>
        ))}
      <div className="flex flex-wrap gap-1 mt-5">
        {player.hand.map((card, index) => (
          <CardComponent
            key={`${card.name}-${index}`}
            card={card}
            onSelect={canSelect ? () => onSelectCard(index) : undefined}
            selected={player.selectedCard === card}
            hidden={false}
          />
        ))}
      </div>
    </div>
  );
}
