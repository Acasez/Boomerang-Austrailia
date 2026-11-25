import { expect, test } from "bun:test";
import cards from "@/Data/cards";
import Game from "@/classes/Game";
import Player from "@/classes/Player";
import { HAND_SIZE } from "@/consts/handSize";
import { MAX_PLAYERS, MIN_PLAYERS } from "@/consts/playerCounts";
import type { Card } from "@/Types/Card";

function createGame(playerCount: number): { game: Game; players: Player[] } {
  const game = new Game();
  const players = Array.from({ length: playerCount }, () => new Player());
  game.players = players;
  return { game, players };
}

function createGameWithHands(
  playerCount: number,
): { game: Game; players: Player[] } {
  const { game, players } = createGame(playerCount);
  game.activePlayers = players;
  game.started = true;

  players.forEach((player, index) => {
    player.reset();
    player.hand = cards.slice(index * HAND_SIZE, (index + 1) * HAND_SIZE);
  });

  return { game, players };
}

function completeTurn(game: Game, players: Player[]): Card[] {
  let playedCards: Card[] | null = null;
  for (const player of players) {
    playedCards = game.selectCard(player, 0, game.turnNumber);
  }
  if (!playedCards) {
    throw new Error("The turn did not resolve after every player selected.");
  }
  return playedCards;
}

test("only starts games with between two and four players", () => {
  expect(MIN_PLAYERS).toBe(2);
  expect(MAX_PLAYERS).toBe(4);

  for (const playerCount of [MIN_PLAYERS, MAX_PLAYERS]) {
    const { game } = createGame(playerCount);
    expect(() => game.startGame()).not.toThrow();
    expect(game.started).toBe(true);
  }

  for (const playerCount of [MIN_PLAYERS - 1, MAX_PLAYERS + 1]) {
    const { game } = createGame(playerCount);
    expect(() => game.startGame()).toThrow();
  }
});

test("shuffles the 28-card deck and deals seven cards to each player", () => {
  const { game, players } = createGame(MAX_PLAYERS);
  const originalRandom = Math.random;
  Math.random = () => 0;

  try {
    game.startGame();
  } finally {
    Math.random = originalRandom;
  }

  expect(cards).toHaveLength(28);
  for (const player of players) {
    expect(player.hand).toHaveLength(HAND_SIZE);
  }
  expect(players[0]!.hand[0]).toBe(cards[1]);
  expect(game.deck).toHaveLength(0);

  const dealtCards = players.flatMap((player) => player.hand);
  expect(new Set(dealtCards).size).toBe(cards.length);
  expect(cards.every((card) => dealtCards.includes(card))).toBe(true);
});

test("waits for every player before resolving and passes hands to the next player", () => {
  const { game, players } = createGameWithHands(3);
  const originalHands = players.map((player) => [...player.hand]);

  expect(game.selectCard(players[0]!, 0, game.turnNumber)).toBeNull();
  expect(players[0]!.currentPlays).toEqual([]);

  game.selectCard(players[1]!, 0, game.turnNumber);
  const playedCards = game.selectCard(players[2]!, 0, game.turnNumber);

  expect(playedCards).not.toBeNull();
  expect(playedCards).toEqual(originalHands.map((hand) => hand[0]!));
  expect(players[1]!.hand).toEqual(originalHands[0]!.slice(1));
  expect(players[2]!.hand).toEqual(originalHands[1]!.slice(1));
  expect(players[0]!.hand).toEqual(originalHands[2]!.slice(1));
});

test("keeps the first selected card first in the player's round plays", () => {
  const { game, players } = createGameWithHands(3);
  const throwCards = players.map((player) => player.hand[0]!);

  for (let turn = 0; turn < HAND_SIZE; turn++) {
    completeTurn(game, players);

    for (let playerIndex = 0; playerIndex < players.length; playerIndex++) {
      const player = players[playerIndex]!;
      expect(player.currentPlays).toHaveLength(turn + 1);
      expect(player.currentPlays[0]).toBe(throwCards[playerIndex]);
    }
  }

  expect(players.every((player) => player.hand.length === 0)).toBe(true);
});

test("passes the last remaining card to the previous player", () => {
  const { game, players } = createGameWithHands(3);

  for (let turn = 0; turn < HAND_SIZE - 2; turn++) {
    completeTurn(game, players);
  }
  expect(players.map((player) => player.hand)).toHaveLength(3);
  expect(players.every((player) => player.hand.length === 2)).toBe(true);

  const lastCards = players.map((player) => player.hand[1]!);
  completeTurn(game, players);

  expect(players[2]!.hand).toEqual([lastCards[0]!]);
  expect(players[0]!.hand).toEqual([lastCards[1]!]);
  expect(players[1]!.hand).toEqual([lastCards[2]!]);
});
