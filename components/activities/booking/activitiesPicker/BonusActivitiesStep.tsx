
"use client";

import { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";

import type {
  Activity,
  BonusActivitySelection,
} from "@/types/packagespicker";
import type { Package } from "@/app/data/laplandPackages";
import { useActivityPickerStore } from "@/store/zustand/activityPickerStore";
import ActivityDateDialog from "./ActivityDateDialog";
import BonusActivityCard from "./BonusActivityCard";
import {
  findFirstSelectableDate,
} from "@/utils/packagesPickerUtils";

type Props = {
  pkg: Package;
  activities: Activity[];
};

export default function BonusActivitiesStep({
  pkg,
  activities,
}: Props) {
  const picked = useActivityPickerStore((state) => state.picked);
  const bonusActivities = useActivityPickerStore(
    (state) => state.bonusActivities,
  );
  const setBonusActivities = useActivityPickerStore(
    (state) => state.setBonusActivities,
  );

  const [editing, setEditing] = useState<Activity | null>(null);

  // Match package bonus definitions to database activities by exact title.
  const bonuses = useMemo(
    () =>
      pkg.bonusActivities.map((bonus) => ({
        bonus,
        activity: activities.find(
          (activity) => activity.title === bonus.title,
        ),
      })),
    [pkg.bonusActivities, activities],
  );

  // TEMPORARY DEBUG LOG
  console.log(
    "Bonus activity debug:",
    bonuses.map(({ bonus, activity }) => ({
      bonusTitle: bonus.title,
      matchedActivityTitle: activity?.title,
      departureHours: activity?.departureHours,
    })),
  );


  // Paid activities and other bonuses occupy their selected dates.
  const takenDates = useMemo(() => {
    const paidDates = picked.map((item) => item.date);

    const otherBonusDates = bonusActivities
      .filter((item) => item.activityId !== editing?.id)
      .map((item) => parseISO(item.date));

    return [...paidDates, ...otherBonusDates];
  }, [picked, bonusActivities, editing]);

  const getSelection = (activityId: string) =>
    bonusActivities.find((item) => item.activityId === activityId);

  const confirmDate = (date: Date, departureHour?: string) => {
    if (!editing || !departureHour) return;

    const selection: BonusActivitySelection = {
      activityId: editing.id,
      date: format(date, "yyyy-MM-dd"),
      departureHour,
    };

    setBonusActivities([
      ...bonusActivities.filter(
        (item) => item.activityId !== editing.id,
      ),
      selection,
    ]);

    setEditing(null);
  };

  const allBonusesAvailable = bonuses.every(
    ({ activity }) => activity !== undefined,
  );

  const allSelected =
    allBonusesAvailable &&
    bonuses.every(({ activity }) => {
      if (!activity) return false;

      const selection = getSelection(activity.id);

      return !!selection?.date && !!selection.departureHour;
    });

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          Your bonus experiences
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          These experiences are included in your package. Choose a
          different date and departure time for each one.
        </p>
      </div>

      {!allBonusesAvailable && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Some bonus activities could not be found in the loaded activities.
          Please check their titles and make sure they are loaded.
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 overflow-y-auto pb-2 pr-1 sm:grid-cols-2 xl:grid-cols-3">
        {bonuses.map(({ bonus, activity }) => {
          if (!activity) {
            return (
              <div
                key={bonus.id}
                className="rounded-xl border border-red-200 p-4 text-sm text-red-700"
              >
                Activity not found: {bonus.title}
              </div>
            );
          }

          return (
            <BonusActivityCard
              key={bonus.id}
              activity={activity}
              selection={getSelection(activity.id)}
              onChooseDate={() => setEditing(activity)}
            />
          );
        })}
      </div>

      {!allSelected && allBonusesAvailable && (
        <p className="text-sm text-amber-700">
          Choose a date and departure time for every bonus experience to continue.
        </p>
      )}

      {editing && (
        <ActivityDateDialog
          key={editing.id}
          activity={editing}
          initialDate={
            getSelection(editing.id)
              ? parseISO(getSelection(editing.id)!.date)
              : findFirstSelectableDate(editing, takenDates)
          }
          initialHour={getSelection(editing.id)?.departureHour}
          takenDates={takenDates}
          onConfirm={confirmDate}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
