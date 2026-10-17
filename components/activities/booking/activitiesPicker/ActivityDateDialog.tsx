"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Activity } from "@/types/packagespicker";
import {
  findFirstSelectableDate,
  isSelectable,
} from "@/utils/packagesPickerUtils";

type Props = {
  activity: Activity;
  initialDate?: Date;
  initialHour?: string;
  takenDates: Date[];
  onConfirm: (date: Date, departureHour?: string) => void;
  onClose: () => void;
};

export default function ActivityDateDialog({
  activity,
  initialDate,
  initialHour,
  takenDates,
  onConfirm,
  onClose,
}: Props) {
  const [draft, setDraft] = useState<Date | undefined>(initialDate);
  const [hour, setHour] = useState<string | undefined>(initialHour);

  const hours = activity.departureHours ?? [];
  const canConfirm = !!draft && (hours.length === 0 || !!hour);

  const defaultMonth = useMemo(
    () => initialDate ?? findFirstSelectableDate(activity, takenDates),
    [activity, initialDate, takenDates],
  );

  const season = `${format(new Date(activity.startDate), "d MMM")} to ${format(
    new Date(activity.endDate),
    "d MMM",
  )}`;

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[92vh] w-fit max-w-[95vw] overflow-y-auto rounded-2xl bg-white p-6 focus:outline-none">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-lg font-semibold tracking-tight">
            {activity.title}
          </DialogTitle>
          <DialogDescription>Available every year, {season}</DialogDescription>
        </DialogHeader>

        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={draft}
            onSelect={setDraft}
            defaultMonth={defaultMonth}
            disabled={(date) => !isSelectable(activity, date, takenDates)}
            initialFocus
          />
        </div>

        {takenDates.length > 0 && (
          <p className="text-center text-xs text-gray-400">
            Days already planned for another activity are unavailable.
          </p>
        )}

        {draft && hours.length > 0 && (
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-900">
              <Clock className="h-4 w-4 text-[#B9822B]" />
              Departure time
            </p>
            <div className="grid grid-cols-3 gap-2">
              {hours.map((option) => (
                <Button
                  key={option}
                  type="button"
                  variant="outline"
                  onClick={() => setHour(option)}
                  className={`rounded-xl ${
                    hour === option
                      ? "border-gray-900 bg-gray-900 text-white hover:bg-gray-800 hover:text-white"
                      : "hover:border-[#E8A94A]"
                  }`}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="ghost"
            className="rounded-full"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="rounded-full bg-gray-900 px-8 text-white hover:bg-gray-800"
            disabled={!canConfirm}
            onClick={() => draft && onConfirm(draft, hour)}
          >
            {initialDate ? "Update" : "Add to my trip"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}