import cards from "@/Data/cards";
import { HAND_SIZE } from "@/consts/handzide";
import type { Card } from "@/Types/Card";
import type Player from "./Player";

export default class Game {
  deck: Card[] = [...cards];

  discardPile: Card[] = [];

  players: Player[] = [];
  activePlayers: Player[] = [];
  roundNumber = 0;

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
    this.activePlayers = [...this.players];
    this.roundNumber = 0;
    this.started = true;
  }

  selectCard(
    player: Player,
    handIndex: number | null,
    roundNumber: number,
  ): Card[] | null {
    if (!this.started || !this.activePlayers.includes(player)) {
      throw new Error("This player is not in the active game.");
    }

    if (roundNumber !== this.roundNumber) {
      throw new Error("This selection belongs to a different round.");
    }

    if (handIndex === null) {
      player.selectCard(null);
      return null;
    }

    if (!Number.isInteger(handIndex)) {
      throw new Error("The selected hand index is invalid.");
    }

    const card = player.hand[handIndex];
    if (!card) {
      throw new Error("The selected card is not in the player's hand.");
    }

    player.selectCard(card);
    if (this.activePlayers.some((activePlayer) => activePlayer.selectedCard === null)) {
      return null;
    }

    return this.resolveRound();
  }

  removePlayer(player: Player): Card[] | null {
    const playerIndex = this.players.indexOf(player);
    if (playerIndex !== -1) {
      this.players.splice(playerIndex, 1);
    }

    const activePlayerIndex = this.activePlayers.indexOf(player);
    if (activePlayerIndex !== -1) {
      this.activePlayers.splice(activePlayerIndex, 1);
    }

    if (
      this.activePlayers.length > 0 &&
      this.activePlayers.every((activePlayer) => activePlayer.selectedCard !== null)
    ) {
      return this.resolveRound();
    }
    return null;
  }

  private resolveRound(): Card[] {
    const playedCards: Card[] = [];
    const remainingHands: Card[][] = [];

    for (const player of this.activePlayers) {
      const selectedCard = player.selectedCard;
      if (!selectedCard) {
        throw new Error("Cannot resolve a round while a player has not selected.");
      }

      const cardIndex = player.hand.indexOf(selectedCard);
      if (cardIndex === -1) {
        throw new Error("A selected card is no longer in its player's hand.");
      }

      player.hand.splice(cardIndex, 1);
      player.currentPlays.push(selectedCard);
      player.selectedCard = null;
      playedCards.push(selectedCard);
      remainingHands.push(player.hand);
    }

    for (let index = 0; index < this.activePlayers.length; index++) {
      const player = this.activePlayers[index];
      const nextPlayer = this.activePlayers[(index + 1) % this.activePlayers.length];
      const hand = remainingHands[index];
      if (!player || !nextPlayer || !hand) {
        throw new Error("Could not rotate player hands.");
      }

      nextPlayer.hand = hand;
    }

    this.roundNumber++;
    return playedCards;
  }
}
