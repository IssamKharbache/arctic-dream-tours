"use client";

import { useState, useRef, useEffect } from "react";
import { Loader2, Check, Clock, CreditCard, ChevronDown } from "lucide-react";
import { Booking_Status } from "@prisma/client";

interface BookingStatusSwitcherProps {
  bookingId: string;
  currentStatus: Booking_Status;
}

const statusConfig = {
  [Booking_Status.PENDING]: {
    color:
      "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700",
    icon: Clock,
    label: "Pending",
  },
  [Booking_Status.CONFIRMED]: {
    color:
      "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700",
    icon: Check,
    label: "Confirmed",
  },
  [Booking_Status.PAID]: {
    color:
      "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700",
    icon: CreditCard,
    label: "Paid",
  },
  [Booking_Status.CANCELLED]: {
    color:
      "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700",
    icon: CreditCard, // you can pick a better icon like 'X' if you want
    label: "Cancelled",
  },
};

export default function BookingStatusSwitcher({
  bookingId,
  currentStatus,
}: BookingStatusSwitcherProps) {
  const [status, setStatus] = useState<Booking_Status>(currentStatus);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleChange = async (newStatus: Booking_Status) => {
    if (newStatus === status) return;
    setLoading(true);
    setIsOpen(false);

    try {
      const res = await fetch(`/api/booking/update`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update booking");

      const data = await res.json();
      setStatus(data.booking.status);
      setShowSuccess(true);

      setTimeout(() => setShowSuccess(false), 1500);
    } catch (err) {
      console.error(err);
      alert("Failed to update booking status");
    } finally {
      setLoading(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const StatusIcon = statusConfig[status].icon;

  if (loading) {
    return (
      <div className="flex items-center justify-center w-20 h-7">
        <Loader2 className="animate-spin h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="flex items-center justify-center w-20 h-7 bg-green-100 border border-green-300 rounded-md dark:bg-green-900/30 dark:border-green-700">
        <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Status badge - acts as dropdown trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-1 px-2 py-1 rounded-md border text-xs font-medium 
          transition-all hover:scale-105 min-w-[70px] justify-between
          ${statusConfig[status].color}
        `}
      >
        <div className="flex items-center gap-1">
          <StatusIcon className="h-3 w-3" />
          <span>{statusConfig[status].label}</span>
        </div>
        <ChevronDown
          className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Custom Dropdown - NOW OPENING DOWNWARD */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-max z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg overflow-hidden">
          {Object.values(Booking_Status).map((s) => {
            const OptionIcon = statusConfig[s].icon;
            return (
              <button
                key={s}
                onClick={() => handleChange(s)}
                className={`
                  w-full px-3 py-2 text-xs text-left flex items-center gap-2
                  transition-colors hover:bg-gray-100 dark:hover:bg-gray-700
                  ${
                    s === status
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                      : "text-gray-700 dark:text-gray-300"
                  }
                `}
              >
                <OptionIcon className="h-3.5 w-3.5" />
                <span>{statusConfig[s].label}</span>
                {s === status && <Check className="h-3 w-3 ml-auto" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
