// data/validate.ts
export function oneOf<T extends string>(
  allowed: readonly T[],
  value: unknown,
  where: string,
): T {
  if (
    typeof value === "string" &&
    (allowed as readonly string[]).includes(value)
  ) {
    return value as T;
  }
  throw new Error(
    `${where}: expected one of [${allowed.join(", ")}], got "${value}"`,
  );
}

export const REGIONS = [
  "Western Australia",
  "Northern Territory",
  "Queensland",
  "South Australia",
  "New South Wales",
  "Victoria",
  "Tasmania",
] as const;
