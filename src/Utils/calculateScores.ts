import { HAND_SIZE } from "@/consts/handzide";
import type { Card } from "@/Types/Card";

export function calculateRoundScores(playedCards: Card[]): number {
  if (playedCards.length === HAND_SIZE)
    return Math.abs(
      playedCards[0]!.throwValue - playedCards[HAND_SIZE - 1]!.throwValue,
    );

  //Todo Score for animals

  //Todo Score for collections

  //Todo Score for activities
  return 0;
}
