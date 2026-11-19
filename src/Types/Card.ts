import type { RegionName, Site } from "./Regions";

type CardTraits =
  | { collection: Collection; animal: Animal; activity?: undefined }
  | { collection: Collection; activity: Activity; animal?: undefined }
  | { animal: Animal; activity: Activity; collection?: undefined };

export type Card = CardTraits & {
  name: string;
  site: Site;
  region: RegionName;
  throwValue: number;
};

export type Activity =
  | "Swimming"
  | "Bushwalking"
  | "Indigenous Culture"
  | "Sightseeing";

export type Animal = "Kangaroos" | "Emus" | "Wombats" | "Koalas" | "Platypuses";

export type Collection = "Leaves" | "Wildflowers" | "Shells" | "Souvenirs";
