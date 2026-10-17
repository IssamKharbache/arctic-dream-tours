
"use client";

import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import type { Package } from "@/app/data/laplandPackages";
import type {
  Activity,
  LoadStatus,
  PackageSelection,
} from "@/types/packagespicker";
import { useActivityPickerStore } from "@/store/zustand/activityPickerStore";
import ActivitiesStep from "./activitiesStep";

type Props = {
  pkg: Package | null;
  activities: Activity[];
  status: LoadStatus;
  onOpenChange: (open: boolean) => void;
  onContinue: (selection: PackageSelection) => void;
};

export type {
  Activity,
  PackageSelection,
} from "@/types/packagespicker";

export default function PackagePickerDialog({
  pkg,
  activities,
  status,
  onOpenChange,
  onContinue,
}: Props) {
  const reset = useActivityPickerStore((state) => state.reset);

  // Start with clean booking data when a different package is selected.
  useEffect(() => {
    if (pkg) {
      reset();
    }
  }, [pkg?.id, reset]);

  return (
    <Dialog open={!!pkg} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[88vh] min-w-[70vw] flex-col gap-5 rounded-2xl bg-[#FBFAF8] focus:outline-none">
        {pkg && (
          <ActivitiesStep
            pkg={pkg}
            activities={activities}
            status={status}
            onCancel={() => onOpenChange(false)}
            onNext={onContinue}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
