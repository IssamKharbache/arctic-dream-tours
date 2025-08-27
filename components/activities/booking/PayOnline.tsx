"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import React, { useCallback } from "react";
import { BookingSummaryData } from "./BookingSummary";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

export interface CreatedBooking {
  id: string;
  activityId: string;
  adults: number;
  bookingRef: string;
  children: number;
  createdAt: string;
  date: string;
  departureHour: string;
  dropOffLocation: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  pickUpLocation: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  totalPrice: number;
  userId: string | null;
  isPrivate: boolean;
}
const PayOnline = ({
  booking,
  onBookingRequest,
}: {
  booking: BookingSummaryData;
  onBookingRequest: () => Promise<CreatedBooking | null>;
}) => {
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
  );
  const fetchClientSecret = useCallback(async () => {
    try {
      const newBooking = await onBookingRequest();
      if (!newBooking) throw new Error("Booking creation failed");

      const response = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: newBooking.id }), // ✅ send correct format
      });

      const data = await response.json();
      if (data?.error) {
        throw new Error(data.error || "Something went wrong");
      }
      return data.client_secret;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }, [onBookingRequest]);
  const options = { fetchClientSecret };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Pay now</Button>
      </DialogTrigger>
      <DialogContent className="my-4 py-12 xl:max-w-screen-xl z-50">
        <DialogHeader>
          <DialogTitle>{booking.activityTitle}</DialogTitle>
        </DialogHeader>
        <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
          <EmbeddedCheckout className="max-h-[80dvh] overflow-y-auto" />
        </EmbeddedCheckoutProvider>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel Payment</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PayOnline;
