import { HAND_SIZE } from "@/consts/handsize";
import type { Card } from "@/Types/Card";
import { ANIMAL_DETAILS } from "@/consts/animals";
import {
  COLLECTION_DETAILS,
  SMALL_BAGGAGE_LIMIT,
  SMALL_BAGGAGE_MULTIPLIER,
} from "@/consts/collections";

export function calculateCollectionScore(playedCards: Card[]): number {
  let score = 0;

  //Todo Score for collections
  for (const item of COLLECTION_DETAILS) {
    const collectionCount = playedCards.filter(
      (card) => card.collection === item.name,
    ).length;
    let collectionScore = collectionCount * item.score;
    if (collectionScore >= SMALL_BAGGAGE_LIMIT)
      collectionScore * SMALL_BAGGAGE_MULTIPLIER;
    score += collectionScore;
  }

  return score;
}

export function calculateAnimalScore(playedCards: Card[]): number {
  let score = 0;

  //Animal Score
  for (const animal of ANIMAL_DETAILS) {
    const animalCount = playedCards.filter(
      (card) => card.animal === animal.name,
    ).length;
    score += Math.floor(animalCount / 2) * animal.score;
  }
  return score;
}

export function calculateThrowScore(playedCards: Card[]): number {
  let score = 0;

  //Throw Score
  if (playedCards.length === HAND_SIZE)
    score += Math.abs(
      playedCards[0]!.throwValue - playedCards[HAND_SIZE - 1]!.throwValue,
    );
  //Todo Score for locations
  return score;
}
