import { HAND_SIZE } from "@/consts/handsize";
import type { Card } from "@/Types/Card";
import { ANIMAL_POINTS } from "@/consts/animals";

export function calculateRoundScores(playedCards: Card[]): number {
  let score = 0;

  //Throw Score
  if (playedCards.length === HAND_SIZE)
    score += Math.abs(
      playedCards[0]!.throwValue - playedCards[HAND_SIZE - 1]!.throwValue,
    );

  //Animal Score
  for (const animal of ANIMAL_POINTS) {
    const animalCount = playedCards.filter(
      (card) => card.animal === animal.name,
    ).length;
    score += Math.floor(animalCount / 2) * animal.score;
  }

  //Todo Score for collections

  //Todo Score for activities
  return score;
}
