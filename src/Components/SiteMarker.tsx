import type { Region, Site } from "@/Types/Regions";
import { getRegionForSite } from "@/Data/regions";

interface SiteMarkerProps {
  site: Site;
  visitedSite: boolean;
  inCollection: boolean;
  region: Region;
}

export default function SiteMarker({
  site,
  visitedSite,
  inCollection,
  region,
}: SiteMarkerProps) {
  return (
    <div
      className={`border-3 rounded-4xl text-center justify-center ${visitedSite ? "border-green-500" : "border-white"} ${inCollection ? "w-6 h-6 text-sm" : "w-10 h-10 text-3xl mb-5"}`}
      style={{ backgroundColor: region.color }}
    >
      <p>{site}</p>
    </div>
  );
}
