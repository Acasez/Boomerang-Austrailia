import { HAND_SIZE } from "@/consts/handsize";
import type { Activity, Card } from "@/Types/Card";
import { getRandomCard } from "@/Utils/CardUtils";

export default class Player {
  totalScore = 0;

  roundScore = 0;

  throwScore = 0;
  animalScore = 0;
  collectionScore = 0;
  activityScore = 0;
  mapScore = 0;

  currentPlays: Card[] = [];
  hand: Card[] = [];
  selectedCard: Card | null = null;
  selectedActivity: Activity | null = null;

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
    this.roundScore = 0;

    this.throwScore = 0;
    this.animalScore = 0;
    this.collectionScore = 0;
    this.activityScore = 0;
    this.mapScore = 0;

    this.currentPlays = [];
    this.hand = [];
    this.selectedCard = null;
    this.selectedActivity = null;
  }
}
