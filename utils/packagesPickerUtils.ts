import { addDays, addHours, isBefore, isSameDay, startOfDay } from "date-fns";
import type { Activity, MembersSelection } from "../types/packagespicker";

const SEARCH_HORIZON_DAYS = 730;

export const getPrice = (activity: Activity) =>
  Number(activity.adultPrice) || 0;

const monthDay = (date: Date) => date.getMonth() * 100 + date.getDate();

function isInSeason(activity: Activity, date: Date) {
  const start = monthDay(new Date(activity.startDate));
  const end = monthDay(new Date(activity.endDate));
  const current = monthDay(date);
  return start <= end
    ? current >= start && current <= end
    : current >= start || current <= end;
}

export function isSelectable(
  activity: Activity,
  date: Date,
  takenDates: Date[],
) {
  const earliest = startOfDay(
    addHours(new Date(), activity.bookingCutoffHours ?? 0),
  );
  return (
    !isBefore(date, earliest) &&
    isInSeason(activity, date) &&
    !takenDates.some((taken) => isSameDay(taken, date))
  );
}

export function findFirstSelectableDate(
  activity: Activity,
  takenDates: Date[],
) {
  const today = startOfDay(new Date());
  for (let i = 0; i <= SEARCH_HORIZON_DAYS; i++) {
    const date = addDays(today, i);
    if (isSelectable(activity, date, takenDates)) return date;
  }
  return undefined;
}

export function formatDifficulty(value?: string | null) {
  if (!value) return "";
  const text = value.replace(/_/g, " ").toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function difficultyDot(value?: string | null) {
  const v = (value ?? "").toLowerCase();
  if (v.includes("easy") || v.includes("light")) return "bg-emerald-500";
  if (v.includes("moder") || v.includes("medium")) return "bg-amber-500";
  if (
    v.includes("hard") ||
    v.includes("difficult") ||
    v.includes("challeng") ||
    v.includes("extreme")
  ) {
    return "bg-red-500";
  }
  return "bg-gray-400";
}



export function getActivityTotal(
  activity: Activity,
  members: MembersSelection,
): number {
  return (
    activity.adultPrice * members.adults +
    (activity.childPrice ?? 0) * members.children
  );
}