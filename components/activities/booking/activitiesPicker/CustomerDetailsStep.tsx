"use client";

import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { customerDetailsSchema, type BookingCustomerFormData } from "@/lib/schema/validations/validation";
import { useActivityPickerStore } from "@/store/zustand/activityPickerStore";
import CustomerDetails from "../CustomerDetails";
import type {
  PackageSelection,
  StepProps,
} from "@/types/packagespicker";
import { useState, type RefObject } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { baseUrl } from "@/utils/baseUrl";

type CustomerDetailsStepProps = Pick<
  StepProps,
  "pkg" | "onNext"
> & {
  total: number;
  submitRef: RefObject<(() => void) | null>;
};

export default function CustomerDetailsStep({
  pkg,
  total,
  onNext,
  submitRef,
}: CustomerDetailsStepProps) {

  const [submitting, setSubmitting] = useState(false);
const [submitError, setSubmitError] = useState<string | null>(null);
  const customer = useActivityPickerStore(
    (state) => state.customer,
  );

  const picked = useActivityPickerStore(
    (state) => state.picked,
  );

  const members = useActivityPickerStore(
    (state) => state.members,
  );

  const form = useForm<BookingCustomerFormData>({
     resolver: zodResolver(customerDetailsSchema),
    defaultValues: customer,
      mode: "onSubmit",
  });


const handleSubmit = form.handleSubmit(async (customer) => {
  if (submitting) return;

  setSubmitting(true);
  setSubmitError(null);

  const payload = {
    packageId: pkg.id,
    members,
    customer,
    activities: picked.map((pick) => ({
      activityId: pick.id,
      date: format(pick.date, "yyyy-MM-dd"),
      departureHour: pick.departureHour ?? null,
    })),
  };

  // Log the exact payload sent to the API
  console.log("PACKAGE BOOKING REQUEST:", payload);
  console.table(payload.activities);
  console.log("MEMBERS:", payload.members);
  console.log("CUSTOMER:", payload.customer);

  try {
    const res = await fetch(`${baseUrl}/api/package-booking/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    console.log("PACKAGE BOOKING API STATUS:", res.status);
    console.log("PACKAGE BOOKING API RESPONSE:", json);

    if (!res.ok) {
      setSubmitError(json.message ?? "Something went wrong. Please try again.");
      return;
    }

    console.log("PACKAGE BOOKING CREATED:", json.data);
  } catch (error) {
    console.error("PACKAGE BOOKING REQUEST FAILED:", error);
    setSubmitError("Network error. Please try again.");
  } finally {
    setSubmitting(false);
  }
});



  submitRef.current = handleSubmit;

  return (
   <>
    <CustomerDetails
      register={form.register}
      errors={form.formState.errors}
      setValue={form.setValue}
      watch={form.watch}
    />
    {submitError && (
      <p className="mt-4 text-sm font-medium text-red-600">{submitError}</p>
    )}
  </>
  );
}