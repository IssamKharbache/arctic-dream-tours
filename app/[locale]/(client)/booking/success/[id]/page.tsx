"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    CheckCircle,
    Calendar,
    MapPin,
    Users,
    Clock,
    Mail,
    Phone,
    Copy,
    Check,
} from "lucide-react";
import { isoToNormalDate } from "@/utils/isoToNormalDate";
import { baseUrl } from "@/utils/baseUrl";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface Activity {
    id: string;
    title: string;
    location: string;
    duration?: string;
    description?: string;
    imageUrl?: string;
    [key: string]: any;
}

interface BookingData {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    date: string;
    adults: number;
    children: number;
    totalPrice: number;
    activity: Activity;
    bookingRef: string;
}

const fetchBooking = async (bookingId: string) => {
    const res = await fetch(`${baseUrl}/api/booking/get/${bookingId}`);
    if (!res.ok) throw new Error("Booking not found");
    const data = await res.json();
    return data.booking as BookingData;
};

/* --------------------------- Sub Components --------------------------- */

const SuccessHeader = ({ bookingRef }: { bookingRef: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(bookingRef);
        setCopied(true);
        setTimeout(() => setCopied(false), 5000);
    };

    return (
        <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
                <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Booking Confirmed!
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Thank you for your booking. We've sent a confirmation email with
                all the details.
            </p>
            <Badge
                variant="secondary"
                className="gap-5 mt-4 px-4 py-3 text-md font-medium"
            >
                Booking reference :{" "}
                <p className="font-semibold">#{bookingRef}</p>
                <button
                    onClick={handleCopy}
                    disabled={copied}
                    className="ml-3 text-gray-700 hover:text-black transition"
                >
                    {copied ? (
                        <Check className="w-5 h-5 text-green-600" />
                    ) : (
                        <Copy className="w-5 h-5" />
                    )}
                </button>
            </Badge>
        </div>
    );
};

const ActivityDetails = ({ booking }: { booking: BookingData }) => (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-8">
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {booking.activity.title}
                    </h2>
                    {booking.activity.location && (
                        <div className="flex items-center text-gray-600 mb-4">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>{booking.activity.location}</span>
                        </div>
                    )}
                </div>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                    Confirmed
                </Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-blue-600 mr-3" />
                        <div>
                            <p className="text-sm text-gray-500">Date</p>
                            <p className="font-semibold text-gray-900">
                                {isoToNormalDate(booking.date)}
                            </p>
                        </div>
                    </div>

                    {booking.activity.duration && (
                        <div className="flex items-center">
                            <Clock className="w-5 h-5 text-purple-600 mr-3" />
                            <div>
                                <p className="text-sm text-gray-500">
                                    Duration
                                </p>
                                <p className="font-semibold text-gray-900">
                                    {booking.activity.duration}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <div className="flex items-center">
                        <Users className="w-5 h-5 text-orange-600 mr-3" />
                        <div>
                            <p className="text-sm text-gray-500">Travelers</p>
                            <p className="font-semibold text-gray-900">
                                {booking.adults} Adult
                                {booking.adults > 1 ? "s" : ""}
                                {booking.children > 0 &&
                                    `, ${booking.children} Child${booking.children > 1 ? "ren" : ""}`}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
);

const CustomerInfo = ({ booking }: { booking: BookingData }) => (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
                Customer Information
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <p className="text-sm text-gray-500 mb-1">Full Name</p>
                    <p className="font-semibold text-gray-900 text-lg">
                        {booking.firstName} {booking.lastName}
                    </p>
                </div>
                <div>
                    <p className="text-sm text-gray-500 mb-1">Email Address</p>
                    <div className="flex items-center">
                        <Mail className="w-4 h-4 text-gray-400 mr-2" />
                        <p className="font-medium text-gray-900">
                            {booking.email}
                        </p>
                    </div>
                </div>
                <div className="md:col-span-2">
                    <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                    <div className="flex items-center">
                        <Phone className="w-4 h-4 text-gray-400 mr-2" />
                        <p className="font-medium text-gray-900">
                            {booking.phone}
                        </p>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
);

const PriceSummary = ({ total }: { total: number }) => (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
                Price Summary
            </h3>
            <Separator className="mb-4" />
            <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Taxes & Fees</span>
                    <span>Included</span>
                </div>
                <Separator />
                <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total Paid</span>
                    <span>${total.toFixed(2)}</span>
                </div>
            </div>
        </CardContent>
    </Card>
);

/* --------------------------- Main Page --------------------------- */

const BookingSuccessPage = () => {
    const params = useParams();
    const bookingId = params.id;

    const {
        data: booking,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["booking", bookingId],
        queryFn: () => fetchBooking(bookingId as string),
        enabled: !!bookingId,
    });

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error: {(error as Error).message}</div>;
    if (!booking) return <div>Booking not found</div>;

    return (
        <div className="min-h-screen pt-24 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <SuccessHeader bookingRef={booking.bookingRef} />

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <ActivityDetails booking={booking} />
                        <CustomerInfo booking={booking} />
                    </div>
                    <div className="space-y-6">
                        <PriceSummary total={booking.totalPrice} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingSuccessPage;
