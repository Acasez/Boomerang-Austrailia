import { GAME_ROUNDS } from "../consts/rounds";

interface HeaderProps {
  gameStarted: boolean;
  disabled: boolean;
  onStartGame: () => void;
  roundNumber: number;
}

export default function Header({
  gameStarted,
  disabled,
  onStartGame,
  roundNumber,
}: HeaderProps) {
  return (
    <div className="bg-gray-900 w-full flex flex-row justify-between">
      <button
        className="text-white text-lg bg-gray-600 rounded-lg px-1 m-2"
        onClick={onStartGame}
        disabled={disabled}
      >
        {gameStarted ? "Restart Game" : "Start Game"}
      </button>
      <div>
        <h1 className="text-white text-center text-lg bg-gray-600 rounded-lg px-1 m-2">
          Round {roundNumber} of {GAME_ROUNDS}
        </h1>
      </div>
      <div></div>
    </div>
  );
}
