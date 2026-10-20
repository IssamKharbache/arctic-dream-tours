"use client";

import type { ReactNode } from "react";
import { format } from "date-fns";
import {
    CalendarDays,
    Clock,
    CreditCard,
    ExternalLink,
    Lock,
    Mail,
    MapPin,
    Mountain,
    Phone,
    Timer,
    User,
    Users,
    Video,
} from "lucide-react";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
    Avatar,
    DateBadge,
    StatusBadge,
    Thumb,
    activityImage,
    money,
} from "../package-bookings/PackageBookingGui";
import {
    NO_DROP_OFF,
    asDate,
    fullName,
    guestsTotal,
    type Booking,
} from "./BookingUi";

type Props = {
    booking: Booking | null;
    /** The status control coming from your existing columns (switcher). */
    statusControl: ReactNode;
    onClose: () => void;
    onOpenFull: () => void;
};

function Section({
    icon,
    title,
    children,
}: {
    icon: ReactNode;
    title: string;
    children: ReactNode;
}) {
    return (
        <section>
            <h4 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                {icon}
                {title}
            </h4>
            {children}
        </section>
    );
}

function Fact({
    icon,
    label,
    value,
}: {
    icon: ReactNode;
    label: string;
    value: ReactNode;
}) {
    return (
        <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 text-xs">
            <span className="text-gray-400">{icon}</span>
            <div className="min-w-0">
                <p className="text-gray-500">{label}</p>
                <p className="truncate font-medium text-gray-900">{value}</p>
            </div>
        </div>
    );
}

