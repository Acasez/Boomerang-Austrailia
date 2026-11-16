import type { Card } from "@/Types/Card";
import CardComponent from "./CardComponent";
import { useState } from "react";
import { getRandomCard } from "../Utils/CardUtils";

interface CardMarkerProps {}

export default function CardDisplay({}: CardMarkerProps) {
  const [card, setCard] = useState<Card>(getRandomCard);
  const deal = () => setCard(getRandomCard());
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
