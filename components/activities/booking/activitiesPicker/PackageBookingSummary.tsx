"use client";

import { useMemo, type ReactNode } from "react";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import {
    Baby,
    Clock,
    Gift,
    Lock,
    Mail,
    MapPin,
    Phone,
    Sparkles,
    User,
    Users,
} from "lucide-react";

import type {
    Activity,
    BonusActivitySelection,
    CustomerDetailsData,
    MembersSelection,
    Picked,
} from "@/types/packagespicker";
import { getActivityTotal } from "@/utils/packagesPickerUtils";

// Change to your Stripe / site currency.
const CURRENCY = "EUR";

const money = (value: number) =>
    new Intl.NumberFormat("en", {
        style: "currency",
        currency: CURRENCY,
        maximumFractionDigits: 2,
    }).format(value);

type PackageBookingSummaryProps = {
    packageTitle?: string;
    activities: Activity[];
    picked: Picked[];
    bonusActivities: BonusActivitySelection[];
    members: MembersSelection;
    customer: Partial<CustomerDetailsData>;
    total: number;
};

/* ----------------------------- small pieces ----------------------------- */

function Thumb({ src, alt }: { src?: string | null; alt: string }) {
    return (
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-sky-100 to-indigo-100 ring-1 ring-black/5 sm:h-20 sm:w-20">
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
                    <Sparkles className="h-6 w-6" aria-hidden />
                </div>
            )}
        </div>
    );
}

function DateBadge({ date }: { date: Date }) {
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

function Chip({
    icon,
    children,
}: {
    icon: ReactNode;
    children: ReactNode;
}) {
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur">
            {icon}
            {children}
        </span>
    );
}

function SectionTitle({
    icon,
    children,
}: {
    icon: ReactNode;
    children: ReactNode;
}) {
    return (
        <h5 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            {icon}
            {children}
        </h5>
    );
}

const reveal = (index: number) => ({ animationDelay: `${index * 80}ms` });

const ENTER =
    "animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-500";

/* -------------------------------- component ------------------------------ */

