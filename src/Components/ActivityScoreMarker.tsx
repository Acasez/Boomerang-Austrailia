import type { Activity } from "../Types/Card";
import { ACTIVITY_DETAILS } from "@/consts/activities";
import { MARKER_IMAGES } from "../consts/symbolIcons";
import Tooltip from "./Tooltip";

interface ActivityScoreMarkerProps {
  symbol: Activity;
  scoringMarker: boolean;
  scored: boolean;
  selected: boolean;
  onSelect?: () => void;
}

export default function ActivityScoreMarker({
  symbol,
  scoringMarker,
  scored,
  selected,
  onSelect,
}: ActivityScoreMarkerProps) {
  const detail = [...ACTIVITY_DETAILS].find((item) => item.name === symbol);

  if (!detail) {
    throw new Error(`No image is configured for card marker "${symbol}".`);
  }
  const image = MARKER_IMAGES[detail.image];
  if (!image)
    throw new Error(`No image configured for marker "${detail.image}".`);

  return (
    <Tooltip content={symbol}>
      <button
        type="button"
        className={`bg-gray-100 rounded-lg w-10 h-10 flex justify-center ${scoringMarker ? "cursor-pointer" : ""} ${scored ? "ring-2 ring-green-600" : ""} ${selected ? "ring-4 ring-blue-600" : ""}`}
        onClick={onSelect}
        disabled={!onSelect}
        aria-pressed={selected}
        title={scored ? `${symbol} scored` : symbol}
      >
        <img src={image} alt={symbol} className="h-8 w-8 object-contain" />
      </button>
    </Tooltip>
  );
}
