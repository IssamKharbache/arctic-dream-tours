"use client";

import {
  type ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDeleleActionButtonStore } from "@/store/zustand/deleteActionButtonStore";
import {
  Filter,
  Loader2,
  RefreshCw,
  User,
  Calendar,
  DollarSign,
  Users,
  Eye,
  MapPin,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookingWithActivity } from "@/types/activityWithBooking";
import { format } from "date-fns";
import { FaEuroSign } from "react-icons/fa";
import BookingDetailsDialog from "@/components/activities/booking/BookingDetailsDialog";

interface DataTableProps<TValue> {
  columns: ColumnDef<BookingWithActivity, TValue>[];
  data: BookingWithActivity[];
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function DataTable<TValue>({
  columns,
  data,
  onRefresh,
  isRefreshing = false,
}: DataTableProps<TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
  });

  const { isLoading } = useDeleleActionButtonStore();

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-5">
        <div className="flex relative max-w-sm">
          <Input
            placeholder="Filter by booking ref"
            value={
              (table.getColumn("bookingRef")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("bookingRef")?.setFilterValue(event.target.value)
            }
            className="pl-8 pr-4 py-1 placeholder:text-xs md:placeholder:text-[14px]"
          />
          <Filter
            size={15}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>
      </div>

      <div className="rounded-lg border border-border/50 bg-card shadow-sm hidden md:block">
        {isLoading || isRefreshing ? (
          <div className="flex items-center justify-center p-10">
            <Loader2 className="animate-spin h-6 w-6" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="border-b border-border/50 bg-muted/30 hover:bg-muted/50"
                >
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="h-24 px-4 text-left align-middle font-semibold text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.original.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="transition-colors hover:bg-muted/30 data-[state=selected]:bg-muted/50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="px-4 py-3 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-32 text-center"
                  >
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="rounded-full bg-muted p-3">
                        <svg
                          className="h-6 w-6 text-muted-foreground"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">
                          No bookings found
                        </p>
                        <p className="text-xs text-muted-foreground">
                          There are no booking records to display.
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Mobile responsive view */}
      <div className="md:hidden space-y-4">
        {isLoading || isRefreshing ? (
          <div className="flex items-center justify-center p-10">
            <Loader2 className="animate-spin h-6 w-6" />
          </div>
        ) : table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => {
            const booking = row.original;
            const totalParticipants =
              booking.adults + booking.children + booking.infants;
            const formattedDate = format(new Date(booking.date), "dd MMM yyyy");

            // Create a state for each booking's dialog
            const [open, setOpen] = useState(false);

            return (
              <div
                key={booking.id}
                className="rounded-lg border border-border/50 bg-card p-4 shadow-sm"
              >
                {/* Header with booking ref and status */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {booking.activity.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Ref: {booking.bookingRef}
                    </p>
                  </div>
                  <div className="text-right">
                    {row.getVisibleCells().map((cell) => {
                      if (cell.column.id === "status") {
                        return (
                          <div key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </div>
                        );
                      }
                      return null;
                    })}
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(booking.createdAt), "dd MMM yyyy")}
                    </p>
                  </div>
                </div>

                {/* Client information */}
                <div className="mb-3 p-2 bg-muted/30 rounded-md">
                  <div className="flex items-center gap-2 text-sm font-medium mb-1">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="capitalize">
                      {booking.firstName} {booking.lastName}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span>{booking.email}</span>
                    <span>•</span>
                    <span>{booking.phone}</span>
                  </div>
                </div>

                {/* Date and time */}
                <div className="flex items-center gap-2 text-sm mb-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {formattedDate} at {booking.departureHour}
                  </span>
                </div>

                {/* Participants breakdown */}
                <div className="mb-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {totalParticipants} participants
                    </span>
                    {booking.isPrivate && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        Private tour
                      </span>
                    )}
                  </div>
                  <div className="flex gap-4 text-xs text-muted-foreground mt-1 pl-6">
                    {booking.adults > 0 && (
                      <span>{booking.adults} Adult(s)</span>
                    )}
                    {booking.children > 0 && (
                      <span>{booking.children} Child(ren)</span>
                    )}
                    {booking.infants > 0 && (
                      <span>{booking.infants} Infant(s)</span>
                    )}
                  </div>
                </div>

                {/* Pricing information */}
                <div className="flex items-center gap-2 text-sm mb-2">
                  <FaEuroSign className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    €{booking.totalPrice.toFixed(2)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    (€{booking.activity.adultPrice}/adult, €
                    {booking.activity.childPrice}/child)
                  </span>
                </div>

                {/* Pickup/Dropoff information */}
                {booking.pickUpLocation && (
                  <div className="text-sm mb-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <span className="font-medium">Pickup:</span>{" "}
                        {booking.pickUpLocation}
                      </div>
                    </div>
                  </div>
                )}

                {booking.dropOffLocation &&
                  booking.dropOffLocation !== "I don't need drop off" && (
                    <div className="text-sm mb-2">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <span className="font-medium">Dropoff:</span>{" "}
                          {booking.dropOffLocation}
                        </div>
                      </div>
                    </div>
                  )}

                {/* Activity details */}
                <div className="mt-3 pt-3 border-t border-border/30">
                  <h4 className="text-xs font-semibold text-muted-foreground mb-1">
                    Activity Details
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="font-medium">Duration:</span>{" "}
                      {booking.activity.duration}
                    </div>
                    <div>
                      <span className="font-medium">Difficulty:</span>{" "}
                      {booking.activity.difficulty}
                    </div>
                    <div>
                      <span className="font-medium">Location:</span>{" "}
                      {booking.activity.location}
                    </div>
                    <div>
                      <span className="font-medium">Live Guide:</span>{" "}
                      {booking.activity.liveTourGuide ? "Yes" : "No"}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 py-2"
                    onClick={() => setOpen(true)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </button>
                </div>

                {/* Booking Details Dialog */}
                <BookingDetailsDialog
                  booking={booking}
                  open={open}
                  onOpenChange={setOpen}
                />
              </div>
            );
          })
        ) : (
          <div className="rounded-lg border border-border/50 bg-card p-6 text-center">
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="rounded-full bg-muted p-3">
                <svg
                  className="h-6 w-6 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  No bookings found
                </p>
                <p className="text-xs text-muted-foreground">
                  There are no booking records to display.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
