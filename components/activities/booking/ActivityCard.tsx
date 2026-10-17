"use client";

import { CalendarDays, Check, Compass, MapPin, X } from "lucide-react";
import { format } from "date-fns";
import { Activity, Picked } from "../../../types/packagespicker";
import {
  difficultyDot,
  formatDifficulty,
  getPrice,
} from "../../../utils/packagesPickerUtils";

type Props = {
  activity: Activity;
  pick?: Picked;
  disabled: boolean;
  onOpen: () => void;
  onRemove: () => void;
};

export default function ActivityCard({
  activity,
  pick,
  disabled,
  onOpen,
  onRemove,
}: Props) {
  const selected = !!pick;
  const difficulty = formatDifficulty(activity.difficulty);

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      aria-pressed={selected}
      onClick={() => !disabled && onOpen()}
      onKeyDown={(e) => {
        if (disabled) return;
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
        disabled
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
        {activity.location && (
          <p className="flex items-center gap-1.5 text-xs text-gray-500">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{activity.location}</span>
          </p>
        )}

        {pick ? (
          <p className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#F6EBD7] px-3 py-1 text-xs font-semibold text-[#6B4A12]">
            <CalendarDays className="h-3.5 w-3.5" />
            {format(pick.date, "EEE, d MMM yyyy")}
          </p>
        ) : (
          !disabled && (
            <p className="text-xs text-gray-400">Tap to choose a date</p>
          )
        )}

        <p className="mt-auto flex items-baseline gap-1 border-t border-gray-100 pt-3">
          <span className="text-xs text-gray-400">From</span>
          <span className="text-base font-semibold tabular-nums text-gray-900">
            €{getPrice(activity).toLocaleString()}
          </span>
          <span className="text-xs text-gray-400">/ adult</span>
        </p>
      </div>
    </div>
  );
}
