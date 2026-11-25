import { HAND_SIZE } from "@/consts/handSize";
import { ACTIVITY_SCORE_TABLE } from "@/consts/activities";
import type { Activity, Card } from "@/Types/Card";
import { ANIMAL_DETAILS } from "@/consts/animals";
import {
  COLLECTION_DETAILS,
  SMALL_BAGGAGE_LIMIT,
  SMALL_BAGGAGE_MULTIPLIER,
} from "@/consts/collections";

export function calculateCollectionScore(playedCards: Card[]): number {
  let score = 0;

  for (const item of COLLECTION_DETAILS) {
    const collectionCount = playedCards.filter(
      (card) => card.collection === item.name,
    ).length;
    score += collectionCount * item.score;
  }

  return score <= SMALL_BAGGAGE_LIMIT
    ? score * SMALL_BAGGAGE_MULTIPLIER
    : score;
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
  return score;
}

export function calculateActivityScore(
  playedCards: Card[],
  activity: Activity,
): number {
  const count = playedCards.filter((card) => card.activity === activity).length;
  return ACTIVITY_SCORE_TABLE.reduce(
    (score, entry) => (count >= entry.amount ? entry.score : score),
    0,
  );
}

export function calculateMapScore(playedCards: Card[]): number {
  let score = 0;

  return score;
}
