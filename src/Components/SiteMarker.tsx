import Tooltip from "./Tooltip";
import type { Site } from "@/Types/Regions";

interface SiteMarkerProps {
  site: Site;
  visitedSite: boolean;
  inCollection: boolean;
}

export default function SiteMarker({
  site,
  visitedSite,
  inCollection,
}: SiteMarkerProps) {
  return (
    <div
      className={`border-3 rounded-4xl text-center justify-center ${visitedSite ? "border-green-500" : "border-white"} ${inCollection ? "w-7.5 h-7.5 text-md" : "w-10 h-10 text-3xl mb-5"}`}
    >
      <p>{site}</p>
    </div>
  );
}
