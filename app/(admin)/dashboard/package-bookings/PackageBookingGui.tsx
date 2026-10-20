"use client";

import Image from "next/image";
import { format } from "date-fns";
import { Sparkles } from "lucide-react";

import type { PackageBookingWithActivities } from "@/types/packageBookingWithAct";

export type Booking = PackageBookingWithActivities;
export type BookingActivity = Booking["activities"][number];

/* -------------------------------- formatting ------------------------------- */

const eur = new Intl.NumberFormat("en", { style: "currency", currency: "EUR" });

export const money = (value: number) => eur.format(value);

export const guestsTotal = (b: Booking) => b.adults + b.children + b.infants;

export const fullName = (b: Booking) => `${b.firstName} ${b.lastName}`.trim();

export const initials = (b: Booking) =>
    `${b.firstName.charAt(0)}${b.lastName.charAt(0)}`.toUpperCase() || "?";

/* --------------------------------- status ---------------------------------- */

export type StatusKind =
    | "pending"
    | "cancelled"
    | "completed"
    | "confirmed"
    | "other";

// Works with any enum values: matches on keywords, falls back to "other".
export function statusKind(status: string): StatusKind {
    const s = status.toLowerCase();
    if (s.includes("pend")) return "pending";
    if (s.includes("cancel")) return "cancelled";
    if (s.includes("complet") || s.includes("done")) return "completed";
    if (s.includes("confirm") || s.includes("paid") || s.includes("success"))
        return "confirmed";
    return "other";
}

export function statusLabel(status: string) {
    const s = status.replace(/_/g, " ").toLowerCase();
    return s.charAt(0).toUpperCase() + s.slice(1);
}

const STATUS_STYLES: Record<StatusKind, { badge: string; dot: string }> = {
    pending: {
        badge: "bg-amber-50 text-amber-700 ring-amber-200",
        dot: "bg-amber-500",
    },
    cancelled: {
        badge: "bg-rose-50 text-rose-700 ring-rose-200",
        dot: "bg-rose-500",
    },
    completed: {
        badge: "bg-sky-50 text-sky-700 ring-sky-200",
        dot: "bg-sky-500",
    },
    confirmed: {
        badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
        dot: "bg-emerald-500",
    },
    other: {
        badge: "bg-gray-100 text-gray-700 ring-gray-200",
        dot: "bg-gray-400",
    },
};

export function StatusBadge({ status }: { status: string }) {
    const style = STATUS_STYLES[statusKind(status)];

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${style.badge}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
            {statusLabel(status)}
        </span>
    );
}

export function statusDotClass(status: string) {
    return STATUS_STYLES[statusKind(status)].dot;
}

/* ---------------------------------- dates ---------------------------------- */

// Dates can be Date objects (server props) or ISO strings (after refresh).
export const toDate = (value: Date | string) => new Date(value);

export function tripRange(b: Booking) {
    const main = b.activities.filter((a) => !a.isBonus);
    const list = main.length ? main : b.activities;
    if (!list.length) return null;

    const times = list.map((a) => toDate(a.date).getTime());

    return {
        start: new Date(Math.min(...times)),
        end: new Date(Math.max(...times)),
    };
}

export function isUpcoming(b: Booking) {
    const range = tripRange(b);
    if (!range) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return range.end.getTime() >= today.getTime();
}

export function formatTrip(range: ReturnType<typeof tripRange>) {
    if (!range) return "No dates";

    const { start, end } = range;

    if (format(start, "yyyy-MM-dd") === format(end, "yyyy-MM-dd")) {
        return format(start, "d MMM yyyy");
    }

    if (start.getFullYear() === end.getFullYear()) {
        return `${format(start, "d MMM")} → ${format(end, "d MMM yyyy")}`;
    }

    return `${format(start, "d MMM yyyy")} → ${format(end, "d MMM yyyy")}`;
}

/* ---------------------------------- visuals -------------------------------- */

// Read defensively: adjust the key if your Activity model names it differently.
export function activityImage(activity: unknown): string | null {
    const value = (activity as Record<string, unknown> | null)?.imageUrl;
    return typeof value === "string" && value ? value : null;
}

const AVATAR_GRADIENTS = [
    "from-sky-500 to-indigo-600",
    "from-emerald-500 to-teal-600",
    "from-amber-500 to-orange-600",
    "from-fuchsia-500 to-purple-600",
    "from-rose-500 to-pink-600",
    "from-cyan-500 to-blue-600",
];

export function Avatar({
    booking,
    className = "h-11 w-11 text-sm",
}: {
    booking: { firstName: string; lastName: string; email: string };
    className?: string;
}) {
    const seed = [...booking.email].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
    const gradient = AVATAR_GRADIENTS[seed % AVATAR_GRADIENTS.length];

    return (
        <div
            className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-bold text-white shadow-sm ${gradient} ${className}`}
        >
            {`${booking.firstName.charAt(0)}${booking.lastName.charAt(0)}`.toUpperCase() ||
                "?"}
        </div>
    );
}

export function Thumb({
    src,
    alt,
    className = "h-14 w-14",
}: {
    src: string | null;
    alt: string;
    className?: string;
}) {
    return (
        <div
            className={`relative shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-sky-100 to-indigo-100 ring-1 ring-black/5 ${className}`}
        >
            {src ? (
                <Image
                    src={src}
                    alt={alt}
                    fill
                    sizes="80px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center text-sky-400">
                    <Sparkles className="h-5 w-5" aria-hidden />
                </div>
            )}
        </div>
    );
}

export function StackedThumbs({
    activities,
    max = 3,
}: {
    activities: BookingActivity[];
    max?: number;
}) {
    const shown = activities.slice(0, max);
    const extra = activities.length - shown.length;

    if (!activities.length) {
        return <span className="text-xs text-gray-400">No activities</span>;
    }

    return (
        <div className="flex items-center">
            <div className="flex -space-x-3">
                {shown.map((item) => (
                    <div
                        key={item.id}
                        className="relative h-10 w-10 overflow-hidden rounded-full bg-gradient-to-br from-sky-100 to-indigo-100 ring-2 ring-white"
                        title={item.activityTitle}
                    >
                        {activityImage(item.activity) ? (
                            <Image
                                src={activityImage(item.activity) as string}
                                alt={item.activityTitle}
                                fill
                                sizes="40px"
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-sky-400">
                                <Sparkles className="h-4 w-4" aria-hidden />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {extra > 0 && (
                <span className="ml-2 text-xs font-medium text-gray-500">+{extra}</span>
            )}
        </div>
    );
}

export function DateBadge({ date }: { date: Date }) {
    return (
        <div className="flex h-12 w-11 shrink-0 flex-col items-center justify-center rounded-xl bg-gray-900 text-white shadow-sm">
            <span className="text-[10px] font-medium uppercase leading-none tracking-wide text-gray-300">
                {format(date, "MMM")}
            </span>
            <span className="mt-0.5 text-lg font-bold leading-none">
                {format(date, "d")}
            </span>
        </div>
    );
}