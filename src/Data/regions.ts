// data/regions.ts
import type { Region, RegionName, Site } from "@/Types/Card";
import rawRegions from "../JSON/sites.json";

export const regions: Region[] = rawRegions.map((raw) => {
  return {
    ...raw,
    name: raw.name as RegionName,
    sites: raw.sites.split(",").map((site) => site.trim()) as Site[],
    claimed: false,
  };
});
export default regions;
