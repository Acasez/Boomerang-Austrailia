import { expect, test } from "bun:test";
import cards from "@/Data/cards";
import regions from "@/Data/regions";
import { ACTIVITIES } from "@/consts/activities";
import { ANIMALS } from "@/consts/animals";
import { COLLECTIONS } from "@/consts/collections";

test("every card has required fields and exactly two legal traits", () => {
  for (const card of cards) {
    expect(card.name.trim()).not.toBe("");
    expect(Number.isInteger(card.throwValue)).toBe(true);
    expect(card.throwValue).toBeGreaterThan(0);

    const traits = [card.collection, card.animal, card.activity].filter(
      (trait) => trait !== undefined,
    );
    expect(traits).toHaveLength(2);

    if (card.collection !== undefined) {
      expect(COLLECTIONS).toContain(card.collection);
    }
    if (card.animal !== undefined) {
      expect(ANIMALS).toContain(card.animal);
    }
    if (card.activity !== undefined) {
      expect(ACTIVITIES).toContain(card.activity);
    }
  }
});

test("every card's site belongs to its declared region", () => {
  for (const card of cards) {
    const region = regions.find(({ name }) => name === card.region);
    expect(region?.sites).toContain(card.site);
  }
});

test("the deck contains exactly one card for every configured site", () => {
  const cardSites = cards.map(({ site }) => site).sort();
  const configuredSites = regions.flatMap(({ sites }) => sites).sort();

  expect(new Set(cardSites).size).toBe(cardSites.length);
  expect(cardSites).toEqual(configuredSites);
});
