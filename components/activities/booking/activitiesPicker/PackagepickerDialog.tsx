
"use client";

import { useEffect, useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { Package } from "@/app/data/laplandPackages";
import type {
  Activity,
  LoadStatus,
  PackageSelection,
} from "@/types/packagespicker";

import { useActivityPickerStore } from "@/store/zustand/activityPickerStore";
import ActivitiesStep from "./activitiesStep";

type CheckoutData = {
  bookingId: string;
  bookingRef: string;
  clientSecret: string;
};

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

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

export default function PackagePickerDialog({
  pkg,
  activities,
  status,
  onOpenChange,
  onContinue,
}: Props) {
  const reset = useActivityPickerStore((state) => state.reset);
  const [checkout, setCheckout] = useState<CheckoutData | null>(null);

  const checkoutOptions = useMemo(
    () =>
      checkout
        ? { clientSecret: checkout.clientSecret }
        : null,
    [checkout]
  );

  // Reset booking and checkout state when selecting a package.
  useEffect(() => {
    if (pkg) {
      reset();
      setCheckout(null);
    }
  }, [pkg?.id, reset]);


  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setCheckout(null);
    }

    onOpenChange(open);
  };


  type CheckoutData = {
  bookingId: string;
  bookingRef: string;
  clientSecret: string;
};

type StepResult = PackageSelection | CheckoutData;

const handleNext = (data: StepResult) => {
  if ("clientSecret" in data) {
    setCheckout(data);
    return;
  }

  onContinue(data);
};
  return (
    <Dialog open={!!pkg} onOpenChange={handleOpenChange}>
      <DialogContent className="flex h-[88vh] min-w-[70vw] flex-col gap-5 overflow-y-auto rounded-2xl bg-[#FBFAF8] focus:outline-none">
        {pkg &&
          (checkout && checkoutOptions ? (
            <>
              <DialogHeader>
                <DialogTitle>
                  Complete your booking — {checkout.bookingRef}
                </DialogTitle>
              </DialogHeader>

              <div className="min-h-0 flex-1 overflow-y-auto">
                <EmbeddedCheckoutProvider
                  stripe={stripePromise}
                  options={checkoutOptions}
                >
                  <EmbeddedCheckout />
                </EmbeddedCheckoutProvider>
              </div>
            </>
          ) : (
            <ActivitiesStep
              pkg={pkg}
              activities={activities}
              status={status}
              onCancel={() => handleOpenChange(false)}
               onNext={handleNext}
            />
          ))}
      </DialogContent>
    </Dialog>
  );
}