function Body({
    booking,
    statusControl,
    onOpenFull,
}: {
    booking: Booking;
    statusControl: ReactNode;
    onOpenFull: () => void;
}) {
    const date = asDate(booking.date);
    const phoneHref = booking.phone.replace(/[^\d+]/g, "");
    const needsDropOff =
        !!booking.dropOffLocation && booking.dropOffLocation !== NO_DROP_OFF;

    return (
        <div className="flex-1 overflow-y-auto">
            {/* Hero */}
            <div className="relative overflow-hidden bg-gradient-to-br from-sky-600 via-indigo-600 to-violet-600 px-6 pb-6 pt-10 text-white">
                <div
                    aria-hidden
                    className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"
                />
                <p className="font-mono text-xs uppercase tracking-widest text-white/70">
                    {booking.bookingRef}
                </p>
                <h3 className="mt-1 text-2xl font-bold leading-tight">
                    {booking.activity.title}
                </h3>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-white/80">
                    <CalendarDays className="h-4 w-4" aria-hidden />
                    {format(date, "EEE, d MMM yyyy")} · {booking.departureHour}
                </p>
            </div>

            <div className="space-y-7 p-6">
                {/* Status */}
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                            Booking status
                        </p>
                        <div className="mt-1.5">
                            <StatusBadge status={booking.status} />
                        </div>
                    </div>
                    <div>{statusControl}</div>
                </div>

                {/* Customer */}
                <Section
                    icon={<User className="h-3.5 w-3.5" aria-hidden />}
                    title="Customer"
                >
                    <div className="flex items-start gap-4 rounded-2xl bg-gray-50 p-4 ring-1 ring-gray-100">
                        <Avatar booking={booking} className="h-12 w-12 text-sm" />

                        <div className="min-w-0 space-y-1.5 text-sm">
                            <p className="truncate font-semibold capitalize text-gray-900">
                                {fullName(booking)}
                            </p>

                            <a
                                href={`mailto:${booking.email}`}
                                className="flex items-center gap-2 text-gray-600 hover:text-indigo-600"
                            >
                                <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden />
                                <span className="truncate">{booking.email}</span>
                            </a>

                            <a
                                href={`tel:${phoneHref}`}
                                className="flex items-center gap-2 text-gray-600 hover:text-indigo-600"
                            >
                                <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden />
                                <span className="truncate">{booking.phone}</span>
                            </a>

                            {booking.pickUpLocation && (
                                <p className="flex items-start gap-2 text-gray-600">
                                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                                    <span>Pick-up: {booking.pickUpLocation}</span>
                                </p>
                            )}

                            {booking.dropOffLocation && (
                                <p className="flex items-start gap-2 text-gray-600">
                                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                                    <span>
                                        {needsDropOff
                                            ? `Drop-off: ${booking.dropOffLocation}`
                                            : "No drop-off needed"}
                                    </span>
                                </p>
                            )}
                        </div>
                    </div>
                </Section>

                {/* Activity */}
                <Section
                    icon={<Mountain className="h-3.5 w-3.5" aria-hidden />}
                    title="Activity"
                >
                    <div className="space-y-3">
                        <div className="group flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3">
                            <Thumb
                                src={activityImage(booking.activity)}
                                alt={booking.activity.title}
                                className="h-16 w-16"
                            />

                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-gray-900">
                                    {booking.activity.title}
                                </p>
                                <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                                    <Clock className="h-3 w-3" aria-hidden />
                                    {booking.departureHour}
                                </p>
                                {booking.isPrivate && (
                                    <p className="ml-1.5 mt-1 inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-700">
                                        <Lock className="h-3 w-3" aria-hidden />
                                        Private tour
                                    </p>
                                )}
                            </div>

                            <DateBadge date={date} />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <Fact
                                icon={<MapPin className="h-4 w-4" aria-hidden />}
                                label="Location"
                                value={booking.activity.location}
                            />
                            <Fact
                                icon={<Timer className="h-4 w-4" aria-hidden />}
                                label="Duration"
                                value={booking.activity.duration}
                            />
                            <Fact
                                icon={<Mountain className="h-4 w-4" aria-hidden />}
                                label="Difficulty"
                                value={booking.activity.difficulty}
                            />
                            <Fact
                                icon={<Video className="h-4 w-4" aria-hidden />}
                                label="Live guide"
                                value={booking.activity.liveTourGuide ? "Yes" : "No"}
                            />
                        </div>
                    </div>
                </Section>

                {/* Guests */}
                <Section
                    icon={<Users className="h-3.5 w-3.5" aria-hidden />}
                    title={`Guests (${guestsTotal(booking)})`}
                >
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { label: "Adults", value: booking.adults },
                            { label: "Children", value: booking.children },
                            { label: "Infants", value: booking.infants },
                        ].map((item) => (
                            <div
                                key={item.label}
                                className="rounded-2xl border border-gray-100 bg-white p-3 text-center"
                            >
                                <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                                <p className="text-xs text-gray-500">{item.label}</p>
                            </div>
                        ))}
                    </div>
                </Section>

                {/* Payment */}
                <Section
                    icon={<CreditCard className="h-3.5 w-3.5" aria-hidden />}
                    title="Payment"
                >
                    <div className="rounded-2xl bg-gray-900 p-5 text-white">
                        <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                            Total
                        </p>
                        <p className="mt-1 text-3xl font-bold tracking-tight">
                            {money(booking.totalPrice)}
                        </p>

                        <dl className="mt-4 space-y-2 border-t border-white/10 pt-4 text-xs text-gray-400">
                            <div className="flex justify-between gap-4">
                                <dt>Adult price</dt>
                                <dd className="text-gray-300">
                                    {money(booking.activity.adultPrice)}
                                </dd>
                            </div>
                            <div className="flex justify-between gap-4">
                                <dt>Child price</dt>
                                <dd className="text-gray-300">
                                    {money(booking.activity.childPrice ?? 0)}
                                </dd>
                            </div>
                            <div className="flex justify-between gap-4">
                                <dt>Booked on</dt>
                                <dd className="text-gray-300">
                                    {format(asDate(booking.createdAt), "dd MMM yyyy, HH:mm")}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </Section>

                <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={onOpenFull}
                >
                    <ExternalLink className="mr-2 h-4 w-4" aria-hidden />
                    Open full booking details
                </Button>
            </div>
        </div>
    );
}

export default function BookingDetailsSheet({
    booking,
    statusControl,
    onClose,
    onOpenFull,
}: Props) {
    return (
        <Sheet open={booking !== null} onOpenChange={(open) => !open && onClose()}>
            <SheetContent
                side="right"
                className="flex w-full flex-col gap-0 p-0 sm:max-w-xl"
            >
                <SheetHeader className="sr-only">
                    <SheetTitle>{booking?.activity.title ?? "Booking details"}</SheetTitle>
                    <SheetDescription>
                        Full details for booking {booking?.bookingRef}
                    </SheetDescription>
                </SheetHeader>

                {booking && (
                    <Body
                        booking={booking}
                        statusControl={statusControl}
                        onOpenFull={onOpenFull}
                    />
                )}
            </SheetContent>
        </Sheet>
    );
}