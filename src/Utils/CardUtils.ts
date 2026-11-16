import type { Card } from "@/Types/Card";

export function getRandomCard(deck: Card[]): Card {
  const index = Math.floor(Math.random() * deck.length);
  const [card] = deck.splice(index, 1);
  if (!card) {
    throw new Error("Cannot select a card from an empty deck.");
  }
  return card;
}
