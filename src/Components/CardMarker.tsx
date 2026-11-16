import type { Activity, Animal, Collection } from "../Types/Card";

interface CardMarkerProps {
  symbol: Collection | Animal | Activity;
}

export default function CardMarker({ symbol }: CardMarkerProps) {
  return (
    <div className="bg-amber-100 border-y-4 border-red-500 rounded-lg text-black max-w-10 text-sm">
      <p>{symbol}</p>
    </div>
  );
}