export default function PackageBookingSummary({
    packageTitle,
    activities,
    picked,
    bonusActivities,
    members,
    customer,
    total,
}: PackageBookingSummaryProps) {
    const paidRows = useMemo(
        () =>
            picked
                .map((pick) => {
                    const activity = activities.find((a) => a.id === pick.id);
                    if (!activity) return null;
                    return {
                        id: pick.id,
                        title: activity.title,
                        imageUrl: activity.imageUrl,
                        location: activity.location,
                        date: pick.date,
                        hour: pick.departureHour,
                        price: getActivityTotal(activity, members),
                    };
                })
                .filter((row): row is NonNullable<typeof row> => row !== null)
                .sort((a, b) => a.date.getTime() - b.date.getTime()),
        [picked, activities, members],
    );

    const bonusRows = useMemo(
        () =>
            bonusActivities
                .map((bonus) => {
                    const activity = activities.find((a) => a.id === bonus.activityId);
                    if (!activity) return null;
                    return {
                        id: bonus.activityId,
                        title: activity.title,
                        imageUrl: activity.imageUrl,
                        location: activity.location,
                        date: bonus.date ? parseISO(bonus.date) : null,
                        hour: bonus.departureHour,
                    };
                })
                .filter((row): row is NonNullable<typeof row> => row !== null),
        [bonusActivities, activities],
    );

    const firstName = customer.firstName?.trim() ?? "";
    const lastName = customer.lastName?.trim() ?? "";
    const fullName = `${firstName} ${lastName}`.trim();
    const initials =
        `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "?";
    const email = customer.email?.trim() ?? "";
    const phone = customer.phone?.trim() ?? "";
    const pickUp = customer.pickUpLocation?.trim() ?? "";
    const dropOff = customer.dropOffLocation?.trim() ?? "";

    const hasCustomer = Boolean(fullName || email || phone);
    const totalActivities = paidRows.length + bonusRows.length;

    return (
        <section
            aria-labelledby="booking-summary-title"
            className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm"
        >
            {/* Hero header */}
            <header
                className={`relative overflow-hidden bg-gradient-to-br from-sky-600 via-indigo-600 to-violet-600 px-5 py-6 text-white sm:px-7 ${ENTER}`}
            >
                <div
                    aria-hidden
                    className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"
                />
                <div
                    aria-hidden
                    className="pointer-events-none absolute -bottom-12 left-1/3 h-32 w-32 rounded-full bg-fuchsia-300/20 blur-2xl"
                />

                <p className="text-xs font-medium uppercase tracking-widest text-white/70">
                    Almost there
                </p>
                <h4
                    id="booking-summary-title"
                    className="mt-1 text-xl font-bold leading-tight sm:text-2xl"
                >
                    {packageTitle ?? "Your booking summary"}
                </h4>
                <p className="mt-1 text-sm text-white/80">
                    {totalActivities} {totalActivities === 1 ? "activity" : "activities"}{" "}
                    ready to book
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                    <Chip icon={<Users className="h-3.5 w-3.5" aria-hidden />}>
                        {members.adults} {members.adults === 1 ? "adult" : "adults"}
                    </Chip>
                    {members.children > 0 && (
                        <Chip icon={<User className="h-3.5 w-3.5" aria-hidden />}>
                            {members.children}{" "}
                            {members.children === 1 ? "child" : "children"}
                        </Chip>
                    )}
                    {members.infants > 0 && (
                        <Chip icon={<Baby className="h-3.5 w-3.5" aria-hidden />}>
                            {members.infants} {members.infants === 1 ? "infant" : "infants"}
                        </Chip>
                    )}
                </div>
            </header>

            <div className="space-y-7 p-5 sm:p-7">
                {/* Customer */}
                {hasCustomer && (
                    <div className={ENTER} style={reveal(1)}>
                        <SectionTitle icon={<User className="h-3.5 w-3.5" aria-hidden />}>
                            Booked by
                        </SectionTitle>

                        <div className="flex items-start gap-4 rounded-2xl bg-gray-50 p-4 ring-1 ring-gray-100">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 text-sm font-bold text-white shadow-sm">
                                {initials}
                            </div>

                            <div className="min-w-0 space-y-1.5 text-sm">
                                {fullName && (
                                    <p className="truncate font-semibold text-gray-900">
                                        {fullName}
                                    </p>
                                )}
                                {email && (
                                    <p className="flex items-center gap-2 text-gray-600">
                                        <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden />
                                        <span className="truncate">{email}</span>
                                    </p>
                                )}
                                {phone && (
                                    <p className="flex items-center gap-2 text-gray-600">
                                        <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden />
                                        <span className="truncate">{phone}</span>
                                    </p>
                                )}
                                {pickUp && (
                                    <p className="flex items-center gap-2 text-gray-600">
                                        <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
                                        <span className="truncate">Pick-up: {pickUp}</span>
                                    </p>
                                )}
                                {dropOff && (
                                    <p className="flex items-center gap-2 text-gray-600">
                                        <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
                                        <span className="truncate">Drop-off: {dropOff}</span>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Chosen activities */}
                <div className={ENTER} style={reveal(2)}>
                    <SectionTitle icon={<Sparkles className="h-3.5 w-3.5" aria-hidden />}>
                        Your activities
                    </SectionTitle>

                    <ul className="space-y-3">
                        {paidRows.map((row, index) => (
                            <li
                                key={row.id}
                                style={reveal(index + 3)}
                                className={`group flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md sm:gap-4 ${ENTER}`}
                            >
                                <Thumb src={row.imageUrl} alt={row.title} />

                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-gray-900 sm:text-base">
                                        {row.title}
                                    </p>

                                    {row.location && (
                                        <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-gray-500">
                                            <MapPin className="h-3 w-3 shrink-0" aria-hidden />
                                            {row.location}
                                        </p>
                                    )}

                                    {row.hour && (
                                        <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                                            <Clock className="h-3 w-3" aria-hidden />
                                            {row.hour}
                                        </p>
                                    )}
                                </div>

                                <div className="flex shrink-0 flex-col items-end gap-2">
                                    <DateBadge date={row.date} />
                                    <span className="text-sm font-semibold text-gray-900">
                                        {money(row.price)}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Bonus activities */}
                {bonusRows.length > 0 && (
                    <div className={ENTER} style={reveal(paidRows.length + 3)}>
                        <SectionTitle icon={<Gift className="h-3.5 w-3.5" aria-hidden />}>
                            Bonus activities
                        </SectionTitle>

                        <ul className="space-y-3">
                            {bonusRows.map((row) => (
                                <li
                                    key={row.id}
                                    className="group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50/80 to-white p-3 transition-all hover:-translate-y-0.5 hover:shadow-md sm:gap-4"
                                >
                                    <Thumb src={row.imageUrl} alt={row.title} />

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-gray-900 sm:text-base">
                                            {row.title}
                                        </p>

                                        {row.location && (
                                            <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-gray-500">
                                                <MapPin className="h-3 w-3 shrink-0" aria-hidden />
                                                {row.location}
                                            </p>
                                        )}

                                        {row.hour && (
                                            <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                                                <Clock className="h-3 w-3" aria-hidden />
                                                {row.hour}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex shrink-0 flex-col items-end gap-2">
                                        {row.date && <DateBadge date={row.date} />}
                                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                                            <Gift className="h-3 w-3" aria-hidden />
                                            Free
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Total */}
                <div
                    className={`rounded-2xl bg-gray-900 p-5 text-white ${ENTER}`}
                    style={reveal(paidRows.length + 4)}
                >
                    <div className="flex items-end justify-between gap-4">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                                Total to pay
                            </p>
                            <p className="mt-1 text-3xl font-bold tracking-tight">
                                {money(total)}
                            </p>
                        </div>

                        <p className="max-w-[10rem] text-right text-xs text-gray-400">
                            Bonus activities are included at no extra cost.
                        </p>
                    </div>

                    <p className="mt-4 flex items-center gap-2 border-t border-white/10 pt-3 text-xs text-gray-400">
                        <Lock className="h-3.5 w-3.5" aria-hidden />
                        Secure payment powered by Stripe
                    </p>
                </div>
            </div>
        </section>
    );
}