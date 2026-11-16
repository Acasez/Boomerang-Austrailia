import CardComponent from "./CardComponent";
import { useState } from "react";
import Game from "../classes/Game";
import Player from "@/classes/Player";

interface HandDisplayState {
  game: Game;
  player: Player;
}

export default function PlayedCardDisplay() {
  const [state] = useState<HandDisplayState>(() => {
    const game = new Game();
    const player = new Player();
    return { game, player };
  });

  return (
    <div>
      <div className="flex flex-wrap gap-4">
        {state.player.currentPlays.map((card, index) => (
          <CardComponent key={`${card.name}-${index}`} card={card} />
        ))}
      </div>
    </div>
  );
}
