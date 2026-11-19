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

export type Region = {
  name: RegionName;
  sites: Site[];
  color: string;
  claimed: boolean;
};

export type Site =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M"
  | "O"
  | "P"
  | "Q"
  | "R"
  | "S"
  | "T"
  | "U"
  | "V"
  | "X"
  | "Y"
  | "Z"
  | "Å"
  | "Ä"
  | "Ö";

export type RegionName =
  | "Western Australia"
  | "Northern Territory"
  | "Queensland"
  | "South Australia"
  | "New South Wales"
  | "Victoria"
  | "Tasmania";

export type Activity =
  | "Swimming"
  | "Bushwalking"
  | "Indigenous Culture"
  | "Sightseeing";

export type Animal = "Kangaroos" | "Emus" | "Wombats" | "Koalas" | "Platypuses";

export type Collection = "Leaves" | "Wildflowers" | "Shells" | "Souvenirs";
