
"use client";

import { useCallback, useEffect, useState, type RefObject } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  customerDetailsSchema,
  type BookingCustomerFormData,
} from "@/lib/schema/validations/validation";
import { useActivityPickerStore } from "@/store/zustand/activityPickerStore";
import CustomerDetails from "../CustomerDetails";
import type { StepProps } from "@/types/packagespicker";
import { baseUrl } from "@/utils/baseUrl";

type CustomerDetailsStepProps = Pick<StepProps, "pkg"> & {
  total: number;
  submitRef: RefObject<(() => void) | null>;
  onNext: (checkout: {
    bookingId: string;
    bookingRef: string;
    clientSecret: string;
  }) => void;
};

type ApiResponse = {
  message?: string;
  error?: string;
  data?: {
    id?: string;
    bookingRef?: string;
  };
  client_secret?: string;
};

async function readApiResponse(response: Response): Promise<ApiResponse> {
  const text = await response.text();

  let result: ApiResponse;

  try {
    result = JSON.parse(text) as ApiResponse;
  } catch {
    console.error("Non-JSON API response:", {
      url: response.url,
      status: response.status,
      body: text.slice(0, 500),
    });

    throw new Error(
      `The server returned an unexpected response (HTTP ${response.status}). Please try again.`,
    );
  }

  if (!response.ok) {
    throw new Error(
      result.message ?? result.error ?? `Request failed (${response.status}).`,
    );
  }

  return result;
}

export default function CustomerDetailsStep({
  pkg,
  total: _total,
  onNext,
  submitRef,
}: CustomerDetailsStepProps) {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const customer = useActivityPickerStore((state) => state.customer);
  const picked = useActivityPickerStore((state) => state.picked);
  const members = useActivityPickerStore((state) => state.members);

  const form = useForm<BookingCustomerFormData>({
    resolver: zodResolver(customerDetailsSchema),
    defaultValues: customer,
    mode: "onSubmit",
  });

  const handleSubmit = form.handleSubmit(async (customerData) => {
    if (submitting) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        packageId: pkg.id,
        members,
        customer: customerData,
        activities: picked.map((pick) => ({
          activityId: pick.id,
          date: format(pick.date, "yyyy-MM-dd"),
          departureHour: pick.departureHour ?? null,
        })),
      };

      // Step 1: Create the package booking.
      const bookingResponse = await fetch(
        `${baseUrl}/api/package-booking/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const bookingResult = await readApiResponse(bookingResponse);
      const booking = bookingResult.data;

      if (!booking?.id || !booking.bookingRef) {
        throw new Error("The booking response is missing required information.");
      }

      // Step 2: Create or retrieve the Stripe Checkout Session.
      const checkoutResponse = await fetch(
        `${baseUrl}/api/package-booking/checkout`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId: booking.id }),
        },
      );

      const checkoutResult = await readApiResponse(checkoutResponse);

      if (!checkoutResult.client_secret) {
        throw new Error("Stripe did not return a Checkout client secret.");
      }

      // Step 3: Pass the session to the parent to render Embedded Checkout.
      onNext({
        bookingId: booking.id,
        bookingRef: booking.bookingRef,
        clientSecret: checkoutResult.client_secret,
      });
    } catch (error) {
      console.error("Package booking/checkout error:", error);

      setSubmitError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  });

  const submit = useCallback(() => {
    void handleSubmit();
  }, [handleSubmit]);

  useEffect(() => {
    submitRef.current = submit;

    return () => {
      submitRef.current = null;
    };
  }, [submitRef, submit]);

  return (
    <>
      <CustomerDetails
        register={form.register}
        errors={form.formState.errors}
        setValue={form.setValue}
        watch={form.watch}
      />

      {submitError && (
        <p role="alert" className="mt-4 text-sm font-medium text-red-600">
          {submitError}
        </p>
      )}

      {submitting && (
        <p className="mt-4 text-sm text-muted-foreground">
          Preparing your booking and secure payment...
        </p>
      )}
    </>
  );
}
