"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
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
import {
  format,
  isWithinInterval,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
} from "date-fns";
import { useBookingDialogStore } from "@/store/zustand/bookingDialogStore";
import { BookingModal } from "./BookingModal";
import { fbEvent } from "@/lib/fpixel";
import { useTranslations } from "next-intl";

interface ActivityBookingProps {
  activity: Activity;
}

const CustomCalendar = ({
  selectedDate,
  onDateChange,
  isDateAvailable,
}: {
  selectedDate: Date | undefined;
  onDateChange: (date: Date) => void;
  isDateAvailable: (date: Date) => boolean;
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const weeks: Date[][] = [];
  let week: Date[] = [];

  daysInMonth.forEach((day, index) => {
    if (index % 7 === 0 && week.length > 0) {
      weeks.push(week);
      week = [];
    }
    week.push(day);
  });
  if (week.length > 0) weeks.push(week);

  const t = useTranslations("bookingDetails");

  // Get weekdays from the translation as an array
  const weekdays = t.raw("weekdays");

  return (
    <div className="w-full bg-white rounded-lg border border-gray-100 shadow-sm">
      {/* Calendar Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 w-full">
        <button
          onClick={prevMonth}
          className="p-2 rounded-full hover:bg-primary/10 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-primary" />
        </button>
        <span className="text-lg font-semibold text-primary">
          {format(currentMonth, "MMMM yyyy")}
        </span>
        <button
          onClick={nextMonth}
          className="p-2 rounded-full hover:bg-primary/10 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-primary" />
        </button>
      </div>

      {/* Week Days */}
      <div className="grid grid-cols-7 text-gray-500 text-sm font-medium py-2 px-1">
        {weekdays.map((day: string, index: number) => (
          <div key={index} className="text-center py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="px-1 py-3 pb-2">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7">
            {week.map((day, dayIndex) => {
              const isAvailable = isDateAvailable(day) && day >= new Date();
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, currentMonth);

              const baseClasses =
                "mx-auto flex items-center justify-center rounded-full w-10 h-10 transition-all duration-200";

              let dayClasses = baseClasses;
              if (isSelected) {
                dayClasses += " bg-primary text-primary-foreground shadow-md";
              } else if (!isAvailable || !isCurrentMonth) {
                dayClasses += " text-gray-300 cursor-not-allowed";
              } else {
                dayClasses +=
                  " text-gray-700 hover:bg-primary/10 hover:text-primary";
              }

              return (
                <button
                  key={dayIndex}
                  onClick={() =>
                    isAvailable && isCurrentMonth && onDateChange(day)
                  }
                  disabled={!isAvailable || !isCurrentMonth}
                  className={dayClasses}
                >
                  {format(day, "d")}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

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
  const t = useTranslations("bookingDetails");
  const BOOKING_DEADLINE = new Date("2026-03-09T23:59:59");
  const isDateAvailable = (date: Date) => {
    const today = new Date();

    return date >= today && date <= BOOKING_DEADLINE;
  };

  const totalGroupSize = adults + children;

  const totalPrice = useMemo(() => {
    if (isPrivateTour && activity.privateTourPrice)
      return activity.privateTourPrice;
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

    fbEvent("InitiateCheckout", {
      content_name: activity.title,
      content_ids: [activity.id],
      content_type: "activity",
      value: totalPrice,
      currency: "EUR",
      num_adults: adults,
      num_children: children,
      is_private: isPrivateTour,
      travel_date: selectedDate,
      departure_hour: selectedDepartureHour,
      location: activity.location,
    });
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setSelectedDepartureHour(undefined);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{t("bookExperience")}</span>
          <Badge variant="secondary" className="text-lg font-bold">
            {t("fromEuro")}
            {isPrivateTour && activity.privateTourPrice
              ? activity.privateTourPrice
              : activity.adultPrice}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {activity.privateTourPrice ? (
          <div className="border rounded-lg p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex items-center gap-3">
                <Crown className="w-5 h-5 text-amber-600" />
                <div>
                  <h3 className="font-semibold text-amber-900">
                    {t("privateTourExperience")}
                  </h3>
                  <p className="text-sm text-amber-700">
                    {t("privateTourDescription", {
                      price: activity.privateTourPrice,
                    })}
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
                {isPrivateTour ? t("selected") : t("select")}
              </Button>
            </div>
          </div>
        ) : null}

        <div className="w-full mt-6 flex justify-center">
          <div className="w-full max-w-md p-5 bg-white rounded-xl shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-primary" />
              {t("selectYourDate")}
            </h3>
            <CustomCalendar
              selectedDate={selectedDate}
              onDateChange={handleDateChange}
              isDateAvailable={isDateAvailable}
            />
          </div>
        </div>

        {/* Departure Hours Selection */}
        {selectedDate && activity.departureHours?.length > 0 && (
          <div>
            <h3 className="font-semibold text-lg flex items-center gap-3 text-gray-800 mb-4">
              <Clock className="w-5 h-5 text-primary" />
              {t("selectDepartureTime")}
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
                    <div className="text-xs opacity-75">{t("departure")}</div>
                  </div>
                </Button>
              ))}
            </div>
            {selectedDepartureHour && (
              <div className="mt-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <p className="flex gap-4 text-green-800 font-medium">
                  <Clock />
                  {t("departure")}: {selectedDepartureHour}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Guests Section */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Users className="w-4 h-4" />
            {isPrivateTour ? t("groupSize") : t("guests")}
          </h3>

          {/* Private Tour Info */}
          {isPrivateTour && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">
                {t("privateTourPricingInfo")}
              </p>
              <p className="text-sm font-medium text-blue-800 mt-1">
                {t("currentGroupSize", { size: totalGroupSize })}
              </p>
            </div>
          )}

          {/* Adults */}
          <div className="flex sm:items-center justify-between gap-2 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div>
                <p className="font-medium">{t("adults")}</p>
                <p className="text-sm text-gray-500">{t("adultsAge")}</p>
                <p className="text-sm text-gray-500">
                  {isPrivateTour
                    ? t("includedInPrivateTour")
                    : t("perPerson", { price: activity.adultPrice })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
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
          {activity.isForChild && (
            <div className="flex justify-between gap-2 mb-4">
              <div>
                <p className="font-medium">{t("children")}</p>
                <p className="text-sm text-gray-500">{t("childrenAge")}</p>
                <p className="text-sm text-gray-500">
                  {isPrivateTour
                    ? t("includedInPrivateTour")
                    : t("perChild", { price: activity.childPrice })}
                </p>
              </div>
              <div className="flex items-center gap-2">
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
          )}

          {/* Infants */}
          <div className="flex justify-between gap-2">
            <div>
              <p className="font-medium">{t("infants")}</p>
              <p className="text-sm text-gray-500">{t("infantsAge")}</p>
              <p className="text-sm text-gray-500">{t("perInfant")}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInfants(Math.max(0, infants - 1))}
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

        {/* Book Now Button */}
        <Button
          onClick={handleBooking}
          disabled={!selectedDate || !selectedDepartureHour}
          className="w-full"
        >
          {!selectedDate
            ? t("selectDateFirst")
            : !selectedDepartureHour
              ? t("selectDepartureFirst")
              : t("bookNow")}
        </Button>

        <BookingModal />
      </CardContent>
    </Card>
  );
}

export const generateBookingReference = () => {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
};
