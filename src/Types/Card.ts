export type Card = {
  name: string;
  site: string;
  region: Region;
  throwValue: number;
  collection?: Collection;
  animal?: Animal;
  Activity?: Activity;
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
