"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import {
  CalendarDays,
  ChevronRight,
  Clock,
  Loader2,
  Lock,
  RefreshCw,
  Search,
  Ticket,
  Users,
  Wallet,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDeleleActionButtonStore } from "@/store/zustand/deleteActionButtonStore";
import BookingDetailsDialog from "@/components/activities/booking/BookingDetailsDialog";
import { getData } from "@/lib/getData";
import { baseUrl } from "@/utils/baseUrl";
import type { BookingWithActivity } from "@/types/activityWithBooking";

import {
  Avatar,
  StatusBadge,
  Thumb,
  activityImage,
  money,
  statusDotClass,
  statusKind,
  statusLabel,
} from "../package-bookings/PackageBookingGui";
import BookingDetailsSheet from "./BookingDetailsSheet";
import {
  asDate,
  fullName,
  guestsTotal,
  isUpcoming,
  type Booking,
} from "./BookingUi";

interface DataTableProps<TValue> {
  columns: ColumnDef<BookingWithActivity, TValue>[];
  initialData: BookingWithActivity[];
}

type SortKey = "newest" | "departure" | "value";

const PAGE_SIZE = 15;

function StatCard({
  icon,
  label,
  value,
  hint,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  hint?: string;
  tone: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tone}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
          {label}
        </p>
        <p className="truncate text-xl font-bold text-gray-900">{value}</p>
        {hint && <p className="truncate text-xs text-gray-500">{hint}</p>}
      </div>
    </div>
  );
}

