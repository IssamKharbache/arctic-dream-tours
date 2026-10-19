
"use client";

import { useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  DialogFooter,
} from "@/components/ui/dialog";
import type {
  Activity,
  Picked,
  StepProps,
} from "@/types/packagespicker";
import { getActivityTotal, getPrice } from "@/utils/packagesPickerUtils";
import { useActivityPickerStore } from "@/store/zustand/activityPickerStore";

import PickerProgress from "./Pickerprogress";
import BonusActivities from "./BonusActivities";
import ActivityDateDialog from "./ActivityDateDialog";
import ActivityCard from "./ActivityCard";
import MembersStep from "./MembersStep";
import CustomerDetailsStep from "./CustomerDetailsStep";

import BonusActivitiesStep from "./BonusActivitiesStep";

const GRID =
  "m-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

export default function ActivitiesStep({
  pkg,
  activities,
  status,
  onCancel,
  onNext,
}: StepProps) {
  const [editing, setEditing] = useState<Activity | null>(null);

  const step = useActivityPickerStore((state) => state.step);
  const setStep = useActivityPickerStore((state) => state.setStep);

  const picked = useActivityPickerStore((state) => state.picked);
  const setPicked = useActivityPickerStore((state) => state.setPicked);

  const members = useActivityPickerStore((state) => state.members);
  const setMembers = useActivityPickerStore((state) => state.setMembers);

  const paidActivities = useMemo(
  () =>
    activities.filter(
      (activity) =>
        !pkg.bonusActivities.some(
          (bonus) => bonus.title === activity.title,
        ),
    ),
  [activities, pkg.bonusActivities],
);

  const customerSubmitRef = useRef<(() => void) | null>(null);

  const isFull = picked.length === pkg.pickCount;

const total = useMemo(
  () =>
    paidActivities
      .filter((activity) =>
        picked.some((pick) => pick.id === activity.id),
      )
      .reduce(
        (sum, activity) => sum + getActivityTotal(activity, members),
        0,
      ),
  [paidActivities, picked, members],
);

const bonusActivities = useActivityPickerStore(
  (state) => state.bonusActivities,
);

  const takenDates = useMemo(
    () =>
      picked
        .filter((pick) => pick.id !== editing?.id)
        .map((pick) => pick.date),
    [picked, editing],
  );

const confirmDate = (date: Date, departureHour?: string) => {
  if (!editing) return;

  const id = editing.id;

  setPicked(
    picked.some((pick) => pick.id === id)
      ? picked.map((pick) =>
          pick.id === id ? { ...pick, date, departureHour } : pick,
        )
      : [...picked, { id, date, departureHour }],
  );

  setEditing(null);
};
  const removePick = (id: string) => {
    setPicked(picked.filter((pick) => pick.id !== id));
  };
const handleContinue = () => {
  if (step === 1) {
    setStep(2);
    return;
  }

  if (step === 2) {
    if (!isFull) return;
    setStep(3);
    return;
  }

  if (step === 3) {
    const requiredBonusCount = pkg.bonusActivities.length;

    const allBonusesSelected =
      bonusActivities.length === requiredBonusCount &&
      pkg.bonusActivities.every((bonus) => {
        const activity = activities.find(
          (item) => item.title === bonus.title,
        );

        return (
          activity &&
          bonusActivities.some(
            (selection) =>
              selection.activityId === activity.id &&
              !!selection.date &&
              !!selection.departureHour,
          )
        );
      });

    if (!allBonusesSelected) return;

    setStep(4);
  }
};
const handleBack = () => {
  if (step > 1) {
    setStep((step - 1) as 1 | 2 | 3);
  }
};

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col gap-5">
        {step === 1 ? (
          <MembersStep
            value={members}
            onChange={setMembers}
          />
        ) : step === 2 ?  (
          <>
          <PickerProgress
  pickedCount={picked.length}
  pickCount={pkg.pickCount}
  total={total}
  adults={members.adults}
  children={members.children}
  infants={members.infants}
/>

            <div className="flex-1 space-y-7 overflow-y-auto pr-1">
              <BonusActivities items={pkg.bonusActivities} />

              <section>
                <h4 className="mb-3 text-sm font-semibold text-gray-900">
                  Choose your activities
                </h4>

                {status === "loading" && (
                  <div className={GRID}>
                    {Array.from({ length: 8 }).map((_, index) => (
                      <span
                        key={index}
                        className="h-64 animate-pulse rounded-2xl bg-gray-100"
                      />
                    ))}
                  </div>
                )}

                {status === "error" && (
                  <p className="text-sm text-gray-500">
                    We couldn&apos;t load the activities right now.
                    Please close this window and try again.
                  </p>
                )}

                {status === "success" && (
                  <div className={GRID}>
                    {paidActivities.map((activity) => {
                      const pick = picked.find(
                        (item) => item.id === activity.id,
                      );

                      return (
                       <ActivityCard
  key={activity.id}
  activity={activity}
  pick={pick}
  members={members}
 disabled={
  (!pick && isFull) ||
  (!pick && members.children > 0 && activity.childPrice === 0)
}
  onOpen={() => setEditing(activity)}
  onRemove={() => removePick(activity.id)}
/>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>
          </>
        ) : step === 3 ? (
  <BonusActivitiesStep
    pkg={pkg}
    activities={activities}
  />
) : (
  <CustomerDetailsStep
    submitRef={customerSubmitRef}
    pkg={pkg}
    total={total}
    onNext={onNext}
  />
)}

<DialogFooter className="flex-shrink-0 gap-2">
  <Button
    type="button"
    variant="ghost"
    className="rounded-full px-6"
    onClick={step === 1 ? onCancel : handleBack}
  >
    {step === 1 ? "Cancel" : "Back"}
  </Button>

  {step < 4 ? (
  <Button
    disabled={
      (step === 2 && !isFull) ||
      (step === 3 &&
        (bonusActivities.length !== pkg.bonusActivities.length ||
          pkg.bonusActivities.some((bonus) => {
            const activity = activities.find(
              (item) => item.title === bonus.title,
            );

            return (
              !activity ||
              !bonusActivities.some(
                (selection) =>
                  selection.activityId === activity.id &&
                  !!selection.date &&
                  !!selection.departureHour,
              )
            );
          })))
    }
    onClick={handleContinue}
  >
    {step === 1
      ? "Choose activities"
      : step === 2
        ? "Continue to bonus activities"
        : "Continue to customer details"}
  </Button>
) : (
  <Button onClick={() => customerSubmitRef.current?.()}>
    Continue to payment
  </Button>
)}
</DialogFooter>
      </div>

      {editing && (
 <ActivityDateDialog
  key={editing.id}
  activity={editing}
  initialDate={
    picked.find((pick) => pick.id === editing.id)?.date
  }
  initialHour={
    picked.find((pick) => pick.id === editing.id)?.departureHour
  }
  takenDates={takenDates}
  onConfirm={confirmDate}
  onClose={() => setEditing(null)}
/>
      )}
    </>
  );
}
