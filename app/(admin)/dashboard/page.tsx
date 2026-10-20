"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  format,
  formatDistanceToNow,
  startOfDay,
  subDays,
} from "date-fns";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  Loader2,
  Mountain,
  Package,
  RefreshCw,
  Ticket,
  TriangleAlert,
  Users,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { getData } from "@/lib/getData";
import { baseUrl } from "@/utils/baseUrl";
import type { PackageBookingWithActivities } from "@/types/packageBookingWithAct";

import {
  Avatar,
  DateBadge,
  StatusBadge,
  Thumb,
  activityImage,
  money,
  statusKind,
} from "./package-bookings/PackageBookingGui";


const BOOKINGS_HREF = "/dashboard/bookings";
const PACKAGE_BOOKINGS_HREF = "/dashboard/package-bookings";


interface Activity {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  difficulty: string;
  duration: string;
  location: string;
  adultPrice: number;
  childPrice?: number;
  privateTourPrice: number;
  imageUrl: string;
  startDate: string;
  endDate: string;
  departureHours: string[];
  createdAt: string;
}

interface ActivityBooking {
  id: string;
  activityId: string;
  activity: Activity;
  date: string;
  adults: number;
  children: number;
  infants: number;
  totalPrice: number;
  bookingRef: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  departureHour: string;
  pickUpLocation: string;
  dropOffLocation: string;
  isPrivate: boolean;
  createdAt: string;
}

/** Activity bookings and package bookings, normalised into one shape. */
type Entry = {
  id: string;
  kind: "activity" | "package";
  ref: string;
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  date: Date | null;
  createdAt: Date;
  total: number;
  status: string;
  guests: number;
  image: string | null;
};

type PopularActivity = {
  id: string;
  title: string;
  image: string | null;
  count: number;
};

const RANGES = [7, 30, 90] as const;
type Range = (typeof RANGES)[number];

const countsAsRevenue = (status: string) => {
  const kind = statusKind(status);
  return kind !== "pending" && kind !== "cancelled";
};

/* ------------------------------ small pieces ------------------------------- */

