import { GAME_ROUNDS } from "../consts/rounds";

interface HeaderProps {
  gameStarted: boolean;
  disabled: boolean;
  onStartGame: () => void;
  onStartSolo: () => void;
  passRight: boolean;
  alternatePassDirection: boolean;
  onToggleAlternatePassDirection: () => void;
  roundNumber: number;
}

export default function Header({
  gameStarted,
  disabled,
  onStartGame,
  onStartSolo,
  passRight,
  alternatePassDirection,
  onToggleAlternatePassDirection,
  roundNumber,
}: HeaderProps) {
  return (
    <div className="bg-gray-900 w-full flex flex-row justify-between">
      <div className="flex flex-row gap-3">
        <button
          className="text-white text-lg bg-gray-600 rounded-lg px-1 m-2"
          onClick={onStartGame}
          disabled={disabled}
        >
          {gameStarted ? "Restart Game" : "Start Game"}
        </button>
        <button
          className="text-white text-lg bg-green-600 rounded-lg px-1 m-2"
          onClick={onStartSolo}
          disabled={disabled}
        >
          {gameStarted ? "Restart Solo" : "Start Solo"}
        </button>
      </div>

      <div>
        <h1 className="text-white text-center text-lg bg-gray-600 rounded-lg px-1 m-2">
          Round {roundNumber} of {GAME_ROUNDS}
        </h1>
      </div>
      <button
        type="button"
        className={`text-white text-lg rounded-lg px-2 m-2 ${
          alternatePassDirection ? "bg-blue-600" : "bg-gray-600"
        }`}
        onClick={onToggleAlternatePassDirection}
        aria-pressed={alternatePassDirection}
      >
        Alternate passing: {alternatePassDirection ? "On" : "Off"} (currently{" "}
        {passRight ? "right" : "left"})
      </button>
    </div>
  );
}
