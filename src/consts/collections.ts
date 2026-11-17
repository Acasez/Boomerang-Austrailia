export const COLLECTIONS = [
  "Leaves",
  "Wildflowers",
  "Shells",
  "Souvenirs",
] as const;

export const COLLECTION_DETAILS = [
  {
    name: "Leaves",
    score: 1,
    image: "leaf",
    copies: 5,
  },
  {
    name: "Wildflowers",
    score: 2,
    image: "wildflower",
    copies: 4,
  },
  {
    name: "Shells",
    score: 3,
    image: "shell",
    copies: 3,
  },
  {
    name: "Souvenirs",
    score: 5,
    image: "souvenir",
    copies: 1,
  },
] as const;

export const SMALL_BAGGAGE_LIMIT = 7 as const;
export const SMALL_BAGGAGE_MULTIPLIER = 2 as const;
