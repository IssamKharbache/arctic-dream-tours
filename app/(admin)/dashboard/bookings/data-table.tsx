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
} from "lucide-react";
import { Input } from "@/components/ui/input";
import React from "react";
import { Button } from "@/components/ui/button";
import { BookingWithActivity } from "@/types/activityWithBooking";
import { format } from "date-fns";

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
          table.getRowModel().rows.map((row) => (
            <div
              key={row.original.id}
              className="rounded-lg border border-border/50 bg-card p-4 shadow-sm"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg">
                    {row.original.activity.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Ref: {row.original.bookingRef}
                  </p>
                </div>
                <div>
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
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {row.original.firstName} {row.original.lastName}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {format(new Date(row.original.date), "dd MMM yyyy")} at{" "}
                    {row.original.departureHour}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>${row.original.totalPrice.toFixed(2)}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {row.original.adults +
                      row.original.children +
                      row.original.infants}{" "}
                    participants
                    {row.original.isPrivate && " • Private tour"}
                  </span>
                </div>

                {row.original.pickUpLocation && (
                  <div className="text-sm text-muted-foreground">
                    Pickup: {row.original.pickUpLocation}
                  </div>
                )}
              </div>
            </div>
          ))
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
