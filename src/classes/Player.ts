import { HAND_SIZE } from "@/consts/handzide";
import type { Card } from "@/Types/Card";
import { getRandomCard } from "@/Utils/CardUtils";

export default class Player {
  score: Number = 0;

  currentPlays: Card[] = [];
  hand: Card[] = [];
  selectedCard: Card | null = null;

  drawCard(deck: Card[]): void {
    if (this.hand.length < HAND_SIZE) {
      this.hand.push(getRandomCard(deck));
    }
  }

  selectCard(card: Card): void {
    if (!this.hand.includes(card)) {
      throw new Error("Cannot select a card that is not in the player's hand.");
    }

    if (this.selectedCard !== null) {
      throw new Error("This player has already selected a card.");
    }

    this.selectedCard = card;
  }

  reset(): void {
    this.score = 0;
    this.currentPlays = [];
    this.hand = [];
    this.selectedCard = null;
  }
}
