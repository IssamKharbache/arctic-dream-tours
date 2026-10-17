"use client";

import { CalendarDays, Check, Clock, Compass, MapPin, X } from "lucide-react";
import { format } from "date-fns";
import type { Activity, MembersSelection, Picked } from "@/types/packagespicker";
import {
  difficultyDot,
  formatDifficulty,
  getActivityTotal,
} from "@/utils/packagesPickerUtils";

type ActivityCardProps = {
  activity: Activity;
  pick?: Picked;
  members: MembersSelection;
  disabled: boolean;
  onOpen: () => void;
  onRemove: () => void;
};

export default function ActivityCard({
  activity,
  pick,
  members,
  disabled,
  onOpen,
  onRemove,
}: ActivityCardProps) {
  const selected = !!pick;
  const difficulty = formatDifficulty(activity.difficulty);

  const unsuitable = members.children > 0 && !activity.isForChild;
  const blocked = disabled || unsuitable;

  const adultTotal = activity.adultPrice * members.adults;
  const childTotal = (activity.childPrice ?? 0) * members.children;
  const activityTotal = getActivityTotal(activity, members);

  return (
    <div
      role="button"
      tabIndex={blocked ? -1 : 0}
      aria-disabled={blocked}
      aria-pressed={selected}
      onClick={() => !blocked && onOpen()}
      onKeyDown={(e) => {
        if (blocked) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className={`group relative flex flex-col overflow-hidden rounded-2xl bg-white text-left outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#E8A94A] ${
        selected
          ? "shadow-lg ring-2 ring-[#E8A94A]"
          : "shadow-sm ring-1 ring-black/5"
      } ${
        blocked
          ? "cursor-not-allowed opacity-50 grayscale"
          : "cursor-pointer hover:-translate-y-0.5 hover:shadow-xl"
      }`}
    >
      <div className="relative h-40 w-full shrink-0 overflow-hidden bg-gray-100">
        {activity.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={activity.imageUrl}
            alt={activity.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Compass className="h-6 w-6 text-gray-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {difficulty && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium text-gray-800 shadow-sm backdrop-blur">
            <span
              className={`h-1.5 w-1.5 rounded-full ${difficultyDot(activity.difficulty)}`}
            />
            {difficulty}
          </span>
        )}

        {selected && (
          <>
            <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-[#E8A94A] text-white shadow-md">
              <Check className="h-4 w-4" strokeWidth={3} />
            </span>
            <button
              type="button"
              aria-label={`Remove ${activity.title}`}
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="absolute bottom-3 right-3 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-black/55 text-white backdrop-blur transition-colors hover:bg-black/75"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="line-clamp-2 text-[15px] font-semibold leading-snug tracking-tight text-gray-900">
          {activity.title}
        </p>

        {unsuitable && (
          <p className="text-xs font-medium text-red-500">
            Not available when booking with children.
          </p>
        )}

        {activity.location && (
          <p className="flex items-center gap-1.5 text-xs text-gray-500">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{activity.location}</span>
          </p>
        )}

        {pick ? (
          <div className="flex flex-wrap gap-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F6EBD7] px-3 py-1 text-xs font-semibold text-[#6B4A12]">
              <CalendarDays className="h-3.5 w-3.5" />
              {format(pick.date, "EEE, d MMM yyyy")}
            </span>
            {pick.departureHour && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F6EBD7] px-3 py-1 text-xs font-semibold text-[#6B4A12]">
                <Clock className="h-3.5 w-3.5" />
                {pick.departureHour}
              </span>
            )}
          </div>
        ) : (
          !blocked && (
            <p className="text-xs text-gray-400">
              Tap to choose a date and time
            </p>
          )
        )}

        <div className="mt-3 space-y-1 text-sm">
          <p className="text-gray-500">
            {members.adults} {members.adults === 1 ? "adult" : "adults"} ×{" "}
            {activity.adultPrice} € = {adultTotal} €
          </p>

          {members.children > 0 && activity.isForChild && (
            <p className="text-gray-500">
              {members.children} {members.children === 1 ? "child" : "children"}{" "}
              × {activity.childPrice ?? 0} € = {childTotal} €
            </p>
          )}

          {members.infants > 0 && (
            <p className="text-gray-500">
              {members.infants} {members.infants === 1 ? "infant" : "infants"}{" "}
              × 0 = Free
            </p>
          )}

          <div className="flex items-center justify-between border-t pt-2">
            <span className="font-medium text-gray-900">
              Total per activity
            </span>
            <span className="font-semibold text-gray-900">
              {activityTotal} €
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}