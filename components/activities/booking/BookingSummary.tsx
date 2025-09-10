"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import Image from "next/image";
import { isoToNormalDate } from "@/utils/isoToNormalDate";
import { baseUrl } from "@/utils/baseUrl";
import { useRouter } from "@/i18n/navigation";
import PayOnline from "./PayOnline";
import { useBookingDialogStore } from "@/store/zustand/bookingDialogStore";

export interface BookingSummaryData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  activityId: string;
  activityTitle?: string;
  location?: string;
  date?: string;
  duration?: string;
  adults?: number;
  children?: number;
  infants?: number;
  totalPrice?: number;
  imageUrl: string;
  bookingRef: string;
  pickUpLocation: string;
  dropOffLocation: string;
  departureHour: string;
  isPrivateTour: boolean;
}

const BookingSummary: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [bookingData, setBookingData] = useState<BookingSummaryData | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { setStep } = useBookingDialogStore();

  const router = useRouter();
  useEffect(() => {
    const customerData = JSON.parse(
      localStorage.getItem("customerData") || "{}"
    );
    const bookingDetails = JSON.parse(
      localStorage.getItem("bookingDetails") || "{}"
    );
    setBookingData({ ...bookingDetails, ...customerData });
  }, []);

  if (!bookingData) {
    return <p className="text-center text-gray-500">No booking data found.</p>;
  }

  const payload = {
    activityId: bookingData.activityId,
    date: bookingData.date!,
    adults: bookingData.adults ?? 1,
    children: bookingData.children ?? 0,
    infants: bookingData.infants ?? 0,
    bookingRef: bookingData.bookingRef,
    departureHour: bookingData.departureHour ?? "",
    isPrivate: bookingData.isPrivateTour ?? false,
    firstName: bookingData.firstName,
    lastName: bookingData.lastName,
    email: bookingData.email,
    phone: bookingData.phone,
    pickUpLocation: bookingData.pickUpLocation,
    dropOffLocation: bookingData.dropOffLocation,
  };

  const handleRequestBooking = async (type: string) => {
    try {
      setIsSubmitting(true);
      const res = await fetch(`${baseUrl}/api/booking/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(`Booking failed: ${data.message || "Unknown error"}`);
        return null;
      }
      if (type === "request") {
        setStep(0);
        router.push(
          `/booking/request/success/${data.data.id}?token=${data.data.accessToken}` as any
        );
      }
      setStep(0);
      return data.data;
    } catch (error) {
      console.error(error);
      alert("An error occurred while creating the booking");
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Booking Summary</h2>

      <Card className="mb-6 overflow-hidden">
        <CardContent className="p-0 flex flex-col sm:flex-row">
          <div className="relative w-full sm:w-80 h-64 sm:h-auto flex-shrink-0">
            <Image
              src={bookingData.imageUrl}
              alt={bookingData.activityTitle || "Activity"}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 320px"
            />
            {/* Gradient overlay for better text contrast if needed */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent sm:bg-gradient-to-l sm:from-black/10 sm:to-transparent"></div>
          </div>
          <div className="flex-1 p-4 sm:p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">
              {bookingData.activityTitle || "Activity Booking"}
            </h3>
            <div className="space-y-3 text-gray-600">
              {(bookingData.adults || bookingData.children) && (
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span className="font-medium">Travellers</span>
                  <span>
                    {bookingData.adults || 0} Adults
                    {bookingData.children
                      ? `, ${bookingData.children} Children`
                      : ""}
                  </span>
                </div>
              )}
              {bookingData.date && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">Departure</span>
                  <span>{isoToNormalDate(bookingData.date)}</span>
                </div>
              )}
              {bookingData.duration && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">Duration</span>
                  <span>{bookingData.duration}</span>
                </div>
              )}
              {bookingData.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span className="font-medium">Location</span>
                  <span>{bookingData.location}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col justify-between sm:flex-row gap-3">
        {onBack && (
          <Button
            variant="outline"
            onClick={onBack}
            className="flex-1 sm:flex-none bg-transparent"
          >
            Back
          </Button>
        )}
        <div className="flex gap-3">
          <Button
            onClick={() => handleRequestBooking("request")}
            className="flex-1 sm:flex-none bg-yellow-500 hover:bg-yellow-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Request Booking"}
          </Button>
          <PayOnline
            booking={bookingData}
            onBookingRequest={handleRequestBooking}
          />
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
