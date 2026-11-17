import { HAND_SIZE } from "@/consts/handsize";
import type { Card } from "@/Types/Card";
import { getRandomCard } from "@/Utils/CardUtils";

export default class Player {
  totalScore = 0;
  score = 0;

  currentPlays: Card[] = [];
  hand: Card[] = [];
  selectedCard: Card | null = null;

  drawCard(deck: Card[]): void {
    if (this.hand.length < HAND_SIZE) {
      this.hand.push(getRandomCard(deck));
    }
  }

  selectCard(card: Card | null): void {
    if (card !== null && !this.hand.includes(card)) {
      throw new Error("Cannot select a card that is not in the player's hand.");
    }

    this.selectedCard = card;
  }

  reset(): void {
    this.totalScore = 0;
    this.score = 0;
    this.currentPlays = [];
    this.hand = [];
    this.selectedCard = null;
  }
}
