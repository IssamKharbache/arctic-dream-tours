import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import Image from "next/image";
import { isoToNormalDate } from "@/utils/isoToNormalDate";
import { baseUrl } from "@/utils/baseUrl";
import { useBookingDialogStore } from "@/store/zustand/bookingDialogStore";
import { useRouter } from "@/i18n/navigation";
interface BookingSummaryData {
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
    totalPrice?: number;
    imageUrl: string;
    bookingRef: string;
    pickUpLocation: string;
    dropOffLocation: string;
    departureHour: string;
    isPrivateTour: boolean;
}

const BookingSummary: React.FC<{
    onBack?: () => void;
}> = ({ onBack }) => {
    const router = useRouter();

    const [bookingData, setBookingData] = useState<BookingSummaryData | null>(
        null,
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { setOpenDialog, setStep } = useBookingDialogStore();

    useEffect(() => {
        const customerData = JSON.parse(
            localStorage.getItem("customerData") || "{}",
        );
        const bookingDetails = JSON.parse(
            localStorage.getItem("bookingDetails") || "{}",
        );

        setBookingData({
            ...bookingDetails,
            ...customerData,
        });
    }, []);

    if (!bookingData) {
        return (
            <p className="text-center text-gray-500">No booking data found.</p>
        );
    }

    const handleConfirmBooking = async () => {
        if (!bookingData) return;

        const payload = {
            activityId: bookingData.activityId,
            date: bookingData.date!,
            adults: bookingData.adults ?? 1,
            children: bookingData.children ?? 0,
            bookingRef: bookingData.bookingRef,
            departureHour: bookingData.departureHour ?? "",
            isPrivate: bookingData.isPrivateTour ?? false, // ✅ fix key name

            // Customer details
            firstName: bookingData.firstName,
            lastName: bookingData.lastName,
            email: bookingData.email,
            phone: bookingData.phone,
            pickUpLocation: bookingData.pickUpLocation,
            dropOffLocation: bookingData.dropOffLocation,
        };

        try {
            setIsSubmitting(true);
            const res = await fetch(`${baseUrl}/api/booking/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                console.error(data);
                alert(`Booking failed: ${data.message || "Unknown error"}`);
                return;
            }

            setStep(0);
            localStorage.removeItem("customerData");
            localStorage.removeItem("bookingDetails");
            setOpenDialog(false);
            router.push(`/booking/success/${data.data.id}` as any);
        } catch (error) {
            console.error(error);
            alert("An error occurred while creating the booking");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">
                Booking Summary
            </h2>
            <Card className="mb-6">
                <CardContent className="flex p-0">
                    <div className="flex">
                        <div className="w-80 h-80 flex-shrink-0">
                            <Image
                                width={450}
                                height={450}
                                src={bookingData.imageUrl}
                                alt={bookingData.activityTitle || "Activity"}
                                className="w-full h-full px-2 object-cover rounded-l-lg"
                            />
                        </div>
                        <div className="flex-1 p-6">
                            <h3 className="text-xl font-semibold mb-4 text-gray-900">
                                {bookingData.activityTitle ||
                                    "Activity Booking"}
                            </h3>
                            <div className="space-y-3 text-gray-600">
                                {(bookingData.adults ||
                                    bookingData.children) && (
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4" />
                                        <span className="font-medium">
                                            Travellers
                                        </span>
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
                                        <span className="font-medium">
                                            Departure
                                        </span>
                                        <span>
                                            {isoToNormalDate(bookingData.date)}
                                        </span>
                                    </div>
                                )}
                                {bookingData.duration && (
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        <span className="font-medium">
                                            Duration
                                        </span>
                                        <span>{bookingData.duration}</span>
                                    </div>
                                )}
                                {bookingData.location && (
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        <span className="font-medium">
                                            Location
                                        </span>
                                        <span>{bookingData.location}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <div className="flex flex-col sm:flex-row gap-3 justify-between">
                {onBack && (
                    <Button
                        variant="outline"
                        onClick={onBack}
                        className="flex-1 sm:flex-none bg-transparent"
                    >
                        Back
                    </Button>
                )}
                <Button
                    onClick={handleConfirmBooking}
                    className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Submitting..." : "Confirm Booking"}
                </Button>
            </div>
        </div>
    );
};

export default BookingSummary;
