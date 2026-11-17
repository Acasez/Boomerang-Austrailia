export const ACTIVITIES = [
  "Swimming",
  "Bushwalking",
  "Indigenous Culture",
  "Sightseeing",
] as const;

export const ACTIVITY_DETAILS = [
  {
    name: "Swimming",
    image: "swimming",
  },
  {
    name: "Bushwalking",
    image: "hiking",
  },
  {
    name: "Indigenous Culture",
    image: "boomerang",
  },
  {
    name: "Sightseeing",
    image: "sightseeing",
  },
] as const;

export const ACTIVITY_SCORE_TABLE = [
  {
    amount: 1,
    score: 0,
  },
  {
    amount: 2,
    score: 1,
  },
  {
    amount: 3,
    score: 4,
  },
  {
    amount: 4,
    score: 7,
  },
  {
    amount: 5,
    score: 10,
  },
  {
    amount: 6,
    score: 15,
  },
] as const;
