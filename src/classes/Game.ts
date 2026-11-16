import cards from "@/Data/cards";
import { HAND_SIZE } from "@/consts/handzide";
import type { Card } from "@/Types/Card";
import type Player from "./Player";

export default class Game {
  deck: Card[] = [...cards];

  discardPile: Card[] = [];

  players: Player[] = [];

  private readonly dealtPlayers = new WeakSet<Player>();

  setupHands(deck: Card[]): void {
    const playersToDeal = this.players.filter(
      (player) => !this.dealtPlayers.has(player),
    );
    const cardsNeeded = playersToDeal.length * HAND_SIZE;

    if (deck.length < cardsNeeded) {
      throw new Error(
        `Cannot deal ${HAND_SIZE} cards to ${playersToDeal.length} player(s): only ${deck.length} cards remain.`,
      );
    }

    for (const player of playersToDeal) {
      for (let i = 0; i < HAND_SIZE; i++) {
        player.drawCard(deck);
      }
      this.dealtPlayers.add(player);
    }
  }

  removePlayer(player: Player): void {
    const playerIndex = this.players.indexOf(player);
    if (playerIndex !== -1) {
      this.players.splice(playerIndex, 1);
    }
  }
}
