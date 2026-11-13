type CardTraits =
  | { collection: Collection; animal: Animal; activity?: undefined }
  | { collection: Collection; activity: Activity; animal?: undefined }
  | { animal: Animal; activity: Activity; collection?: undefined };

export type Card = CardTraits & {
  name: string;
  site: string;
  region: Region;
  throwValue: number;
};

export type Region =
  | "Western Australia"
  | "Northern Territory"
  | "Queensland"
  | "South Australia"
  | "New South Wales"
  | "Victoria"
  | "Tasmania";

export type Activity = "Swimming" | "Bush-walking" | "Culture" | "Sightseeing";

export type Animal = "Kangaroos" | "Emus" | "Wombats" | "Koalas" | "Platypus";

export type Collection = "Leaves" | "Wildflower" | "Shells" | "Souvenirs";
