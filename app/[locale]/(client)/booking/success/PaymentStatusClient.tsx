"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface PaymentStatusPageProps {
  session?: { status: string } | null;
  bookingId: string;
}

const markBookingPaid = async (bookingId: string) => {
  try {
    await fetch("/api/booking/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId }),
    });
    console.log("Booking marked as PAID");
  } catch (err) {
    console.error("Failed to update booking", err);
  }
};

const PaymentStatusPage = ({ session, bookingId }: PaymentStatusPageProps) => {
  if (!session)
    return <StatusCard type="error" message="Invalid stripe session" />;
  if (session.status === "expired")
    return <StatusCard type="error" message="Your session has expired" />;
  if (session.status === "open")
    return (
      <StatusCard
        type="pending"
        message="Your payment is in progress. Please wait..."
      />
    );

  return (
    <StatusCard
      type="success"
      message="Your payment was completed successfully!"
    />
  );
};

export default PaymentStatusPage;

interface StatusCardProps {
  type: "success" | "error" | "pending";
  message: string;
}

const StatusCard = ({ type, message }: StatusCardProps) => {
  let icon, bgColor, textColor;

  switch (type) {
    case "success":
      icon = <CheckCircle className="w-12 h-12 text-green-500" />;
      bgColor = "from-green-600 to-green-700";
      textColor = "text-green-100";
      break;
    case "error":
      icon = <XCircle className="w-12 h-12 text-red-500" />;
      bgColor = "from-red-600 to-red-700";
      textColor = "text-red-100";
      break;
    case "pending":
      icon = <Clock className="w-12 h-12 text-yellow-400" />;
      bgColor = "from-yellow-600 to-yellow-700";
      textColor = "text-yellow-100";
      break;
  }

  return (
    <div className="min-h-screen pt-28 flex items-start justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`relative max-w-md w-full bg-gradient-to-br ${bgColor} p-10 rounded-3xl shadow-2xl border border-white/10 flex flex-col items-center text-center`}
      >
        <div className="mb-6">{icon}</div>
        <h1 className={`text-2xl sm:text-3xl font-bold ${textColor} mb-4`}>
          {type === "success"
            ? "Payment Successful"
            : type === "error"
              ? "Payment Failed"
              : "Payment Pending"}
        </h1>
        <p className={`text-base sm:text-lg ${textColor}`}>{message}</p>
      </motion.div>
    </div>
  );
};
