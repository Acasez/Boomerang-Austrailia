interface HeaderProps {
  gameStarted: boolean;
  disabled: boolean;
  onStartGame: () => void;
}

export default function Header({
  gameStarted,
  disabled,
  onStartGame,
}: HeaderProps) {
  return (
    <div className="bg-gray-900 w-full">
      <button
        className="text-white text-lg bg-gray-600 rounded-lg px-1 m-2"
        onClick={onStartGame}
        disabled={disabled}
      >
        {gameStarted ? "Restart Game" : "Start Game"}
      </button>
    </div>
  );
}
