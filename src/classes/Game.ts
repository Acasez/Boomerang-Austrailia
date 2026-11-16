import cards from "@/Data/cards";
import { HAND_SIZE } from "@/consts/handzide";
import type { Card } from "@/Types/Card";
import type Player from "./Player";

export default class Game {
  deck: Card[] = [...cards];

  discardPile: Card[] = [];

  players: Player[] = [];

  started = false;

  setupHands(deck: Card[]): void {
    const cardsNeeded = this.players.length * HAND_SIZE;

    if (deck.length < cardsNeeded) {
      throw new Error(
        `Cannot deal ${HAND_SIZE} cards to ${this.players.length} player(s): only ${deck.length} cards remain.`,
      );
    }

    for (const player of this.players) {
      for (let i = 0; i < HAND_SIZE; i++) {
        player.drawCard(deck);
      }
    }
  }

  startGame(): void {
    const deck = [...cards];
    if (deck.length < this.players.length * HAND_SIZE) {
      throw new Error(
        `Cannot start a game with ${this.players.length} player(s): only ${deck.length} cards are available.`,
      );
    }

    for (const player of this.players) {
      player.reset();
    }

    this.deck = deck;
    this.discardPile = [];
    this.setupHands(this.deck);
    this.started = true;
  }

  removePlayer(player: Player): void {
    const playerIndex = this.players.indexOf(player);
    if (playerIndex !== -1) {
      this.players.splice(playerIndex, 1);
    }
  }
}
