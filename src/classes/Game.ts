import cards from "@/Data/cards";
import type { Card } from "@/Types/Card";

export default class Game {
  deck: Card[] = [...cards];

  discardPile: Card[] = [];
}
