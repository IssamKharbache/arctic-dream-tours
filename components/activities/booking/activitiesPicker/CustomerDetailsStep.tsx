"use client";

import { useCallback, useEffect, type RefObject } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  customerDetailsSchema,
  type BookingCustomerFormData,
} from "@/lib/schema/validations/validation";
import { useActivityPickerStore } from "@/store/zustand/activityPickerStore";
import CustomerDetails from "../CustomerDetails";

type CustomerDetailsStepProps = {
  submitRef: RefObject<(() => void) | null>;
  /** Called after the form is valid and saved in the store. */
  onValid: () => void;
};


export default function CustomerDetailsStep({
  submitRef,
  onValid,
}: CustomerDetailsStepProps) {
  const customer = useActivityPickerStore((state) => state.customer);
  const setCustomer = useActivityPickerStore((state) => state.setCustomer);

  const form = useForm<BookingCustomerFormData>({
    resolver: zodResolver(customerDetailsSchema),
    defaultValues: customer,
    mode: "onSubmit",
  });

  const handleSubmit = form.handleSubmit((customerData) => {
    setCustomer(customerData);
    onValid();
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
    <CustomerDetails
      register={form.register}
      errors={form.formState.errors}
      setValue={form.setValue}
      watch={form.watch}
    />
  );
}