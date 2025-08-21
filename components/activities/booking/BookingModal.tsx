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
    BookingCustomerFormData,
    customerDetailsSchema,
} from "@/lib/schema/validations/validation";
import BookingSummary from "./BookingSummary";
import BookingStepsBar from "./BookingStepsBar";

export function BookingModal() {
    const { openDialog, setOpenDialog, setStep, step } =
        useBookingDialogStore();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<BookingCustomerFormData>({
        resolver: zodResolver(customerDetailsSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            pickUpLocation: "",
            dropOffLocation: "",
        },
    });

    const onSubmit = (data: BookingCustomerFormData) => {
        localStorage.setItem("customerData", JSON.stringify(data));
        setStep(2);
    };

    return (
        <>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="min-w-[70vw] h-[90vh]  rounded-none focus:outline-none">
                    <DialogHeader>
                        <BookingStepsBar step={step} />
                        <DialogTitle>Complete Your Booking</DialogTitle>
                        <DialogDescription>
                            {step === 1
                                ? "Enter your contact details to proceed."
                                : "Review your booking and proceed to payment."}
                        </DialogDescription>
                    </DialogHeader>
                    {step === 1 ? (
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <CustomerDetails
                                register={register}
                                errors={errors}
                            />
                            <DialogFooter className="gap-2 mt-5">
                                <Button
                                    type="submit"
                                    className="rounded-sm px-9"
                                >
                                    Continue
                                </Button>
                            </DialogFooter>
                        </form>
                    ) : (
                        <BookingSummary onBack={() => setStep(1)} />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
