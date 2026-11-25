import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "bun:test";
import GameEndDisplay from "@/Components/GameEndDisplay";
import type { PlayerInfo } from "@/Types/PlayerInfo";

function player(
  id: number,
  totalScore: number,
  throwScores: number[],
): PlayerInfo {
  return {
    id,
    totalScore,
    roundScores: throwScores.map((throwScore) => ({
      roundScore: throwScore,
      throwScore,
      animalScore: 0,
      collectionScore: 0,
      activityScore: 0,
      mapScore: 0,
    })),
    visitedSites: [],
    claimedRegions: [],
    selectedActivity: null,
    activitySelectionMade: true,
    usedActivities: [],
  };
}

function winnerMessage(players: PlayerInfo[]): string {
  const markup = renderToStaticMarkup(
    createElement(GameEndDisplay, {
      players,
      ownPlayerId: null,
      gameEnd: true,
    }),
  );
  const paragraph = markup.match(/<p\b[^>]*>(.*?)<\/p>/)?.[1];
  if (!paragraph) {
    throw new Error("The game-end display did not render a winner.");
  }
  return paragraph
    .replace(/<!--.*?-->/g, "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

test("highest total score wins before considering Throw & Catch", () => {
  expect(
    winnerMessage([player(1, 101, [0]), player(2, 100, [99])]),
  ).toBe("Winner: Player 1");
});

test("higher total Throw & Catch score wins a total-score tie", () => {
  expect(
    winnerMessage([player(1, 100, [2, 2]), player(2, 100, [3, 2])]),
  ).toBe("Winner: Player 2");
});

test("players tied on total and Throw & Catch share the win", () => {
  expect(
    winnerMessage([
      player(1, 100, [3, 2]),
      player(2, 100, [4, 1]),
      player(3, 99, [100]),
    ]),
  ).toBe("Winners: Player 1, Player 2");
});
