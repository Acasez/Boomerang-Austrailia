// data/regions.ts
import type { Region, RegionName, Site } from "@/Types/Regions";
import rawRegions from "../JSON/sites.json";

export const regions: Region[] = rawRegions.map((raw) => {
  return {
    ...raw,
    name: raw.name as RegionName,
    sites: raw.sites.split(",").map((site) => site.trim()) as Site[],
    claimed: false,
  };
});

export function getRegionForSite(site: Site): Region | undefined {
  return regions.find((region) => region.sites.includes(site));
}

export default regions;
