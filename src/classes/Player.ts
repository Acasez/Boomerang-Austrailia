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
}
