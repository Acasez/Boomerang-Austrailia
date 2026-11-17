export const COLLECTIONS = [
  "Leaves",
  "Wildflowers",
  "Shells",
  "Souvenirs",
] as const;

export const COLLECTION_POINTS = [
  {
    name: "Leaves",
    score: 1,
  },
  {
    name: "Wildflowers",
    score: 2,
  },
  {
    name: "Shells",
    score: 3,
  },
  {
    name: "Souvenirs",
    score: 5,
  },
] as const;

export const SMALL_BAGGAGE_LIMIT = 7 as const;
export const SMALL_BAGGAGE_MULTIPLIER = 2 as const;
