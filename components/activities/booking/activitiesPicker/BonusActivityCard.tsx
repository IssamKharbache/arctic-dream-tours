"use client";

import { CalendarDays, Check, Clock, Compass, Gift } from "lucide-react";
import { format, parseISO } from "date-fns";
import type { Activity, BonusActivitySelection } from "@/types/packagespicker";
import { Button } from "@/components/ui/button";

type BonusActivityCardProps = {
  activity: Activity;
  selection?: BonusActivitySelection;
  onChooseDate: () => void;
};

export default function BonusActivityCard({
  activity,
  selection,
  onChooseDate,
}: BonusActivityCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Choose date and time for ${activity.title}`}
      onClick={onChooseDate}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onChooseDate();
        }
      }}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-white text-left shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
    >
      <div className="relative h-44 w-full shrink-0 overflow-hidden bg-gray-100">
        {activity.imageUrl ? (
          <img
            src={activity.imageUrl}
            alt={activity.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Compass className="h-7 w-7 text-gray-400" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm">
          <Gift className="h-3.5 w-3.5" />
          Included bonus
        </span>

        {selection && (
          <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md">
            <Check className="h-4 w-4" strokeWidth={3} />
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="text-base font-semibold leading-snug text-gray-900">
          {activity.title}
        </h3>

        {activity.location && (
          <p className="text-sm text-gray-500">{activity.location}</p>
        )}

        <div className="flex-1">
          {selection ? (
            <div className="space-y-2">
              <p className="flex items-center gap-2 text-sm text-gray-700">
                <CalendarDays className="h-4 w-4 shrink-0 text-emerald-700" />
                {format(parseISO(selection.date), "EEE, d MMM yyyy")}
              </p>

              {selection.departureHour && (
                <p className="flex items-center gap-2 text-sm text-gray-700">
                  <Clock className="h-4 w-4 shrink-0 text-emerald-700" />
                  {selection.departureHour}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Choose a date and departure time for this experience.
            </p>
          )}
        </div>

        <Button
          type="button"
          variant={selection ? "outline" : "default"}
          className="mt-2 w-full"
          tabIndex={-1}
          onClick={(event) => {
            event.stopPropagation();
            onChooseDate();
          }}
        >
          {selection ? "Change date and time" : "Choose date and time"}
        </Button>
      </div>
    </div>
  );
}