"use client";

import React, { useRef, useState } from "react";
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
  Download,
  Home,
  Copy,
  AlertCircle,
  XCircle,
  CheckCircle,
} from "lucide-react";
import PrintableInvoice from "./PrintableInvoice";

interface SuccessfullPaymentProps {
  bookingRef: string;
}

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

const SuccessfullPayment = ({ bookingRef }: SuccessfullPaymentProps) => {
  const [copied, setCopied] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({ contentRef });

  // Fetch booking details using bookingRef
  const { data, isLoading, isError } = useQuery({
    queryKey: ["booking", bookingRef],
    queryFn: async () => {
      if (!bookingRef) throw new Error("No booking reference");

      const res = await axios.get<{ booking: Booking }>(
        `${baseUrl}/api/booking/get/${bookingRef}`
      );
      return res.data.booking;
    },
    enabled: !!bookingRef,
    retry: (failureCount, error: any) => {
      // Don't retry if booking not found
      if (error.response?.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
  });

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
          title: "Payment Successful!",
          message: "Your booking has been confirmed and paid.",
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
          icon: <Clock className="h-8 w-8" />,
          title: "Booking Request Received!",
          message:
            "Thank you for your booking request! Our team will review it and contact you shortly with confirmation and payment details.",
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
          title: "Booking Confirmed!",
          message:
            "Your booking has been confirmed. Please proceed with payment.",
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
          title: "Booking Cancelled",
          message: "This booking has been cancelled.",
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
          title: "Booking Status",
          message: "Your booking status: " + status,
        };
    }
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Handle loading and error states
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 text-slate-800">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-indigo-600 mb-4" />
          <h2 className="text-xl font-semibold">Loading your booking</h2>
          <p className="text-slate-600 mt-2">
            Please wait while we retrieve your details...
          </p>
        </div>
      </div>
    );
  }

  if ((!isLoading && isError) || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
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
            Booking Not Found
          </h2>
          <p className="text-slate-600 mb-6">
            We couldn't find your booking details. This might be because:
          </p>
          <ul className="text-sm text-slate-500 mb-6 text-left space-y-2">
            <li>• The booking reference is incorrect</li>
            <li>• The booking is still being processed</li>
            <li>• The payment is still completing</li>
          </ul>
          <p className="text-sm text-slate-500 mb-6">
            Please check your email for your booking confirmation or contact
            support if you need assistance.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  const statusStyles = getStatusStyles(data.status);

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
        <div className="text-center mb-10  mt-24">
          <div
            className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${statusStyles.iconBg} mb-4`}
          >
            <div className={statusStyles.iconColor}>{statusStyles.icon}</div>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            {statusStyles.title}
          </h1>
          <p className="text-slate-600">{statusStyles.message}</p>

          {data.status === "PAID" ? (
            <div
              className={`mt-6 ${statusStyles.statusBg} p-4 rounded-lg max-w-md mx-auto border ${statusStyles.statusBorder}`}
            >
              <p
                className={`text-sm ${statusStyles.statusText} font-medium mb-2`}
              >
                🔒 Save this link to access your booking later:
              </p>
              <div className="flex items-center">
                <button
                  onClick={handleCopyLink}
                  className={`flex items-center text-sm bg-white border ${statusStyles.statusBorder} rounded-l-md py-2 px-3 ${statusStyles.statusText} hover:bg-opacity-50`}
                >
                  <Copy size={16} className="mr-1" />
                  {copied ? "Copied!" : "Copy Link"}
                </button>
                <div className="flex-1 truncate bg-white border border-l-0 border-blue-300 rounded-r-md py-2 px-3 text-sm text-slate-600">
                  {typeof window !== "undefined" ? window.location.href : ""}
                </div>
              </div>
            </div>
          ) : null}
        </div>
        {data.status === "PAID" ? (
          <>
            {/* Invoice Card */}
            <div
              id="booking-invoice"
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              {/* Invoice Header */}
              <div className="bg-indigo-600 px-6 py-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div className="mb-4 md:mb-0">
                    <h2 className="text-2xl font-bold text-white">
                      Booking Confirmation
                    </h2>
                    <p className="text-indigo-100">
                      Invoice #{data.bookingRef}
                    </p>
                  </div>
                  <div className="bg-white/20 px-4 py-2 rounded-lg">
                    <span className={"font-semibold text-green-300"}>
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
                      <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
                      Booking Details
                    </h3>
                    <div className="space-y-2">
                      <p>
                        <span className="font-medium">Activity:</span>{" "}
                        {data.activity.title}
                      </p>
                      <p>
                        <span className="font-medium">Date:</span>{" "}
                        {formattedDate}
                      </p>
                      <p>
                        <span className="font-medium">Time:</span>{" "}
                        {formattedTime}
                      </p>
                      <p>
                        <span className="font-medium">Booking Type:</span>{" "}
                        {data.isPrivate ? "Private Tour" : "Group Tour"}
                      </p>
                      <div className="flex items-center mt-3">
                        <Users className="w-5 h-5 mr-2 text-indigo-600" />
                        <span className="font-medium">
                          {data.adults} Adults, {data.children} Children
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2 text-indigo-600" />
                      Guest Information
                    </h3>
                    <div className="space-y-2">
                      <p className="capitalize">
                        {data.firstName} {data.lastName}
                      </p>
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-indigo-600" />
                        <span>{data.email}</span>
                      </div>
                      <div className="flex lampelankatu 3 d rovaniemi finlanditems-center">
                        <Phone className="w-4 h-4 mr-2 text-indigo-600" />
                        <span>{data.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location Details */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-indigo-600" />
                    Location Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <h4 className="font-medium text-slate-700 mb-1">
                        Pick-up Location
                      </h4>
                      <p className="text-slate-600">{data.pickUpLocation}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <h4 className="font-medium text-slate-700 mb-1">
                        Drop-off Location
                      </h4>
                      <p className="text-slate-600">{data.dropOffLocation}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="border-t border-slate-200 pt-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-indigo-600" />
                    Payment Summary
                  </h3>

                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex justify-between py-2">
                      <span>Subtotal:</span>
                      <span>€{data.totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-200">
                      <span>Taxes & Fees:</span>
                      <span>€0.00</span>
                    </div>
                    <div className="flex justify-between pt-3 font-bold text-lg">
                      <span>Total:</span>
                      <span className="text-indigo-600">
                        €{data.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center text-sm text-slate-500">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>
                      Booked on {new Date(data.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <p className="text-sm text-slate-600 mb-2 md:mb-0">
                    Thank you for your booking!
                  </p>
                  {data.status === "PAID" ? (
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handlePrint()}
                        className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition duration-200 text-sm flex items-center"
                      >
                        <Download size={16} className="mr-1" />
                        Download Invoice
                      </button>
                      <button
                        onClick={() => (window.location.href = "/")}
                        className="px-4 py-2 bg-indigo-600 border border-transparent rounded-lg text-white font-medium hover:bg-indigo-700 transition duration-200 text-sm flex items-center"
                      >
                        <Home size={16} className="mr-1" />
                        Back to Home
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
      <div style={{ display: "none" }}>
        <PrintableInvoice ref={contentRef} data={data} />
      </div>
    </div>
  );
};

export default SuccessfullPayment;
