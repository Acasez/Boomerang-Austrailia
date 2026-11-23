import type { Site } from "@/Types/Regions";
import { getRegionForSite } from "@/Data/regions";

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
  const region = getRegionForSite(site);
  if (!region) {
    throw new Error(`No region is configured for site "${site}".`);
  }

  return (
    <div
      className={`border-3 rounded-4xl text-center justify-center ${visitedSite ? "border-green-500" : "border-white"} ${inCollection ? "w-7.5 h-7.5 text-md" : "w-10 h-10 text-3xl mb-5"}`}
      style={{ backgroundColor: region.color }}
    >
      <p>{site}</p>
    </div>
  );
}
