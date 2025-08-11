"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import Image from "next/image";

interface BookingSummaryData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    activityTitle?: string;
    location?: string;
    date?: string;
    duration?: string;
    adults?: number;
    children?: number;
    totalPrice?: number;
    imageUrl: string;
}

const BookingSummary: React.FC<{
    onBack?: () => void;
    onConfirm?: () => void;
}> = ({ onBack, onConfirm }) => {
    const [bookingData, setBookingData] = useState<BookingSummaryData | null>(
        null,
    );

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

    return (
        <div className=" p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">
                Booking Summary
            </h2>
            <div className="flex flex-col  justify-center">
                <Card className="mb-6">
                    <CardContent className="flex p-0">
                        <div className="flex ">
                            {/* Left side - Activity image */}
                            <div className="w-32 h-32 flex-shrink-0">
                                <Image
                                    width={450}
                                    height={450}
                                    src={bookingData.imageUrl}
                                    alt={
                                        bookingData.activityTitle || "Activity"
                                    }
                                    className="w-full h-full px-2 object-cover rounded-l-lg"
                                />
                            </div>

                            {/* Right side - Activity details */}
                            <div className="flex-1 p-6">
                                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                                    {bookingData.activityTitle ||
                                        "Activity Booking"}
                                </h3>

                                <div className=" space-y-3">
                                    {(bookingData.adults ||
                                        bookingData.children) && (
                                        <div className="flex items-center gap-2 text-gray-600">
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
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Calendar className="w-4 h-4" />
                                            <span className="font-medium">
                                                Departure
                                            </span>
                                            <span>{bookingData.date}</span>
                                        </div>
                                    )}

                                    {bookingData.duration && (
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Clock className="w-4 h-4" />
                                            <span className="font-medium">
                                                Duration
                                            </span>
                                            <span>{bookingData.duration}</span>
                                        </div>
                                    )}

                                    {bookingData.location && (
                                        <div className="flex items-center gap-2 text-gray-600">
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
            </div>
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
                {onConfirm && (
                    <Button
                        onClick={onConfirm}
                        className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700"
                    >
                        Confirm Booking
                    </Button>
                )}
            </div>
        </div>
    );
};

export default BookingSummary;
