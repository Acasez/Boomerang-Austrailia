import { expect, test } from "bun:test";
import type { Activity, Animal, Card, Collection } from "@/Types/Card";
import { HAND_SIZE } from "@/consts/handSize";
import {
  calculateActivityScore,
  calculateAnimalScore,
  calculateCollectionScore,
  calculateThrowScore,
} from "@/Utils/calculateScores";

const baseCard = {
  name: "Test card",
  site: "A" as const,
  region: "Western Australia" as const,
  throwValue: 1,
};

function animalCard(animal: Animal): Card {
  return { ...baseCard, animal, activity: "Swimming" };
}

function activityCard(activity: Activity): Card {
  return { ...baseCard, animal: "Kangaroos", activity };
}

function collectionCard(collection: Collection): Card {
  return { ...baseCard, animal: "Kangaroos", collection };
}

function throwCard(throwValue: number): Card {
  return { ...baseCard, throwValue, animal: "Kangaroos", collection: "Leaves" };
}

test("scores complete animal pairs, not single extras", () => {
  const cards = [
    animalCard("Kangaroos"),
    animalCard("Kangaroos"),
    animalCard("Kangaroos"), // one extra kangaroo
    animalCard("Emus"),
    animalCard("Emus"),
    animalCard("Platypuses"), // unpaired
  ];

  expect(calculateAnimalScore(cards)).toBe(7); // 3 for kangaroos + 4 for emus
});

test("activity score increases at the scoring thresholds", () => {
  const cardsFor = (count: number) =>
    Array.from({ length: count }, () => activityCard("Swimming"));

  expect(calculateActivityScore(cardsFor(2), "Swimming")).toBe(1);
  expect(calculateActivityScore(cardsFor(3), "Swimming")).toBe(4);
  expect(calculateActivityScore(cardsFor(6), "Swimming")).toBe(15);
});

test("throw score needs a full hand", () => {
  const cards = Array.from({ length: HAND_SIZE }, (_, index) =>
    throwCard(index === 0 ? 2 : index === HAND_SIZE - 1 ? 9 : 4),
  );

  expect(calculateThrowScore(cards)).toBe(7);
  expect(calculateThrowScore(cards.slice(0, -1))).toBe(0);
});

test("adds scores for different collections", () => {
  const cards = [
    collectionCard("Leaves"),
    collectionCard("Leaves"),
    collectionCard("Shells"),
    collectionCard("Shells"),
  ];

  expect(calculateCollectionScore(cards)).toBe(8); // 2 + 6
});
