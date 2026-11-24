import { HAND_SIZE } from "@/consts/handSize";
import type { Activity, Card } from "@/Types/Card";
import type { RegionName, Site } from "@/Types/Regions";
import type { RoundScores } from "@/Types/Scores";
import { getRandomCard } from "@/Utils/CardUtils";

export default class Player {
  totalScore = 0;

  roundScores: RoundScores[] = [];

  currentPlays: Card[] = [];
  hand: Card[] = [];

  selectedCard: Card | null = null;
  selectedActivity: Activity | null = null;
  activitySelectionMade = false;

  usedActivities: Activity[] = [];
  visitedSites: Site[] = [];
  claimedRegions: RegionName[] = [];

  get currentRoundScore(): RoundScores {
    const currentRoundScore = this.roundScores[this.roundScores.length - 1];
    if (!currentRoundScore) {
      throw new Error("The player has no active round score.");
    }

    return currentRoundScore;
  }

  drawCard(deck: Card[]): void {
    if (this.hand.length < HAND_SIZE) {
      this.hand.push(getRandomCard(deck));
    }
  }

  selectCard(card: Card | null): void {
    if (card !== null && !this.hand.includes(card)) {
      throw new Error("Cannot select a card that is not in the player's hand.");
    }

    this.selectedCard = card;
  }

  reset(): void {
    this.totalScore = 0;
    this.usedActivities = [];
    this.visitedSites = [];
    this.claimedRegions = [];
    this.roundScores = [];
    this.resetRound();
  }

  resetRound(): void {
    this.roundScores.push({
      roundScore: 0,
      throwScore: 0,
      animalScore: 0,
      collectionScore: 0,
      activityScore: 0,
      mapScore: 0,
    });

    this.currentPlays = [];
    this.hand = [];
    this.selectedCard = null;
    this.selectedActivity = null;
    this.activitySelectionMade = false;
  }
}
