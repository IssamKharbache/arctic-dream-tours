"use client";

import { useState, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Users, MapPin, Clock, Minus, Plus } from "lucide-react";
import { Activity } from "@/types/activity";
import { format, isWithinInterval } from "date-fns";

interface ActivityBookingProps {
    activity: Activity;
}

export default function ActivityBooking({ activity }: ActivityBookingProps) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);

    // Check if date is available
    const isDateAvailable = (date: Date) => {
        return isWithinInterval(date, {
            start: new Date(activity.startDate),
            end: new Date(activity.endDate),
        });
    };

    // Calculate total price
    const totalPrice = useMemo(() => {
        return adults * activity.adultPrice + children * activity.childPrice;
    }, [adults, children, activity.adultPrice, activity.childPrice]);

    const handleBooking = () => {
        if (!selectedDate) return;

        const bookingData = {
            activityId: activity.id,
            date: selectedDate,
            adults,
            children,
            totalPrice,
            activityTitle: activity.title,
            location: activity.location,
            duration: activity.duration,
        };

        console.log("Booking data:", bookingData);
        // Here you would typically send this to your booking API
        alert("Booking functionality would be implemented here!");
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Book Your Experience</span>
                    <Badge variant="secondary" className="text-lg font-bold">
                        From ${activity.adultPrice}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Date Selection */}
                <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <CalendarDays className="w-4 h-4" />
                        Select Date
                    </h3>
                    <div className="border rounded-lg p-4 w-full">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            disabled={(date) =>
                                !isDateAvailable(date) || date < new Date()
                            }
                            className="w-full"
                            classNames={{
                                months: "w-full",
                                month: "w-full space-y-4",
                                caption:
                                    "flex justify-center items-center relative pt-1",
                                caption_label: "text-sm font-medium",
                                nav: "flex items-center gap-1",
                                nav_button:
                                    "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                                nav_button_previous: "absolute left-1",
                                nav_button_next: "absolute right-1",
                                table: "w-full border-collapse space-y-1",
                                head_row: "flex",
                                head_cell:
                                    "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                                row: "flex w-full mt-2",
                                cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                                day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                                day_selected:
                                    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                                day_today: "bg-accent text-accent-foreground",
                                day_outside: "text-muted-foreground opacity-50",
                                day_disabled:
                                    "text-muted-foreground opacity-50",
                                day_range_middle:
                                    "aria-selected:bg-accent aria-selected:text-accent-foreground",
                                day_hidden: "invisible",
                            }}
                        />
                    </div>
                    {selectedDate && (
                        <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                            <p className="text-blue-800 font-medium">
                                📅 {format(selectedDate, "EEEE, MMMM do, yyyy")}
                            </p>
                            <p className="text-blue-600 text-sm mt-1">
                                💰 ${activity.adultPrice} per adult • $
                                {activity.childPrice} per child
                            </p>
                        </div>
                    )}
                </div>

                {/* Guest Selection */}
                <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Guests
                    </h3>
                    <div className="space-y-4">
                        {/* Adults */}
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Adults</p>
                                <p className="text-sm text-gray-500">
                                    ${activity.adultPrice} per person
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        setAdults(Math.max(1, adults - 1))
                                    }
                                    disabled={adults <= 1}
                                >
                                    <Minus className="w-4 h-4" />
                                </Button>
                                <span className="w-8 text-center font-medium">
                                    {adults}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setAdults(adults + 1)}
                                >
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Children */}
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Children</p>
                                <p className="text-sm text-gray-500">
                                    ${activity.childPrice} per child
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        setChildren(Math.max(0, children - 1))
                                    }
                                    disabled={children <= 0}
                                >
                                    <Minus className="w-4 h-4" />
                                </Button>
                                <span className="w-8 text-center font-medium">
                                    {children}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setChildren(children + 1)}
                                >
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Booking Summary - Ticket Design */}
                {selectedDate && (
                    <div className="relative">
                        {/* Ticket */}
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-dashed border-gray-300">
                            {/* Ticket Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-bold text-lg">
                                            ACTIVITY TICKET
                                        </h3>
                                        <p className="text-blue-100 text-sm">
                                            Booking Confirmation
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold">
                                            ${totalPrice}
                                        </p>
                                        <p className="text-blue-100 text-sm">
                                            Total Price
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Perforated Line */}
                            <div className="relative h-6 bg-gray-50">
                                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white rounded-full border-2 border-gray-300 -ml-3"></div>
                                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white rounded-full border-2 border-gray-300 -mr-3"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-full border-t-2 border-dashed border-gray-300"></div>
                                </div>
                            </div>

                            {/* Ticket Body */}
                            <div className="p-6 space-y-4">
                                {/* Activity Info */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                                            Activity
                                        </p>
                                        <p className="font-bold text-gray-900 truncate">
                                            {activity.title}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                                            Date
                                        </p>
                                        <p className="font-bold text-gray-900">
                                            {format(
                                                selectedDate,
                                                "MMM dd, yyyy",
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                                            Location
                                        </p>
                                        <p className="font-medium text-gray-900 flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            {activity.location}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                                            Duration
                                        </p>
                                        <p className="font-medium text-gray-900 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {activity.duration}
                                        </p>
                                    </div>
                                </div>

                                {/* Guests */}
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
                                        Passengers
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                                            <Users className="w-4 h-4 text-gray-600" />
                                            <span className="font-medium">
                                                {adults} Adult
                                                {adults > 1 ? "s" : ""}
                                            </span>
                                        </div>
                                        {children > 0 && (
                                            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                                                <Users className="w-4 h-4 text-gray-600" />
                                                <span className="font-medium">
                                                    {children} Child
                                                    {children > 1 ? "ren" : ""}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Price Breakdown */}
                                <div className="border-t pt-4">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-3">
                                        Price Breakdown
                                    </p>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">
                                                Adults ({adults} × $
                                                {activity.adultPrice})
                                            </span>
                                            <span className="font-medium">
                                                ${adults * activity.adultPrice}
                                            </span>
                                        </div>
                                        {children > 0 && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">
                                                    Children ({children} × $
                                                    {activity.childPrice})
                                                </span>
                                                <span className="font-medium">
                                                    $
                                                    {children *
                                                        activity.childPrice}
                                                </span>
                                            </div>
                                        )}
                                        <div className="border-t pt-2 mt-2">
                                            <div className="flex justify-between items-center">
                                                <span className="font-semibold text-gray-900">
                                                    Total Amount
                                                </span>
                                                <span className="font-bold text-xl text-green-600">
                                                    ${totalPrice}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Booking Reference */}
                                <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-blue-500">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                                        Booking Reference
                                    </p>
                                    <p className="font-mono font-bold text-gray-900 text-lg">
                                        {activity.id.slice(0, 8).toUpperCase()}-
                                        {Math.random()
                                            .toString(36)
                                            .substr(2, 4)
                                            .toUpperCase()}
                                    </p>
                                </div>
                            </div>

                            {/* Ticket Footer */}
                            <div className="bg-gray-50 px-6 py-4 border-t">
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>
                                        🎫 Keep this ticket for your records
                                    </span>
                                    <span>
                                        Issued:{" "}
                                        {format(new Date(), "MMM dd, HH:mm")}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Book Button */}
                <Button
                    className="w-full h-12 text-lg font-semibold"
                    onClick={handleBooking}
                    disabled={!selectedDate}
                >
                    {selectedDate
                        ? `Book Now - $${totalPrice}`
                        : "Select Date to Continue"}
                </Button>

                {/* Additional Info */}
                <div className="text-xs text-gray-500 space-y-1">
                    <p>
                        • Free cancellation up to {activity.bookingCutoffHours}{" "}
                        hours before
                    </p>
                    <p>
                        •{" "}
                        {activity.liveTourGuide
                            ? "Live tour guide included"
                            : "Self-guided experience"}
                    </p>
                    <p>• Difficulty level: {activity.difficulty}</p>
                </div>
            </CardContent>
        </Card>
    );
}
