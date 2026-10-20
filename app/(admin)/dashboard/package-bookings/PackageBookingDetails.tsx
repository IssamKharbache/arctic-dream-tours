"use client";

import type { ReactNode } from "react";
import { format } from "date-fns";
import {
    CalendarDays,
    Clock,
    CreditCard,
    Gift,
    Mail,
    MapPin,
    Phone,
    Sparkles,
    Users,
} from "lucide-react";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import BookingStatusSwitcher from "@/components/activities/booking/BookingStatusSwitcher";
import { activityImage, Avatar, Booking, BookingActivity, DateBadge, formatTrip, fullName, guestsTotal, money, StatusBadge, Thumb, toDate, tripRange } from "./PackageBookingGui";

type Props = {
    booking: Booking | null;
    onClose: () => void;
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

function ActivityRow({
    item,
    booking,
}: {
    item: BookingActivity;
    booking: Booking;
}) {
    const date = toDate(item.date);

    return (
        <li
            className={`group flex items-center gap-3 rounded-2xl border p-3 transition-all hover:-translate-y-0.5 hover:shadow-md ${item.isBonus
                    ? "border-emerald-100 bg-gradient-to-r from-emerald-50/80 to-white"
                    : "border-gray-100 bg-white hover:border-indigo-200"
                }`}
        >
            <Thumb
                src={activityImage(item.activity)}
                alt={item.activityTitle}
                className="h-16 w-16"
            />

            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-gray-900">
                    {item.activityTitle}
                </p>

                <p
                    className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${item.isBonus
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-indigo-50 text-indigo-700"
                        }`}
                >
                    <Clock className="h-3 w-3" aria-hidden />
                    {item.departureHour}
                </p>

                {!item.isBonus && (
                    <p className="mt-1 text-xs text-gray-500">
                        Adult {money(item.adultPrice)}
                        {item.childPrice != null && booking.children > 0
                            ? ` · Child ${money(item.childPrice)}`
                            : ""}
                    </p>
                )}
            </div>

            <div className="flex shrink-0 flex-col items-end gap-2">
                <DateBadge date={date} />
                {item.isBonus ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                        <Gift className="h-3 w-3" aria-hidden />
                        {item.totalPrice > 0 ? money(item.totalPrice) : "Free"}
                    </span>
                ) : (
                    <span className="text-sm font-semibold text-gray-900">
                        {money(item.totalPrice)}
                    </span>
                )}
            </div>
        </li>
    );
}

function Body({ booking }: { booking: Booking }) {
    const sorted = [...booking.activities].sort(
        (a, b) => toDate(a.date).getTime() - toDate(b.date).getTime(),
    );
    const regular = sorted.filter((a) => !a.isBonus);
    const bonus = sorted.filter((a) => a.isBonus);

    const phoneHref = booking.phone.replace(/[^\d+]/g, "");

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
                    {booking.packageName}
                </h3>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-white/80">
                    <CalendarDays className="h-4 w-4" aria-hidden />
                    {formatTrip(tripRange(booking))}
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
                    <BookingStatusSwitcher
                        bookingId={booking.id}
                        currentStatus={booking.status}
                    />
                </div>

                {/* Customer */}
                <Section
                    icon={<Users className="h-3.5 w-3.5" aria-hidden />}
                    title="Customer"
                >
                    <div className="flex items-start gap-4 rounded-2xl bg-gray-50 p-4 ring-1 ring-gray-100">
                        <Avatar booking={booking} className="h-12 w-12 text-sm" />

                        <div className="min-w-0 space-y-1.5 text-sm">
                            <p className="truncate font-semibold text-gray-900">
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

                            <p className="flex items-start gap-2 text-gray-600">
                                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                                <span>Pick-up: {booking.pickUpLocation}</span>
                            </p>

                            <p className="flex items-start gap-2 text-gray-600">
                                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                                <span>Drop-off: {booking.dropOffLocation}</span>
                            </p>
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

                {/* Activities */}
                <Section
                    icon={<Sparkles className="h-3.5 w-3.5" aria-hidden />}
                    title={`Activities (${regular.length})`}
                >
                    {regular.length ? (
                        <ul className="space-y-3">
                            {regular.map((item) => (
                                <ActivityRow key={item.id} item={item} booking={booking} />
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500">No activities.</p>
                    )}
                </Section>

                {bonus.length > 0 && (
                    <Section
                        icon={<Gift className="h-3.5 w-3.5" aria-hidden />}
                        title={`Bonus activities (${bonus.length})`}
                    >
                        <ul className="space-y-3">
                            {bonus.map((item) => (
                                <ActivityRow key={item.id} item={item} booking={booking} />
                            ))}
                        </ul>
                    </Section>
                )}

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
                            {booking.stripeSessionId && (
                                <div className="flex justify-between gap-4">
                                    <dt>Stripe session</dt>
                                    <dd className="truncate font-mono text-gray-300">
                                        {booking.stripeSessionId.slice(0, 18)}…
                                    </dd>
                                </div>
                            )}
                            <div className="flex justify-between gap-4">
                                <dt>Created</dt>
                                <dd className="text-gray-300">
                                    {format(toDate(booking.createdAt), "dd MMM yyyy, HH:mm")}
                                </dd>
                            </div>
                            <div className="flex justify-between gap-4">
                                <dt>Last updated</dt>
                                <dd className="text-gray-300">
                                    {format(toDate(booking.updatedAt), "dd MMM yyyy, HH:mm")}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </Section>
            </div>
        </div>
    );
}

export default function PackageBookingDetails({ booking, onClose }: Props) {
    return (
        <Sheet open={booking !== null} onOpenChange={(open) => !open && onClose()}>
            <SheetContent
                side="right"
                className="flex w-full flex-col gap-0 p-0 sm:max-w-xl"
            >
                <SheetHeader className="sr-only">
                    <SheetTitle>{booking?.packageName ?? "Booking details"}</SheetTitle>
                    <SheetDescription>
                        Full details for booking {booking?.bookingRef}
                    </SheetDescription>
                </SheetHeader>

                {booking && <Body booking={booking} />}
            </SheetContent>
        </Sheet>
    );
}