function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-2xl bg-gray-100 ${className}`} />;
}

function StatCard({
  icon,
  label,
  value,
  hint,
  tone,
  delta,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  hint?: string;
  tone: string;
  delta?: number | null;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone}`}
        >
          {icon}
        </div>

        {delta != null && (
          <span
            className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${delta >= 0
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
              }`}
          >
            {delta >= 0 ? (
              <ArrowUpRight className="h-3 w-3" aria-hidden />
            ) : (
              <ArrowDownRight className="h-3 w-3" aria-hidden />
            )}
            {Math.abs(delta).toFixed(0)}%
          </span>
        )}
      </div>

      <p className="mt-4 text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
        {value}
      </p>
      {hint && <p className="mt-1 truncate text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

function Card({
  title,
  icon,
  action,
  children,
}: {
  title: string;
  icon?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <header className="mb-4 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900">
          {icon}
          {title}
        </h2>
        {action}
      </header>
      {children}
    </section>
  );
}

function ViewAll({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700"
    >
      {label}
      <ArrowRight className="h-3.5 w-3.5" aria-hidden />
    </Link>
  );
}

function KindTag({ kind }: { kind: Entry["kind"] }) {
  return kind === "package" ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-semibold text-violet-700">
      <Package className="h-2.5 w-2.5" aria-hidden />
      Package
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-700">
      <Mountain className="h-2.5 w-2.5" aria-hidden />
      Activity
    </span>
  );
}

function Empty({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-200 bg-gray-50 py-10 text-center text-sm text-gray-500">
      {icon}
      {text}
    </div>
  );
}

/* --------------------------------- component -------------------------------- */

const DashboardHomePage = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [bookings, setBookings] = useState<ActivityBooking[]>([]);
  const [packageBookings, setPackageBookings] = useState<
    PackageBookingWithActivities[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState<Range>(30);

  const fetchData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const [activitiesRes, bookingsRes, packageRes] = await Promise.all([
        getData<{ data: Activity[] }>(`${baseUrl}/api/activity/get-all`),
        getData<{ data: ActivityBooking[] }>(`${baseUrl}/api/booking/get-all`),
        getData<{ data: PackageBookingWithActivities[] }>(
          `${baseUrl}/api/package-booking/get-all`,
        ),
      ]);

      setActivities(activitiesRes.data);
      setBookings(bookingsRes.data);
      setPackageBookings(packageRes.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch dashboard data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  /* ------------------------------ derived data ------------------------------ */

  const entries = useMemo<Entry[]>(() => {
    const fromActivities: Entry[] = bookings.map((b) => ({
      id: `a-${b.id}`,
      kind: "activity",
      ref: b.bookingRef,
      firstName: b.firstName,
      lastName: b.lastName,
      email: b.email,
      title: b.activity.title,
      date: new Date(b.date),
      createdAt: new Date(b.createdAt),
      total: b.totalPrice,
      status: b.status,
      guests: b.adults + b.children + b.infants,
      image: activityImage(b.activity),
    }));

    const fromPackages: Entry[] = packageBookings.map((b) => {
      const main = b.activities.filter((a) => !a.isBonus);
      const list = main.length ? main : b.activities;
      const times = list.map((a) => new Date(a.date).getTime());

      return {
        id: `p-${b.id}`,
        kind: "package",
        ref: b.bookingRef,
        firstName: b.firstName,
        lastName: b.lastName,
        email: b.email,
        title: b.packageName,
        date: times.length ? new Date(Math.min(...times)) : null,
        createdAt: new Date(b.createdAt),
        total: b.totalPrice,
        status: b.status,
        guests: b.adults + b.children + b.infants,
        image: list.length ? activityImage(list[0].activity) : null,
      };
    });

    return [...fromActivities, ...fromPackages];
  }, [bookings, packageBookings]);

  const summary = useMemo(() => {
    const today = startOfDay(new Date()).getTime();

    let activityRevenue = 0;
    let packageRevenue = 0;
    let pending = 0;
    let pendingValue = 0;
    let activityCount = 0;
    let packageCount = 0;

    for (const entry of entries) {
      if (entry.kind === "activity") activityCount += 1;
      else packageCount += 1;

      const kind = statusKind(entry.status);
      if (kind === "cancelled") continue;

      if (kind === "pending") {
        pending += 1;
        pendingValue += entry.total;
        continue;
      }

      if (entry.kind === "activity") activityRevenue += entry.total;
      else packageRevenue += entry.total;
    }

    const upcoming = entries
      .filter(
        (entry) =>
          entry.date !== null &&
          entry.date.getTime() >= today &&
          statusKind(entry.status) !== "cancelled",
      )
      .sort((a, b) => a.date!.getTime() - b.date!.getTime());

    return {
      activityRevenue,
      packageRevenue,
      revenue: activityRevenue + packageRevenue,
      pending,
      pendingValue,
      activityCount,
      packageCount,
      upcoming,
    };
  }, [entries]);

  const recent = useMemo(
    () =>
      [...entries]
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 6),
    [entries],
  );

  const needsAttention = useMemo(
    () =>
      entries
        .filter((entry) => statusKind(entry.status) === "pending")
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()),
    [entries],
  );

  const chart = useMemo(() => {
    const today = startOfDay(new Date());

    const days = Array.from({ length: range }, (_, index) => {
      const date = subDays(today, range - 1 - index);
      return {
        key: format(date, "yyyy-MM-dd"),
        date,
        activity: 0,
        pkg: 0,
      };
    });

    const indexByKey = new Map(days.map((day, index) => [day.key, index]));

    const currentStart = subDays(today, range - 1).getTime();
    const previousStart = subDays(today, range * 2 - 1).getTime();

    let current = 0;
    let previous = 0;

    for (const entry of entries) {
      if (!countsAsRevenue(entry.status)) continue;

      const day = startOfDay(entry.createdAt).getTime();

      if (day >= currentStart) {
        current += entry.total;

        const index = indexByKey.get(format(entry.createdAt, "yyyy-MM-dd"));
        if (index !== undefined) {
          if (entry.kind === "activity") days[index].activity += entry.total;
          else days[index].pkg += entry.total;
        }
      } else if (day >= previousStart) {
        previous += entry.total;
      }
    }

    const max = Math.max(...days.map((day) => day.activity + day.pkg), 1);
    const delta = previous > 0 ? ((current - previous) / previous) * 100 : null;

    return { days, max, current, delta };
  }, [entries, range]);

  const popular = useMemo<PopularActivity[]>(() => {
    const map = new Map<string, PopularActivity>();

    const bump = (
      id: string,
      title: string,
      image: string | null,
    ) => {
      const existing = map.get(id);
      if (existing) {
        existing.count += 1;
        if (!existing.image && image) existing.image = image;
      } else {
        map.set(id, { id, title, image, count: 1 });
      }
    };

    for (const b of bookings) {
      if (statusKind(b.status) === "cancelled") continue;
      bump(b.activityId, b.activity.title, activityImage(b.activity));
    }

    for (const b of packageBookings) {
      if (statusKind(b.status) === "cancelled") continue;
      for (const item of b.activities) {
        bump(item.activityId, item.activityTitle, activityImage(item.activity));
      }
    }

    return [...map.values()].sort((a, b) => b.count - a.count).slice(0, 5);
  }, [bookings, packageBookings]);

  /* --------------------------------- states --------------------------------- */

  if (loading) {
    return (
      <div className="space-y-6 p-6" aria-busy>
        <Skeleton className="h-10 w-72" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-40" />
          ))}
        </div>
        <Skeleton className="h-72" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-10 text-center">
          <TriangleAlert className="h-8 w-8 text-rose-500" aria-hidden />
          <p className="text-sm font-medium text-rose-700">{error}</p>
          <Button variant="outline" onClick={() => void fetchData()}>
            Try again
          </Button>
        </div>
      </div>
    );
  }

  const nextDeparture = summary.upcoming[0]?.date ?? null;
  const maxPopular = Math.max(...popular.map((item) => item.count), 1);

  return (
    <div className="min-h-screen space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Dashboard overview
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {format(new Date(), "EEEE, d MMMM yyyy")}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => void fetchData(true)}
          disabled={refreshing}
        >
          {refreshing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<Wallet className="h-5 w-5" aria-hidden />}
          label="Revenue"
          value={money(summary.revenue)}
          hint={`${money(summary.activityRevenue)} activities · ${money(summary.packageRevenue)} packages`}
          tone="bg-emerald-50 text-emerald-600"
          delta={chart.delta}
        />
        <StatCard
          icon={<Ticket className="h-5 w-5" aria-hidden />}
          label="Bookings"
          value={String(entries.length)}
          hint={`${summary.activityCount} activities · ${summary.packageCount} packages`}
          tone="bg-indigo-50 text-indigo-600"
        />
        <StatCard
          icon={<Clock className="h-5 w-5" aria-hidden />}
          label="Pending"
          value={String(summary.pending)}
          hint={`${money(summary.pendingValue)} awaiting`}
          tone="bg-amber-50 text-amber-600"
        />
        <StatCard
          icon={<CalendarDays className="h-5 w-5" aria-hidden />}
          label="Upcoming"
          value={String(summary.upcoming.length)}
          hint={
            nextDeparture
              ? `Next departure ${format(nextDeparture, "d MMM")}`
              : "No upcoming departures"
          }
          tone="bg-sky-50 text-sky-600"
        />
      </div>

      {/* Revenue chart */}
      <Card
        title="Revenue"
        icon={<Wallet className="h-4 w-4 text-gray-400" aria-hidden />}
        action={
          <div className="inline-flex rounded-full border border-gray-200 bg-gray-50 p-0.5">
            {RANGES.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRange(value)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${range === value
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                {value}d
              </button>
            ))}
          </div>
        }
      >
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-3xl font-bold tracking-tight text-gray-900">
              {money(chart.current)}
            </p>
            <p className="text-xs text-gray-500">
              Last {range} days, by booking date
              {chart.delta !== null &&
                ` · ${chart.delta >= 0 ? "+" : ""}${chart.delta.toFixed(0)}% vs previous ${range} days`}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-600">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-indigo-500" />
              Activities
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-fuchsia-400" />
              Packages
            </span>
          </div>
        </div>

        <div
          className="flex h-48 items-end gap-[3px]"
          role="img"
          aria-label={`Revenue per day for the last ${range} days`}
        >
          {chart.days.map((day) => {
            const total = day.activity + day.pkg;

            return (
              <div
                key={day.key}
                className="group relative flex h-full flex-1 flex-col justify-end"
                title={`${format(day.date, "d MMM")}: ${money(total)}`}
              >
                <div
                  className="flex w-full flex-col justify-end overflow-hidden rounded-t-sm transition-opacity group-hover:opacity-80"
                  style={{ height: `${(total / chart.max) * 100}%` }}
                >
                  <div
                    className="w-full bg-fuchsia-400"
                    style={{
                      height: total ? `${(day.pkg / total) * 100}%` : 0,
                    }}
                  />
                  <div
                    className="w-full bg-indigo-500"
                    style={{
                      height: total ? `${(day.activity / total) * 100}%` : 0,
                    }}
                  />
                </div>

                {total === 0 && (
                  <div className="h-px w-full bg-gray-200" aria-hidden />
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-2 flex justify-between text-[11px] text-gray-400">
          <span>{format(chart.days[0].date, "d MMM")}</span>
          <span>
            {format(chart.days[Math.floor(chart.days.length / 2)].date, "d MMM")}
          </span>
          <span>{format(chart.days[chart.days.length - 1].date, "d MMM")}</span>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Needs attention */}
        <Card
          title="Needs attention"
          icon={<TriangleAlert className="h-4 w-4 text-amber-500" aria-hidden />}
          action={
            <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
              {needsAttention.length} pending
            </span>
          }
        >
          {needsAttention.length ? (
            <ul className="space-y-2">
              {needsAttention.slice(0, 5).map((entry) => (
                <li
                  key={entry.id}
                  className="flex items-center gap-3 rounded-xl border border-amber-100 bg-amber-50/40 p-3"
                >
                  <Avatar booking={entry} className="h-10 w-10 text-xs" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium capitalize text-gray-900">
                      {entry.firstName} {entry.lastName}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {entry.title} ·{" "}
                      {formatDistanceToNow(entry.createdAt, { addSuffix: true })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {money(entry.total)}
                    </p>
                    <KindTag kind={entry.kind} />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <Empty
              icon={<CheckCircle2 className="h-6 w-6 text-emerald-400" aria-hidden />}
              text="All caught up. Nothing is pending."
            />
          )}

          {needsAttention.length > 5 && (
            <p className="mt-3 text-center text-xs text-gray-500">
              +{needsAttention.length - 5} more pending
            </p>
          )}
        </Card>

        {/* Upcoming departures */}
        <Card
          title="Upcoming departures"
          icon={<CalendarDays className="h-4 w-4 text-gray-400" aria-hidden />}
        >
          {summary.upcoming.length ? (
            <ul className="space-y-2">
              {summary.upcoming.slice(0, 5).map((entry) => (
                <li
                  key={entry.id}
                  className="flex items-center gap-3 rounded-xl border border-gray-100 p-3"
                >
                  {entry.date && <DateBadge date={entry.date} />}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {entry.title}
                    </p>
                    <p className="truncate text-xs capitalize text-gray-500">
                      {entry.firstName} {entry.lastName}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600">
                      <Users className="h-3.5 w-3.5" aria-hidden />
                      {entry.guests}
                    </span>
                    <KindTag kind={entry.kind} />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <Empty
              icon={<CalendarDays className="h-6 w-6 text-gray-300" aria-hidden />}
              text="No upcoming departures."
            />
          )}
        </Card>

        {/* Recent bookings */}
        <Card
          title="Recent bookings"
          icon={<Ticket className="h-4 w-4 text-gray-400" aria-hidden />}
          action={
            <div className="flex items-center gap-3">
              <ViewAll href={BOOKINGS_HREF} label="Activities" />
              <ViewAll href={PACKAGE_BOOKINGS_HREF} label="Packages" />
            </div>
          }
        >
          {recent.length ? (
            <ul className="divide-y divide-gray-100">
              {recent.map((entry) => (
                <li key={entry.id} className="flex items-center gap-3 py-3">
                  <Avatar booking={entry} className="h-10 w-10 text-xs" />

                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 text-sm font-medium text-gray-900">
                      <span className="truncate capitalize">
                        {entry.firstName} {entry.lastName}
                      </span>
                      <KindTag kind={entry.kind} />
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      <span className="font-mono">{entry.ref}</span> ·{" "}
                      {entry.title}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {money(entry.total)}
                    </p>
                    <StatusBadge status={entry.status} />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <Empty
              icon={<Ticket className="h-6 w-6 text-gray-300" aria-hidden />}
              text="No bookings yet."
            />
          )}
        </Card>

        {/* Popular activities */}
        <Card
          title="Popular activities"
          icon={<Mountain className="h-4 w-4 text-gray-400" aria-hidden />}
          action={
            <span className="text-xs text-gray-500">
              {activities.length} {activities.length === 1 ? "activity" : "activities"} live
            </span>
          }
        >
          {popular.length ? (
            <ul className="space-y-4">
              {popular.map((item, index) => (
                <li key={item.id} className="group flex items-center gap-3">
                  <span className="w-4 shrink-0 text-center text-xs font-bold text-gray-400">
                    {index + 1}
                  </span>

                  <Thumb src={item.image} alt={item.title} className="h-12 w-12" />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {item.title}
                      </p>
                      <span className="shrink-0 text-xs font-semibold text-gray-600">
                        {item.count} {item.count === 1 ? "booking" : "bookings"}
                      </span>
                    </div>

                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 transition-all duration-700"
                        style={{ width: `${(item.count / maxPopular) * 100}%` }}
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <Empty
              icon={<Mountain className="h-6 w-6 text-gray-300" aria-hidden />}
              text="No bookings to rank yet."
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default DashboardHomePage;