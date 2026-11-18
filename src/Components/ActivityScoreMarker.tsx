import type { Activity, Animal, Collection } from "../Types/Card";
import { ACTIVITY_DETAILS } from "@/consts/activities";
import { MARKER_IMAGES } from "../consts/symbolIcons";
import Tooltip from "./Tooltip";

interface ActivityScoreMarkerProps {
  symbol: Collection | Animal | Activity;
  scoringMarker: boolean;
  scored: boolean;
  selected: boolean;
}

export default function ActivityScoreMarker({
  symbol,
  scoringMarker,
  scored,
  selected,
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
      <div
        className={`bg-gray-100 rounded-lg w-10 h-10 flex justify-center ${selected ? "ring-4 ring-blue-600" : ""}`}
      >
        <img src={image} alt={symbol} className="h-8 w-8 object-contain" />
      </div>
    </Tooltip>
  );
}
