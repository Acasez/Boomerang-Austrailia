import { ACTIVITIES } from "@/consts/activities";
import type { Activity } from "@/Types/Card";

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isMessageType(
  value: unknown,
  type: string,
): value is Record<string, unknown> {
  return isRecord(value) && value.type === type;
}

export function isHandIndex(value: unknown): value is number | null {
  return (
    value === null || (typeof value === "number" && Number.isInteger(value))
  );
}

export function isActivity(value: unknown): value is Activity {
  return (
    typeof value === "string" &&
    (ACTIVITIES as readonly string[]).includes(value)
  );
}

export function isActivityChoice(value: unknown): value is Activity | null {
  return value === null || isActivity(value);
}
