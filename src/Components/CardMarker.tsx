import type { Activity, Animal, Collection } from "../Types/Card";
import { ACTIVITY_DETAILS } from "@/consts/activities";
import { ANIMAL_DETAILS } from "@/consts/animals";
import { COLLECTION_DETAILS } from "@/consts/collections";
import { MARKER_IMAGES } from "../consts/symbolIcons";
import Tooltip from "./Tooltip";

interface CardMarkerProps {
  symbol: Collection | Animal | Activity;
  scoringMarker: boolean;
  scored: boolean;
  selected: boolean;
}

export default function CardMarker({
  symbol,
  scoringMarker,
  scored,
  selected,
}: CardMarkerProps) {
  const detail = [
    ...ANIMAL_DETAILS,
    ...COLLECTION_DETAILS,
    ...ACTIVITY_DETAILS,
  ].find((item) => item.name === symbol);

  if (!detail) {
    throw new Error(`No image is configured for card marker "${symbol}".`);
  }
  const image = MARKER_IMAGES[detail.image];
  if (!image)
    throw new Error(`No image configured for marker "${detail.image}".`);

  return (
    <Tooltip content={symbol}>
      <div
        className={`bg-gray-100 border-y-4 border-red-500 rounded-lg w-10 h-10 flex justify-center ${selected ? "ring-4 ring-blue-600" : ""}`}
      >
        <img src={image} alt={symbol} className="h-8 w-8 object-contain" />
      </div>
    </Tooltip>
  );
}
