"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useBookingDialogStore } from "@/store/zustand/bookingDialogStore";
import CustomerDetails from "./CustomerDetails";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  type BookingCustomerFormData,
  customerDetailsSchema,
} from "@/lib/schema/validations/validation";
import BookingSummary from "./BookingSummary";
import BookingStepsBar from "./BookingStepsBar";
import { useTranslations } from "next-intl";

export function BookingModal() {
  const { openDialog, setOpenDialog, setStep, step } = useBookingDialogStore();
  const t = useTranslations("booking");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BookingCustomerFormData>({
    resolver: zodResolver(customerDetailsSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      pickUpLocation: "I don't need pick up",
      dropOffLocation: "I don't need drop off",
    },
  });

  const onSubmit = (data: BookingCustomerFormData) => {
    localStorage.setItem("customerData", JSON.stringify(data));
    setStep(2);
  };

  return (
    <>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="min-w-[70vw] h-[90vh] flex flex-col rounded-none focus:outline-none">
          <DialogHeader className="flex-shrink-0">
            <BookingStepsBar step={step} t={t} />
            <DialogTitle>{t("modal.title")}</DialogTitle>
            <DialogDescription>
              {step === 1
                ? t("modal.description.step1")
                : t("modal.description.step2")}
            </DialogDescription>
          </DialogHeader>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto pr-2">
            {step === 1 ? (
              <form onSubmit={handleSubmit(onSubmit)}>
                <CustomerDetails
                  register={register}
                  errors={errors}
                  setValue={setValue}
                  watch={watch}
                />
                <DialogFooter className="gap-2 mt-5">
                  <Button type="submit" className="rounded-sm px-9">
                    {t("modal.continue")}
                  </Button>
                </DialogFooter>
              </form>
            ) : (
              <BookingSummary onBack={() => setStep(1)} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
