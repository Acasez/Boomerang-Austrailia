import type { Activity, Animal, Card, Collection } from "../Types/Card";
import regions from "../Data/regions";
import CardMarker from "./CardMarker";
import SiteMarker from "./SiteMarker";

type MarkerSymbol = Collection | Animal | Activity;

const MARKER_KEYS = ["collection", "animal", "activity"] as const;

interface CardProps {
  card: Card;
  onSelect?: () => void;
  selected: boolean;
  hidden: boolean;
  visitedSite?: boolean;
}

function getMarkers(card: Card): MarkerSymbol[] {
  return MARKER_KEYS.map((key) => card[key]).filter(
    (value): value is MarkerSymbol => value !== undefined,
  );
}

export default function CardComponent({
  card,
  onSelect,
  selected,
  hidden,
  visitedSite,
}: CardProps) {
  const region = regions.find((item) => item.name === card.region);
  if (!region) {
    throw new Error(`No region is configured for card "${card.name}".`);
  }

  return (
    <button
      type="button"
      className={`w-50 h-65 rounded-2xl bg-pink-200 text-white flex flex-row ${selected ? "-mt-5 ring-4 ring-blue-600" : ""}`}
      style={!hidden ? { backgroundColor: region.color } : undefined}
      onClick={onSelect}
      disabled={!onSelect}
    >
      {hidden ? (
        <div></div>
      ) : (
        <>
          <div className="flex flex-col flex-1 justify-between my-2 ml-2">
            <div className="border-2 border-red-700 rounded-4xl bg-white text-red-700 text-2xl w-10 text-center">
              <p>{card.throwValue}</p>
            </div>
            <div>
              <div className="flex flex-col gap-2 mb-5">
                {getMarkers(card).map((symbol) => (
                  <CardMarker key={symbol} symbol={symbol} />
                ))}
              </div>
              <SiteMarker
                site={card.site}
                visitedSite={visitedSite!}
                inCollection={false}
              />
            </div>
          </div>
          <div className="flex flex-col flex-10 justify-end ml-2 mb-3 p-0.5">
            <div className="bg-blue-400 rounded-2xl mr-2 p-0.5">
              <h1 className="text-lg align-middle font-bold">{card.name}</h1>
              <p>{card.region}</p>
            </div>
          </div>
        </>
      )}
    </button>
  );
}
