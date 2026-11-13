import type { Card } from "@/Types/Card";
import CardComponent from "./CardComponent";
import cards from "@/Data/cards";
import { useState } from "react";

function randomCard(): Card {
  const card = cards[Math.floor(Math.random() * cards.length)];
  if (!card) {
    throw new Error("Cannot select a card from an empty deck.");
  }
  return card;
}

interface CardMarkerProps {}

export default function CardDisplay({}: CardMarkerProps) {
  const [card, setCard] = useState<Card>(randomCard);
  const deal = () => setCard(randomCard());
  return (
    <div>
      {" "}
      <button
        className="p-2 border-2 border-blue-600 bg-blue-400 rounded-2xl mb-2"
        onClick={deal}
      >
        Deal random card
      </button>
      <div>
        <CardComponent card={card} />
      </div>
    </div>
  );
}
