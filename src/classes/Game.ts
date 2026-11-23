import cards from "@/Data/cards";
import regions from "@/Data/regions";
import { ACTIVITIES } from "@/consts/activities";
import { HAND_SIZE } from "@/consts/handsize";
import { REGION_CLAIM_POINTS } from "@/consts/regions";
import { GAME_ROUNDS } from "@/consts/rounds";
import type { Activity, Card } from "@/Types/Card";
import {
  calculateActivityScore,
  calculateAnimalScore,
  calculateCollectionScore,
  calculateThrowScore,
} from "@/Utils/calculateScores";
import type Player from "./Player";
import { MAX_PLAYERS } from "@/consts/playerCounts";
import type { Region } from "@/Types/Regions";

export default class Game {
  deck: Card[] = [...cards];

  discardPile: Card[] = [];

  players: Player[] = [];
  activePlayers: Player[] = [];
  turnNumber = 0;
  round = 1;
  activityScoringComplete = false;

  claimedRegions: Region[] = [];

  started = false;

  setupHands(deck: Card[], players: Player[] = this.players): void {
    const cardsNeeded = players.length * HAND_SIZE;

    if (deck.length < cardsNeeded) {
      throw new Error(
        `Cannot deal ${HAND_SIZE} cards to ${players.length} player(s): only ${deck.length} cards remain.`,
      );
    }

    for (const player of players) {
      for (let i = 0; i < HAND_SIZE; i++) {
        player.drawCard(deck);
      }
    }
  }

  startGame(): void {
    const deck = this.shuffleDeck([...cards]);
    if (this.players.length > MAX_PLAYERS) {
      throw new Error(`Cannot start a game with more than ${MAX_PLAYERS}.`);
    }
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
    this.turnNumber = 0;
    this.round = 1;
    this.activityScoringComplete = false;
    this.claimedRegions = [];
    this.started = true;
  }

  selectCard(
    player: Player,
    handIndex: number | null,
    turnNumber: number,
  ): Card[] | null {
    if (!this.started || !this.activePlayers.includes(player)) {
      throw new Error("This player is not in the active game.");
    }

    if (turnNumber !== this.turnNumber) {
      throw new Error("This selection belongs to a different turn.");
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
    if (
      this.activePlayers.some(
        (activePlayer) => activePlayer.selectedCard === null,
      )
    ) {
      return null;
    }

    return this.resolveTurn();
  }

  selectActivity(player: Player, activity: Activity | null): boolean {
    if (
      !this.started ||
      this.activityScoringComplete ||
      this.activePlayers.length === 0 ||
      !this.activePlayers.includes(player) ||
      this.activePlayers.some((activePlayer) => activePlayer.hand.length > 0)
    ) {
      throw new Error("Activity scoring is not available yet.");
    }

    if (
      activity !== null &&
      !(ACTIVITIES as readonly string[]).includes(activity)
    ) {
      throw new Error("Invalid activity selected.");
    }

    if (activity !== null && player.usedActivities.includes(activity)) {
      throw new Error("This activity has already been scored by this player.");
    }

    player.selectedActivity = activity;
    player.activitySelectionMade = true;
    return this.completeActivityScoringIfReady();
  }

  completeActivityScoringIfReady(): boolean {
    if (
      this.activityScoringComplete ||
      this.activePlayers.length === 0 ||
      this.activePlayers.some(
        (player) => player.hand.length > 0 || !player.activitySelectionMade,
      )
    ) {
      return false;
    }

    for (const player of this.activePlayers) {
      const activity = player.selectedActivity;
      player.activityScore =
        activity !== null
          ? calculateActivityScore(player.currentPlays, activity)
          : 0;
      if (activity !== null) {
        player.usedActivities.push(activity);
      }

      player.roundScore =
        player.throwScore +
        player.animalScore +
        player.collectionScore +
        player.mapScore +
        player.activityScore;
      player.totalScore += player.roundScore;
    }

    this.activityScoringComplete = true;
    if (this.round < GAME_ROUNDS) {
      this.startNextRound();
    }
    return true;
  }

  private startNextRound(): void {
    this.round++;
    for (const player of this.activePlayers) {
      player.resetRound();
    }

    this.deck = this.shuffleDeck([...cards]);
    this.discardPile = [];
    this.setupHands(this.deck, this.activePlayers);
    this.turnNumber = 0;
    this.activityScoringComplete = false;
  }

  private shuffleDeck(deck: Card[]): Card[] {
    for (let index = deck.length - 1; index > 0; index--) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [deck[index], deck[swapIndex]] = [deck[swapIndex]!, deck[index]!];
    }
    return deck;
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
      this.activePlayers.every(
        (activePlayer) => activePlayer.selectedCard !== null,
      )
    ) {
      return this.resolveTurn();
    }

    this.completeActivityScoringIfReady();
    return null;
  }

  private resolveTurn(): Card[] {
    const playedCards: Card[] = [];
    const remainingHands: Card[][] = [];

    for (const player of this.activePlayers) {
      const selectedCard = player.selectedCard;
      if (!selectedCard) {
        throw new Error(
          "Cannot resolve a turn while a player has not selected.",
        );
      }

      const cardIndex = player.hand.indexOf(selectedCard);
      if (cardIndex === -1) {
        throw new Error("A selected card is no longer in its player's hand.");
      }

      player.hand.splice(cardIndex, 1);
      player.currentPlays.push(selectedCard);
      if (!player.visitedSites.includes(selectedCard.site)) {
        player.visitedSites.push(selectedCard.site);
        player.mapScore++;
      }
      player.selectedCard = null;
      playedCards.push(selectedCard);
      remainingHands.push(player.hand);
    }

    for (const player of this.activePlayers) {
      player.throwScore = calculateThrowScore(player.currentPlays);
      player.collectionScore = calculateCollectionScore(player.currentPlays);
      player.animalScore = calculateAnimalScore(player.currentPlays);

      player.roundScore =
        player.throwScore +
        player.collectionScore +
        player.animalScore +
        player.mapScore;
    }

    for (let index = 0; index < this.activePlayers.length; index++) {
      const player = this.activePlayers[index];
      const nextPlayer =
        this.activePlayers[(index + 1) % this.activePlayers.length];
      const hand = remainingHands[index];
      if (!player || !nextPlayer || !hand) {
        throw new Error("Could not rotate player hands.");
      }

      nextPlayer.hand = hand;
    }

    this.turnNumber++;
    if (this.activePlayers.every((player) => player.hand.length === 0)) {
      this.claimCompletedRegions();
    }

    return playedCards;
  }

  private claimCompletedRegions(): void {
    for (const region of regions) {
      if (this.claimedRegions.some((claimed) => claimed.name === region.name)) {
        continue;
      }

      const eligiblePlayers = this.activePlayers.filter((player) =>
        region.sites.every((site) => player.visitedSites.includes(site)),
      );
      if (eligiblePlayers.length === 0) continue;

      this.claimedRegions.push({ ...region, claimed: true });
      for (const player of eligiblePlayers) {
        player.claimedRegions.push(region.name);
        player.mapScore += REGION_CLAIM_POINTS;
        player.roundScore += REGION_CLAIM_POINTS;
      }
    }
  }
}
