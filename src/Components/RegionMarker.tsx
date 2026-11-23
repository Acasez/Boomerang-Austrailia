import type { PlayerInfo } from "@/Types/PlayerInfo";
import type { Region } from "@/Types/Regions";
import SiteMarker from "./SiteMarker";

interface RegionMarkerProps {
  region: Region;
  player: PlayerInfo;
  claimed: boolean;
}

export default function RegionMarker({
  region,
  player,
  claimed,
}: RegionMarkerProps) {
  return (
    <div
      className={`flex flex-row rounded-md ${claimed ? "border-4 border-green-600" : "border-2 border-transparent"}`}
    >
      {region.sites
        .filter((site) => player.visitedSites.includes(site))
        .map((site) => (
          <SiteMarker
            key={site}
            site={site}
            visitedSite
            inCollection
            region={region}
          />
        ))}
    </div>
  );
}
