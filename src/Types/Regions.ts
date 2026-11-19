export type Region = {
  name: RegionName;
  sites: Site[];
  color: string;
  claimed: boolean;
};

export type RegionName =
  | "Western Australia"
  | "Northern Territory"
  | "Queensland"
  | "South Australia"
  | "New South Wales"
  | "Victoria"
  | "Tasmania";

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