function BookingRow({
  booking,
  onOpen,
}: {
  booking: Booking;
  onOpen: () => void;
}) {
  const date = asDate(booking.date);
  const upcoming = isUpcoming(booking);

  return (
    <li>
      <button
        type="button"
        onClick={onOpen}
        className="group flex w-full flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 md:flex-row md:items-center"
      >
        {/* Customer */}
        <div className="flex min-w-0 items-center gap-3 md:w-[26%]">
          <Avatar booking={booking} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold capitalize text-gray-900">
              {fullName(booking)}
            </p>
            <p className="truncate text-xs text-gray-500">{booking.email}</p>
            <p className="mt-0.5 font-mono text-[11px] text-gray-400">
              {booking.bookingRef}
            </p>
          </div>
        </div>

        {/* Activity + date */}
        <div className="flex min-w-0 items-center gap-3 md:w-[34%]">
          <Thumb
            src={activityImage(booking.activity)}
            alt={booking.activity.title}
            className="h-12 w-12"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-gray-900">
              {booking.activity.title}
            </p>
            <p className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-gray-500">
              <CalendarDays className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span>{format(date, "d MMM yyyy")}</span>
              <span aria-hidden>·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" aria-hidden />
                {booking.departureHour}
              </span>
              {upcoming && (
                <span className="rounded-full bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-700">
                  Upcoming
                </span>
              )}
              {booking.isPrivate && (
                <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-1.5 py-0.5 text-[10px] font-semibold text-violet-700">
                  <Lock className="h-2.5 w-2.5" aria-hidden />
                  Private
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Guests */}
        <div className="md:w-[8%]">
          <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600">
            <Users className="h-3.5 w-3.5" aria-hidden />
            {guestsTotal(booking)}
          </span>
        </div>

        {/* Price + status */}
        <div className="flex items-center justify-between gap-4 md:ml-auto md:flex-col md:items-end md:gap-1.5">
          <p className="text-base font-bold text-gray-900">
            {money(booking.totalPrice)}
          </p>
          <StatusBadge status={booking.status} />
        </div>

        <ChevronRight
          className="hidden h-5 w-5 shrink-0 text-gray-300 transition-all group-hover:translate-x-0.5 group-hover:text-indigo-500 md:block"
          aria-hidden
        />
      </button>
    </li>
  );
}

export function DataTable<TValue>({
  columns,
  initialData,
}: DataTableProps<TValue>) {
  const [data, setData] = useState(initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // null on the server + first client render, so the HTML always matches.
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    setLastUpdated(new Date());
  }, []);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sort, setSort] = useState<SortKey>("newest");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [fullOpen, setFullOpen] = useState(false);

  const { isLoading } = useDeleleActionButtonStore();

  // Kept only to reuse the status control (switcher) defined in your columns.
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const refresh = async (silent = false) => {
    if (!silent) setIsRefreshing(true);

    try {
      const res = await getData<{ data: BookingWithActivity[] }>(
        `${baseUrl}/api/booking/get-all`,
      );

      setData(res.data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error refreshing bookings:", error);
    } finally {
      if (!silent) setIsRefreshing(false);
    }
  };

  const stats = useMemo(() => {
    let revenue = 0;
    let pendingValue = 0;
    let pending = 0;
    let upcoming = 0;

    for (const booking of data) {
      const kind = statusKind(booking.status);
      if (kind === "cancelled") continue;

      if (kind === "pending") {
        pending += 1;
        pendingValue += booking.totalPrice;
      } else {
        revenue += booking.totalPrice;
      }

      if (isUpcoming(booking)) upcoming += 1;
    }

    return { revenue, pending, pendingValue, upcoming };
  }, [data]);

  const statusTabs = useMemo(() => {
    const counts = new Map<string, number>();
    for (const booking of data) {
      counts.set(booking.status, (counts.get(booking.status) ?? 0) + 1);
    }
    return [...counts.entries()];
  }, [data]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();

    const filtered = data.filter((booking) => {
      if (statusFilter !== "ALL" && booking.status !== statusFilter) {
        return false;
      }
      if (!q) return true;

      const haystack = [
        booking.bookingRef,
        booking.firstName,
        booking.lastName,
        booking.email,
        booking.phone,
        booking.activity.title,
        booking.pickUpLocation,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });

    return filtered.sort((a, b) => {
      if (sort === "value") return b.totalPrice - a.totalPrice;

      if (sort === "departure") {
        const ua = isUpcoming(a);
        const ub = isUpcoming(b);
        if (ua !== ub) return ua ? -1 : 1;

        const da = asDate(a.date).getTime();
        const db = asDate(b.date).getTime();
        return ua ? da - db : db - da;
      }

      return asDate(b.createdAt).getTime() - asDate(a.createdAt).getTime();
    });
  }, [data, query, statusFilter, sort]);

  const selected = data.find((booking) => booking.id === selectedId) ?? null;

  // Renders the "status" cell from your existing columns for this booking.
  const renderStatusControl = (booking: Booking): ReactNode => {
    const row = table
      .getCoreRowModel()
      .rows.find((item) => item.original.id === booking.id);
    const cell = row?.getVisibleCells().find((c) => c.column.id === "status");

    return cell
      ? flexRender(cell.column.columnDef.cell, cell.getContext())
      : null;
  };

  const changeFilter = (value: string) => {
    setStatusFilter(value);
    setLimit(PAGE_SIZE);
  };

  const loading = isLoading || isRefreshing;

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Bookings</h2>
          <p className="text-sm text-gray-500">
            {data.length} {data.length === 1 ? "booking" : "bookings"}
            {lastUpdated && ` · updated ${format(lastUpdated, "HH:mm")}`}
          </p>
        </div>

        <Button
          onClick={() => void refresh()}
          variant="outline"
          size="sm"
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<Ticket className="h-5 w-5" aria-hidden />}
          label="Bookings"
          value={String(data.length)}
          hint="All time"
          tone="bg-indigo-50 text-indigo-600"
        />
        <StatCard
          icon={<Wallet className="h-5 w-5" aria-hidden />}
          label="Revenue"
          value={money(stats.revenue)}
          hint="Excluding pending & cancelled"
          tone="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          icon={<Clock className="h-5 w-5" aria-hidden />}
          label="Pending"
          value={String(stats.pending)}
          hint={`${money(stats.pendingValue)} awaiting`}
          tone="bg-amber-50 text-amber-600"
        />
        <StatCard
          icon={<CalendarDays className="h-5 w-5" aria-hidden />}
          label="Upcoming"
          value={String(stats.upcoming)}
          hint="Departures, not cancelled"
          tone="bg-sky-50 text-sky-600"
        />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-md">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            aria-hidden
          />
          <Input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setLimit(PAGE_SIZE);
            }}
            placeholder="Search ref, name, email, phone, activity…"
            className="pl-9"
          />
        </div>

        <select
          value={sort}
          onChange={(event) => setSort(event.target.value as SortKey)}
          aria-label="Sort bookings"
          className="h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="newest">Newest first</option>
          <option value="departure">Departure date</option>
          <option value="value">Highest value</option>
        </select>
      </div>

      {/* Status tabs */}
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {[["ALL", data.length] as [string, number], ...statusTabs].map(
          ([status, count]) => {
            const active = statusFilter === status;

            return (
              <button
                key={status}
                type="button"
                onClick={() => changeFilter(status)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${active
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                  }`}
              >
                {status !== "ALL" && (
                  <span
                    className={`h-2 w-2 rounded-full ${statusDotClass(status)}`}
                  />
                )}
                {status === "ALL" ? "All" : statusLabel(status)}
                <span
                  className={`rounded-full px-1.5 text-xs ${active ? "bg-white/20" : "bg-gray-100 text-gray-500"
                    }`}
                >
                  {count}
                </span>
              </button>
            );
          },
        )}
      </div>

      {/* List */}
      {loading ? (
        <ul className="space-y-3" aria-busy>
          {Array.from({ length: 5 }).map((_, index) => (
            <li
              key={index}
              className="h-24 animate-pulse rounded-2xl bg-gray-100"
            />
          ))}
        </ul>
      ) : rows.length ? (
        <>
          <ul className="space-y-3">
            {rows.slice(0, limit).map((booking) => (
              <BookingRow
                key={booking.id}
                booking={booking}
                onOpen={() => setSelectedId(booking.id)}
              />
            ))}
          </ul>

          {rows.length > limit && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => setLimit((value) => value + PAGE_SIZE)}
              >
                Show more ({rows.length - limit} left)
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-16 text-center">
          <Ticket className="h-8 w-8 text-gray-300" aria-hidden />
          <p className="mt-3 text-sm font-medium text-gray-900">
            No bookings found
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Try another search or status filter.
          </p>
        </div>
      )}

      <BookingDetailsSheet
        booking={selected}
        statusControl={selected ? renderStatusControl(selected) : null}
        onOpenFull={() => setFullOpen(true)}
        onClose={() => {
          setSelectedId(null);
          // Status may have changed in the drawer: sync quietly.
          void refresh(true);
        }}
      />

      {selected && (
        <BookingDetailsDialog
          booking={selected}
          open={fullOpen}
          onOpenChange={setFullOpen}
        />
      )}
    </div>
  );
}