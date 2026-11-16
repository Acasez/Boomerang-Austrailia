import cards from "../Data/cards";
import type { Card } from "@/Types/Card";

export function getRandomCard(): Card {
  const card = cards[Math.floor(Math.random() * cards.length)];
  if (!card) {
    throw new Error("Cannot select a card from an empty deck.");
  }
  return card;
}
