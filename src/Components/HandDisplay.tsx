import CardComponent from "./CardComponent";
import { useState } from "react";
import Game from "../classes/Game";
import Player from "@/classes/Player";

interface HandDisplayState {
  game: Game;
  player: Player;
}

export default function HandDisplay() {
  const [state, setState] = useState<HandDisplayState>(() => {
    const game = new Game();
    const player = new Player();
    player.drawCard(game.deck);
    return { game, player };
  });

  const deal = () => {
    state.player.drawCard(state.game.deck);
    setState({ game: state.game, player: state.player });
  };

  return (
    <div>
      {" "}
      <button
        className="p-2 border-2 border-blue-600 bg-blue-400 rounded-2xl mb-2"
        onClick={deal}
        disabled={state.game.deck.length === 0}
      >
        Deal random card
      </button>
      {state.game.deck.length === 0 && <p>No cards left in the deck.</p>}
      <div className="flex flex-wrap gap-4">
        {state.player.hand.map((card, index) => (
          <CardComponent key={`${card.name}-${index}`} card={card} />
        ))}
      </div>
    </div>
  );
}
