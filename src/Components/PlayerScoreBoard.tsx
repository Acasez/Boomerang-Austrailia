import type { PlayerInfo } from "@/Types/PlayerInfo";

interface PlayerScoreBoardProps {
  player: PlayerInfo;
}

export default function PlayerScoreBoard({ player }: PlayerScoreBoardProps) {
  return (
    <div key={player.id} className="flex items-center gap-4">
      <div className="bg-green-400 p-2 rounded-xl text-center">
        <h2 className="text-xl underline">Player {player.id}</h2>
        <h3>Score: {player.score}</h3>
        <h3 className="text-sm">Throw Score: {player.throwScore}</h3>
        <h3 className="text-sm">Animal Score: {player.animalScore}</h3>
        <h3 className="text-sm">Collection Score: {player.collectionScore}</h3>
      </div>
    </div>
  );
}
