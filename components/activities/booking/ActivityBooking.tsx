"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import DatePicker from "react-datepicker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  Users,
  MapPin,
  Clock,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
  Crown,
} from "lucide-react";
import type { Activity } from "@/types/activity";
import { format, isWithinInterval } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { useBookingDialogStore } from "@/store/zustand/bookingDialogStore";
import { BookingModal } from "./BookingModal";

interface ActivityBookingProps {
  activity: Activity;
}

export default function ActivityBooking({ activity }: ActivityBookingProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [isPrivateTour, setIsPrivateTour] = useState(false);
  const [selectedDepartureHour, setSelectedDepartureHour] = useState<
    string | undefined
  >();

  const { setOpenDialog } = useBookingDialogStore();

  const isDateAvailable = (date: Date) => {
    return isWithinInterval(date, {
      start: new Date(activity.startDate),
      end: new Date(activity.endDate),
    });
  };

  const totalGroupSize = adults + children;

  const totalPrice = useMemo(() => {
    if (isPrivateTour && activity.privateTourPrice) {
      return activity.privateTourPrice;
    }
    return adults * activity.adultPrice + children * activity.childPrice;
  }, [
    adults,
    children,
    activity.adultPrice,
    activity.childPrice,
    isPrivateTour,
    activity.privateTourPrice,
  ]);

  const handleBooking = async () => {
    if (!selectedDate || !selectedDepartureHour) return;
    const bookingRef = `${activity.id.slice(0, 8).toUpperCase()}-${generateBookingReference()}`;

    const bookingData = {
      activityId: activity.id,
      date: selectedDate,
      adults,
      children,
      infants,
      totalPrice,
      activityTitle: activity.title,
      location: activity.location,
      duration: activity.duration,
      imageUrl: activity.imageUrl,
      bookingRef,
      isPrivateTour,
      departureHour: selectedDepartureHour,
    };

    localStorage.setItem("bookingDetails", JSON.stringify(bookingData));
    setOpenDialog(true);
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      setSelectedDepartureHour(undefined);
    }
  };

  const renderCustomHeader = ({
    date,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }: any) => (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 w-full">
      <button
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
        className="p-2 rounded-full hover:bg-primary/10 transition-colors disabled:opacity-30"
      >
        <ChevronLeft className="w-5 h-5 text-primary" />
      </button>
      <span className="text-lg font-semibold text-primary">
        {format(date, "MMMM yyyy")}
      </span>
      <button
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
        className="p-2 rounded-full hover:bg-primary/10 transition-colors disabled:opacity-30"
      >
        <ChevronRight className="w-5 h-5 text-primary" />
      </button>
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Book Your Experience</span>
          <Badge variant="secondary" className="text-lg font-bold">
            From $
            {isPrivateTour && activity.privateTourPrice
              ? activity.privateTourPrice
              : activity.adultPrice}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {activity.privateTourPrice && (
          <div className="border rounded-lg p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex items-center gap-3">
                <Crown className="w-5 h-5 text-amber-600" />
                <div>
                  <h3 className="font-semibold text-amber-900">
                    Private Tour Experience
                  </h3>
                  <p className="text-sm text-amber-700">
                    Exclusive private tour for your group - $
                    {activity.privateTourPrice} total
                  </p>
                </div>
              </div>
              <Button
                variant={isPrivateTour ? "default" : "outline"}
                size="sm"
                onClick={() => setIsPrivateTour(!isPrivateTour)}
                className={
                  isPrivateTour
                    ? "bg-amber-600 hover:bg-amber-700"
                    : "border-amber-300 text-amber-700 hover:bg-amber-100 mt-4"
                }
              >
                {isPrivateTour ? "Selected" : "Select"}
              </Button>
            </div>
          </div>
        )}

        {/* Date Selection */}
        <div>
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-3 text-gray-800">
              <CalendarDays className="w-5 h-5 text-primary" />
              Select Your Date
            </h3>
            <div className="border border-gray-200 rounded-lg p-4 bg-white w-full">
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                filterDate={(date) =>
                  isDateAvailable(date) && date >= new Date()
                }
                inline
                renderCustomHeader={renderCustomHeader}
                calendarClassName="w-full min-w-full bg-white"
                dayClassName={(date) => {
                  const base =
                    "mx-auto flex items-center justify-center rounded-full w-10 h-10 transition-colors";
                  if (date.getTime() === selectedDate?.getTime()) {
                    return `${base} bg-primary text-primary-foreground shadow-md`;
                  }
                  if (date < new Date() || !isDateAvailable(date)) {
                    return `${base} text-gray-400 cursor-not-allowed`;
                  }
                  return `${base} text-gray-700 hover:bg-primary/10 hover:text-primary`;
                }}
                weekDayClassName={() =>
                  "text-gray-500 text-sm font-medium py-3"
                }
                formatWeekDay={(day) => day.substring(0, 3)}
                wrapperClassName="w-full"
              />
            </div>
          </div>

          {selectedDate && (
            <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <p className="text-blue-800 font-medium">
                📅 {format(selectedDate, "EEEE, MMMM do, yyyy")}
              </p>
              <p className="text-blue-600 text-sm mt-1">
                {isPrivateTour && activity.privateTourPrice ? (
                  <>🏆 Private Tour: ${activity.privateTourPrice} total</>
                ) : (
                  <>
                    💰 ${activity.adultPrice} per adult • ${activity.childPrice}{" "}
                    per child
                  </>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Departure Hours Selection */}
        {selectedDate &&
          activity.departureHours &&
          activity.departureHours.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-3 text-gray-800 mb-4">
                <Clock className="w-5 h-5 text-primary" />
                Select Departure Time
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {activity.departureHours.map((hour) => (
                  <Button
                    key={hour}
                    variant={
                      selectedDepartureHour === hour ? "default" : "outline"
                    }
                    onClick={() => setSelectedDepartureHour(hour)}
                    className={`p-3 h-auto ${
                      selectedDepartureHour === hour
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-primary/10"
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-semibold">{hour}</div>
                      <div className="text-xs opacity-75">Departure</div>
                    </div>
                  </Button>
                ))}
              </div>
              {selectedDepartureHour && (
                <div className="mt-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <p className="text-green-800 font-medium">
                    🕐 Departure: {selectedDepartureHour}
                  </p>
                </div>
              )}
            </div>
          )}

        {/* Guest Selection */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Users className="w-4 h-4" />
            {isPrivateTour ? "Group Size (1-8 people)" : "Guests"}
          </h3>
          {isPrivateTour && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-700 mb-2">
                Private tour pricing includes your entire group (up to 8 people
                total).
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-amber-900">
                  Current group size: {totalGroupSize}/8
                </span>
                <div className="flex-1 bg-amber-200 rounded-full h-2">
                  <div
                    className="bg-amber-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(totalGroupSize / 8) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          )}
          <div className="space-y-4">
            {/* Adults */}
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">Adults</p>
                  <p className="text-sm text-gray-500">(Age 14 - 99)</p>
                </div>
                <p className="text-sm text-gray-500">
                  {isPrivateTour
                    ? "Included in private tour price"
                    : `$${activity.adultPrice} per person`}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAdults(Math.max(1, adults - 1))}
                  disabled={adults <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-8 text-center font-medium">{adults}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAdults(adults + 1)}
                  disabled={isPrivateTour && totalGroupSize >= 8}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Children */}
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">Children</p>
                  <p className="text-sm text-gray-500">(Age 4 - 13)</p>
                </div>
                <p className="text-sm text-gray-500">
                  {isPrivateTour
                    ? "Included in private tour price"
                    : `$${activity.childPrice} per child`}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setChildren(Math.max(0, children - 1))}
                  disabled={children <= 0}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-8 text-center font-medium">{children}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setChildren(children + 1)}
                  disabled={isPrivateTour && totalGroupSize >= 8}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {/* Infants */}
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">Infants</p>
                  <p className="text-sm text-gray-500">(Age 0 - 3)</p>
                </div>
                <p className="text-sm text-gray-500">
                  {isPrivateTour
                    ? "Included in private tour price"
                    : `$0 per Infant`}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInfants(Math.max(0, children - 1))}
                  disabled={infants <= 0}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-8 text-center font-medium">{infants}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInfants(infants + 1)}
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
              <div
                className={`text-white p-4 ${isPrivateTour ? "bg-gradient-to-r from-amber-600 to-orange-600" : "bg-gradient-to-r from-blue-600 to-indigo-600"}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      {isPrivateTour && <Crown className="w-5 h-5" />}
                      {isPrivateTour
                        ? "PRIVATE TOUR TICKET"
                        : "ACTIVITY TICKET"}
                    </h3>
                    <p
                      className={`text-sm ${isPrivateTour ? "text-amber-100" : "text-blue-100"}`}
                    >
                      Booking Confirmation
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">${totalPrice}</p>
                    <p
                      className={`text-sm ${isPrivateTour ? "text-amber-100" : "text-blue-100"}`}
                    >
                      {isPrivateTour ? "Private Tour Price" : "Total Price"}
                    </p>
                  </div>
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
                      {format(selectedDate, "MMM dd, yyyy")}
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
                      {selectedDepartureHour ? "Departure" : "Duration"}
                    </p>
                    <p className="font-medium text-gray-900 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {selectedDepartureHour || activity.duration}
                    </p>
                  </div>
                </div>

                {/* Guests */}
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
                    Passengers
                  </p>
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg ${isPrivateTour ? "bg-amber-50 border border-amber-200" : "bg-gray-50"}`}
                    >
                      <Users className="w-4 h-4 text-gray-600" />
                      <span className="font-medium">
                        {adults} Adult
                        {adults > 1 ? "s" : ""}
                      </span>
                    </div>
                    {children > 0 && (
                      <div
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg ${isPrivateTour ? "bg-amber-50 border border-amber-200" : "bg-gray-50"}`}
                      >
                        <Users className="w-4 h-4 text-gray-600" />
                        <span className="font-medium">
                          {children} Child
                          {children > 1 ? "ren" : ""}
                        </span>
                      </div>
                    )}
                    {isPrivateTour && (
                      <div className="flex items-center gap-2 bg-amber-100 px-3 py-2 rounded-lg border border-amber-300">
                        <Crown className="w-4 h-4 text-amber-600" />
                        <span className="font-medium text-amber-900">
                          Private Tour
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
                    {isPrivateTour ? (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 flex items-center gap-2">
                          <Crown className="w-4 h-4 text-amber-600" />
                          Private Tour (Fixed Price)
                        </span>
                        <span className="font-medium">
                          ${activity.privateTourPrice}
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            Adults ({adults} × ${activity.adultPrice})
                          </span>
                          <span className="font-medium">
                            ${adults * activity.adultPrice}
                          </span>
                        </div>
                        {children > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                              Children ({children} × ${activity.childPrice})
                            </span>
                            <span className="font-medium">
                              ${children * activity.childPrice}
                            </span>
                          </div>
                        )}
                      </>
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
              </div>
            </div>
          </div>
        )}

        {/* Book Now Button */}
        <Button
          onClick={handleBooking}
          disabled={!selectedDate || !selectedDepartureHour}
          className="w-full"
        >
          {!selectedDate
            ? "Select Date First"
            : !selectedDepartureHour
              ? "Select Departure Time"
              : "Book Now"}
        </Button>
        <BookingModal />
      </CardContent>
    </Card>
  );
}

export const generateBookingReference = () => {
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return randomPart;
};
