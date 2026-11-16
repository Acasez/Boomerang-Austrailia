import { HAND_SIZE } from "@/consts/handzide";
import type { Card } from "@/Types/Card";
import { getRandomCard } from "@/Utils/CardUtils";

export default class Player {
  score: Number = 0;

  currentPlays: Card[] = [];
  hand: Card[] = [];

  drawCard(deck: Card[]): void {
    if (this.hand.length < HAND_SIZE) {
      this.hand.push(getRandomCard(deck));
    }
  }

  playCard(card: Card): void {
    const cardIndex = this.hand.indexOf(card);
    if (cardIndex === -1) {
      throw new Error("Cannot play a card that is not in the player's hand.");
    }

    this.currentPlays.push(...this.hand.splice(cardIndex, 1));
  }

  reset(): void {
    this.score = 0;
    this.currentPlays = [];
    this.hand = [];
  }
}
