import type { PlayerInfo } from "@/Types/PlayerInfo";

interface GameEndDisplayProps {
  players: PlayerInfo[];
  ownPlayerId: number | null;
  gameEnd: boolean;
}

export default function GameEndDisplay({
  players,
  ownPlayerId,
  gameEnd,
}: GameEndDisplayProps) {
  if (!gameEnd || players.length === 0) return null;

  const getTotalThrowScore = (player: PlayerInfo) =>
    player.roundScores.reduce((total, round) => total + round.throwScore, 0);
  const rankedPlayers = [...players].sort(
    (a, b) =>
      b.totalScore - a.totalScore ||
      getTotalThrowScore(b) - getTotalThrowScore(a) ||
      a.id - b.id,
  );
  const winningScore = rankedPlayers[0]!.totalScore;
  const tiebreakNeeded = players.filter(
    (player) => player.totalScore === winningScore,
  ).length > 1;
  const winningThrowScore = getTotalThrowScore(rankedPlayers[0]!);
  const winners = rankedPlayers.filter(
    (player) =>
      player.totalScore === winningScore &&
      getTotalThrowScore(player) === winningThrowScore,
  );

  return (
    <div className="rounded-xl bg-amber-100 p-4 text-center">
      <h2 className="mb-3 text-2xl font-bold">Game over!</h2>
      <p className="mb-3 text-lg">
        {winners.length === 1 ? "Winner" : "Winners"}:{" "}
        {winners.map((player) => `Player ${player.id}`).join(", ")}
      </p>
      <ol className="flex flex-col gap-2">
        {rankedPlayers.map((player, index) => (
          <li
            key={player.id}
            className={`flex justify-between gap-6 rounded-lg p-2 ${
              index === 0 ? "bg-amber-300 font-bold" : "bg-white"
            }`}
          >
            <span>
              {index + 1}. Player {player.id}
              {player.id === ownPlayerId ? " (You)" : ""}
            </span>
            <span>{player.totalScore} points</span>
            {tiebreakNeeded && (
              <span>Throw score: {getTotalThrowScore(player)}</span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
