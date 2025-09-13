"use client";

import { BookingWithActivity } from "@/types/activityWithBooking";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Calendar, User, DollarSign, Users, MapPin } from "lucide-react";

interface BookingDetailsDialogProps {
  booking: BookingWithActivity;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BookingDetailsDialog({
  booking,
  open,
  onOpenChange,
}: BookingDetailsDialogProps) {
  const totalParticipants = booking.adults + booking.children + booking.infants;

  // Format date safely in UTC to avoid hydration issues
  const formattedDate = format(new Date(booking.date), "dd MMM yyyy");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <div className="flex items-center gap-2">
            <strong>Booking Ref:</strong>
            <span>{booking.bookingRef}</span>
          </div>

          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>
              {booking.firstName} {booking.lastName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <strong>Activity:</strong>
            <span>{booking.activity.title}</span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              {formattedDate} at {booking.departureHour}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>${booking.totalPrice.toFixed(2)}</span>
          </div>

          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>
              {totalParticipants} participants
              {booking.isPrivate && " • Private tour"}
            </span>
          </div>

          {booking.pickUpLocation && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>Pickup: {booking.pickUpLocation}</span>
            </div>
          )}

          {booking.dropOffLocation && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>Dropoff: {booking.dropOffLocation}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <strong>Status:</strong>
            <span>{booking.status}</span>
          </div>

          <div className="flex items-center gap-2">
            <strong>Created At:</strong>
            <span>
              {format(new Date(booking.createdAt), "dd MMM yyyy HH:mm")}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
