// data/cards.ts
import { ACTIVITIES, ANIMALS, COLLECTIONS, type Card } from "../Types/Card";
import rawCards from "../JSON/boomerang_australia.json";
import { oneOf } from "../Utils/validateCards";
import { REGIONS } from "../consts/regions";

/** Empty string in JSON means "trait not on this card" */
function optionalOneOf<T extends string>(
  allowed: readonly T[],
  value: unknown,
  where: string,
): T | undefined {
  if (value === undefined || value === "") return undefined;
  return oneOf(allowed, value, where);
}

export const cards: Card[] = rawCards.map((raw, i) => {
  const where = `cards[${i}] "${raw.name ?? "?"}"`;

  const base = {
    name: oneOf([raw.name as string], raw.name, `${where}: name`), // hmm, see note below
  };
  void base;

  const candidate = {
    name: String(raw.name ?? ""),
    site: String(raw.site ?? ""),
    region: oneOf(REGIONS, raw.region, `${where}: region`),
    throwValue: Number(raw.throwValue ?? 0),
    collection: optionalOneOf(
      COLLECTIONS,
      raw.collection,
      `${where}: collection`,
    ),
    animal: optionalOneOf(ANIMALS, raw.animal, `${where}: animal`),
    activity: optionalOneOf(ACTIVITIES, raw.activity, `${where}: activity`),
  };

  // The runtime check above narrows this optional-trait shape to a Card variant.
  const card = candidate as Card;
  return card;
});

export default cards;
