"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { baseUrl } from "@/utils/baseUrl";
import { useQuery } from "@tanstack/react-query";
import { useReactToPrint } from "react-to-print";
import {
  Loader2,
  Calendar,
  Users,
  MapPin,
  CreditCard,
  User,
  Phone,
  Mail,
  Clock,
  Home,
  Copy,
  CheckCircle,
  Clock as ClockIcon,
  XCircle,
  AlertCircle,
} from "lucide-react";
import PrintableInvoice from "./PrintableInvoice";
import { useTranslations } from "next-intl";

interface Booking {
  id: string;
  status: string;
  createdAt: string;
  date: string;
  adults: number;
  children: number;
  totalPrice: number;
  bookingRef: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  departureHour: string;
  pickUpLocation: string;
  dropOffLocation: string;
  isPrivate: boolean;
  activity: {
    id: string;
    title: string;
  };
}

interface SuccessBookingRequestProps {
  bookingRef: string;
}

const SuccessBookingRequest = ({ bookingRef }: SuccessBookingRequestProps) => {
  const [copied, setCopied] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("postBooking.bookingSuccess");
  // Fetch booking details
  const { data, isLoading, isError } = useQuery({
    queryKey: ["bookingRequest", bookingRef],
    queryFn: async () => {
      if (!bookingRef) throw new Error("No booking ref");
      const res = await axios.get<{ booking: Booking }>(
        `${baseUrl}/api/booking/get/${bookingRef}`
      );
      return res.data.booking;
    },
    enabled: !!bookingRef,
    retry: (failureCount, error: any) => {
      // Don't retry if it's an authentication error
      if (error.response?.status === 401 || error.response?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
    refetchInterval: 30000, // Refetch every 30 seconds to check for status updates
  });

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Function to get status-specific styles
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "PAID":
        return {
          bgGradient: "from-green-50 to-emerald-100",
          headerBg: "bg-green-500",
          iconBg: "bg-green-100",
          iconColor: "text-green-600",
          statusBg: "bg-green-100",
          statusText: "text-green-800",
          statusBorder: "border-green-200",
          buttonBg: "bg-green-600 hover:bg-green-700",
          accentColor: "text-green-600",
          icon: <CheckCircle className="h-8 w-8" />,
          title: t("statusTitles.paid"),
          message: t("statusMessages.paid"),
        };
      case "PENDING":
        return {
          bgGradient: "from-amber-50 to-orange-100",
          headerBg: "bg-amber-500",
          iconBg: "bg-amber-100",
          iconColor: "text-amber-600",
          statusBg: "bg-amber-100",
          statusText: "text-amber-800",
          statusBorder: "border-amber-200",
          buttonBg: "bg-amber-600 hover:bg-amber-700",
          accentColor: "text-amber-600",
          icon: <ClockIcon className="h-8 w-8" />,
          title: t("statusTitles.pending"),
          message: t("statusMessages.pending"),
        };
      case "CONFIRMED":
        return {
          bgGradient: "from-blue-50 to-indigo-100",
          headerBg: "bg-blue-500",
          iconBg: "bg-blue-100",
          iconColor: "text-blue-600",
          statusBg: "bg-blue-100",
          statusText: "text-blue-800",
          statusBorder: "border-blue-200",
          buttonBg: "bg-blue-600 hover:bg-blue-700",
          accentColor: "text-blue-600",
          icon: <CheckCircle className="h-8 w-8" />,
          title: t("statusTitles.confirmed"),
          message: t("statusMessages.confirmed"),
        };
      case "CANCELLED":
        return {
          bgGradient: "from-red-50 to-rose-100",
          headerBg: "bg-red-500",
          iconBg: "bg-red-100",
          iconColor: "text-red-600",
          statusBg: "bg-red-100",
          statusText: "text-red-800",
          statusBorder: "border-red-200",
          buttonBg: "bg-red-600 hover:bg-red-700",
          accentColor: "text-red-600",
          icon: <XCircle className="h-8 w-8" />,
          title: t("statusTitles.cancelled"),
          message: t("statusMessages.cancelled"),
        };
      default:
        return {
          bgGradient: "from-gray-50 to-slate-100",
          headerBg: "bg-gray-500",
          iconBg: "bg-gray-100",
          iconColor: "text-gray-600",
          statusBg: "bg-gray-100",
          statusText: "text-gray-800",
          statusBorder: "border-gray-200",
          buttonBg: "bg-gray-600 hover:bg-gray-700",
          accentColor: "text-gray-600",
          icon: <AlertCircle className="h-8 w-8" />,
          title: t("statusTitles.default"),
          message: t("statusMessages.default", { status }),
        };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-slate-100 text-slate-800">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-gray-600 mb-4" />
          <h2 className="text-xl font-semibold">{t("loading.title")}</h2>
          <p className="text-slate-600 mt-2">{t("loading.message")}</p>
        </div>
      </div>
    );
  }

  if ((!isLoading && isError) || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-slate-100">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
          <div className="rounded-full bg-red-100 p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            {t("errors.accessDenied")}
          </h2>
          <p className="text-slate-600 mb-6">{t("errors.sessionExpired")}</p>
          <p className="text-sm text-slate-500 mb-6">
            {t("errors.checkEmail")}
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
          >
            {t("buttons.returnToHome")}
          </button>
        </div>
      </div>
    );
  }

  // Get styles based on status
  const statusStyles = getStatusStyles(data.status);

  if (data.status === "CANCELLED") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-rose-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md text-center bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-center mb-4">
            <XCircle className="h-16 w-16 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-red-800 mb-2">
            Booking Cancelled
          </h1>
          <p className="text-red-600 mb-4">{t("errors.cancelledNote")}</p>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
          >
            {t("buttons.returnToHome")}
          </button>
        </div>
      </div>
    );
  }

  // Format date and time
  const formattedDate = new Date(data.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = data.departureHour;

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${statusStyles.bgGradient} py-12 px-4 sm:px-6 lg:px-8`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 mt-24">
          <div
            className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${statusStyles.iconBg} mb-4`}
          >
            <div className={statusStyles.iconColor}>{statusStyles.icon}</div>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            {statusStyles.title}
          </h1>
          <p className="text-slate-600">{statusStyles.message}</p>

          <div
            className={`mt-6 ${statusStyles.statusBg} p-4 rounded-lg max-w-md mx-auto border ${statusStyles.statusBorder}`}
          >
            <p
              className={`text-sm ${statusStyles.statusText} font-medium mb-2`}
            >
              🔒 {t("messages.saveLink")}
            </p>
            <div className="flex items-center">
              <button
                onClick={handleCopyLink}
                className={`flex items-center text-sm bg-white border ${statusStyles.statusBorder} rounded-l-md py-2 px-3 ${statusStyles.statusText} hover:bg-opacity-50`}
              >
                <Copy size={16} className="mr-1" />
                {copied ? t("buttons.copied") : t("buttons.copyLink")}
              </button>
              <div className="flex-1 truncate bg-white border border-l-0 border-slate-300 rounded-r-md py-2 px-3 text-sm text-slate-600">
                {typeof window !== "undefined" ? window.location.href : ""}
              </div>
            </div>
          </div>
        </div>

        {/* Booking Card */}
        <div className={`bg-white rounded-xl shadow-lg overflow-hidden`}>
          {/* Card Header */}
          <div className={`${statusStyles.headerBg} px-6 py-4`}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="mb-4 md:mb-0">
                <h2 className="text-2xl font-bold text-white">
                  {t("titles.bookingDetails")}
                </h2>
                <p className="text-white text-opacity-90">
                  Reference #{data.bookingRef}
                </p>
              </div>
              <div className="border-2 bg-opacity-20 px-4 py-2 rounded-lg">
                <span className={`font-semibold text-white`}>
                  {data.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Booking Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                  <Calendar
                    className={`w-5 h-5 mr-2 ${statusStyles.accentColor}`}
                  />
                  {t("titles.bookingDetails")}
                </h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">{t("labels.activity")}</span>{" "}
                    {data.activity.title}
                  </p>
                  <p>
                    <span className="font-medium">{t("labels.date")}</span>{" "}
                    {formattedDate}
                  </p>
                  <p>
                    <span className="font-medium">{t("labels.time")}</span>{" "}
                    {formattedTime}
                  </p>
                  <p>
                    <span className="font-medium">
                      {t("labels.bookingType")}
                    </span>{" "}
                    {data.isPrivate
                      ? t("messages.privateTour")
                      : t("messages.groupTour")}
                  </p>
                  <div className="flex items-center mt-3">
                    <Users
                      className={`w-5 h-5 mr-2 ${statusStyles.accentColor}`}
                    />
                    <span className="font-medium">
                      {data.adults} Adults, {data.children} Children
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                  <User
                    className={`w-5 h-5 mr-2 ${statusStyles.accentColor}`}
                  />
                  {t("titles.guestInfo")}
                </h3>
                <div className="space-y-2">
                  <p className="capitalize">
                    {data.firstName} {data.lastName}
                  </p>
                  <div className="flex items-center">
                    <Mail
                      className={`w-4 h-4 mr-2 ${statusStyles.accentColor}`}
                    />
                    <span>{data.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone
                      className={`w-4 h-4 mr-2 ${statusStyles.accentColor}`}
                    />
                    <span>{data.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Details */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                <MapPin
                  className={`w-5 h-5 mr-2 ${statusStyles.accentColor}`}
                />
                {t("titles.locationInfo")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-medium text-slate-700 mb-1">
                    {t("labels.pickup")}
                  </h4>
                  <p className="text-slate-600">{data.pickUpLocation}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-medium text-slate-700 mb-1">
                    {t("labels.dropoff")}
                  </h4>
                  <p className="text-slate-600">{data.dropOffLocation}</p>
                </div>
              </div>
            </div>

            {/* Price Summary */}
            <div className="border-t border-slate-200 pt-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                <CreditCard
                  className={`w-5 h-5 mr-2 ${statusStyles.accentColor}`}
                />
                {t("titles.priceSummary")}
              </h3>

              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex justify-between py-2">
                  <span>{t("labels.subtotal")}</span>
                  <span>€{data.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-200">
                  <span>{t("labels.taxes")}</span>
                  <span>€0.00</span>
                </div>
                <div className="flex justify-between pt-3 font-bold text-lg">
                  <span>{t("labels.total")}</span>
                  <span className={statusStyles.accentColor}>
                    €{data.totalPrice.toFixed(2)}
                  </span>
                </div>
                {data.status === "PENDING" && (
                  <p className="text-sm text-slate-500 mt-2">
                    {t("messages.finalPriceNote")}
                  </p>
                )}
              </div>

              <div className="mt-4 flex items-center text-sm text-slate-500">
                <Clock className="w-4 h-4 mr-1" />
                <span>
                  {data.status === "PAID"
                    ? t("labels.bookedOn")
                    : t("labels.requestedOn")}{" "}
                  {new Date(data.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-slate-600 mb-2 md:mb-0">
                {data.status === "PAID"
                  ? t("messages.thankYou")
                  : t("messages.contactSoon")}
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => (window.location.href = "/")}
                  className={`px-4 py-2 ${statusStyles.buttonBg} border border-transparent rounded-lg text-white font-medium transition duration-200 text-sm flex items-center`}
                >
                  <Home size={16} className="mr-1 hidden md:block" />
                  {t("buttons.backToHome")}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            {t("titles.whatsNext")}
          </h3>
          <ul className="space-y-3">
            {data.status === "PAID" ? (
              <>
                <li className="flex items-start">
                  <div
                    className={`rounded-full p-1 mr-3 mt-0.5 ${statusStyles.iconBg}`}
                  >
                    <CheckCircle
                      className={`h-4 w-4 ${statusStyles.iconColor}`}
                    />
                  </div>
                  <span>{t("statusInstructions.paid.emailConfirmation")}</span>
                </li>
                <li className="flex items-start">
                  <div
                    className={`rounded-full p-1 mr-3 mt-0.5 ${statusStyles.iconBg}`}
                  >
                    <CheckCircle
                      className={`h-4 w-4 ${statusStyles.iconColor}`}
                    />
                  </div>
                  <span>{t("statusInstructions.paid.arriveEarly")}</span>
                </li>
                <li className="flex items-start">
                  <div
                    className={`rounded-full p-1 mr-3 mt-0.5 ${statusStyles.iconBg}`}
                  >
                    <CheckCircle
                      className={`h-4 w-4 ${statusStyles.iconColor}`}
                    />
                  </div>
                  <span>
                    {t("statusInstructions.paid.referenceReady", {
                      ref: data.bookingRef,
                    })}
                  </span>
                </li>
              </>
            ) : data.status === "PENDING" ? (
              <>
                <li className="flex items-start">
                  <div
                    className={`rounded-full p-1 mr-3 mt-0.5 ${statusStyles.iconBg}`}
                  >
                    <ClockIcon
                      className={`h-4 w-4 ${statusStyles.iconColor}`}
                    />
                  </div>
                  <span>{t("statusInstructions.pending.reviewRequest")}</span>
                </li>
                <li className="flex items-start">
                  <div
                    className={`rounded-full p-1 mr-3 mt-0.5 ${statusStyles.iconBg}`}
                  >
                    <ClockIcon
                      className={`h-4 w-4 ${statusStyles.iconColor}`}
                    />
                  </div>
                  <span>{t("statusInstructions.pending.bankingDetails")}</span>
                </li>
                <li className="flex items-start">
                  <div
                    className={`rounded-full p-1 mr-3 mt-0.5 ${statusStyles.iconBg}`}
                  >
                    <ClockIcon
                      className={`h-4 w-4 ${statusStyles.iconColor}`}
                    />
                  </div>
                  <span>
                    {t("statusInstructions.pending.contactReference", {
                      ref: data.bookingRef,
                    })}
                  </span>
                </li>
              </>
            ) : (
              <li className="flex items-start">
                <div
                  className={`rounded-full p-1 mr-3 mt-0.5 ${statusStyles.iconBg}`}
                >
                  <AlertCircle
                    className={`h-4 w-4 ${statusStyles.iconColor}`}
                  />
                </div>
                <span>{t("statusInstructions.other")}</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Hidden Printable */}
      <div style={{ display: "none" }}>
        <PrintableInvoice ref={contentRef} data={data} />
      </div>
    </div>
  );
};

export default SuccessBookingRequest;
