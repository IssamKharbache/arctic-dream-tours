"use client";

import BookingStatusSwitcher from "@/components/activities/booking/BookingStatusSwitcher";
import { BookingWithActivity } from "@/types/activityWithBooking";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const columns: ColumnDef<BookingWithActivity>[] = [
  {
    accessorKey: "activity.title",
    header: "Activity title ",
    cell: ({ row }) => {
      return row.original.activity.title;
    },
  },
  {
    accessorKey: "bookingRef",
    header: "Booking Ref",
  },
  {
    id: "clientName",
    header: "Client",
    cell: ({ row }) => {
      const firstName = row.original.firstName;
      const lastName = row.original.lastName;

      return `${firstName} ${lastName}`;
    },
  },

  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => format(new Date(row.original.date), "dd MMM yyyy"),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <BookingStatusSwitcher
        bookingId={row.original.id}
        currentStatus={row.original.status}
      />
    ),
  },
  {
    accessorKey: "totalPrice",
    header: "Total Price",
    cell: ({ row }) => `$${row.original.totalPrice.toFixed(2)}`,
  },
  {
    accessorKey: "participants",
    header: "Participants",
    cell: ({ row }) => {
      const { adults, children, infants } = row.original;
      return `${adults + children + infants}`;
    },
  },
];
