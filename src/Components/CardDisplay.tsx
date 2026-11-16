import type { Card } from "@/Types/Card";
import CardComponent from "./CardComponent";
import { useState } from "react";
import { getRandomCard } from "../Utils/CardUtils";
import Game from "../classes/Game";

interface CardDisplayState {
  game: Game;
  card: Card;
}

export default function CardDisplay() {
  const [state, setState] = useState<CardDisplayState>(() => {
    const game = new Game();
    return { game, card: getRandomCard(game.deck) };
  });

  const deal = () => {
    const card = getRandomCard(state.game.deck);
    setState({ game: state.game, card });
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
      <div>
        <CardComponent card={state.card} />
      </div>
    </div>
  );
}
