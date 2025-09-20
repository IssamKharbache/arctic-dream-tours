"use client";

import { BookingWithActivity } from "@/types/activityWithBooking";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import {
  Calendar,
  User,
  Users,
  MapPin,
  Mail,
  Phone,
  Clock,
  Tag,
  Info,
  Shield,
  Baby,
  User as AdultIcon,
  Crown,
} from "lucide-react";
import { FaChild, FaEuroSign } from "react-icons/fa";

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
  const formattedDate = format(new Date(booking.date), "EEEE, dd MMM yyyy");
  const createdDate = format(new Date(booking.createdAt), "dd MMM yyyy HH:mm");

  // Pricing logic
  let adultTotal = 0;
  let childTotal = 0;
  let privateTourTotal = 0;

  if (!booking.isPrivate) {
    adultTotal = booking.adults * booking.activity.adultPrice;
    childTotal =
      (booking.activity.childPrice &&
        booking.children * booking.activity.childPrice) ||
      0;
  } else {
    privateTourTotal = booking.totalPrice;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Booking Details
            </div>
            {booking.isPrivate && (
              <span className="flex items-center gap-2 mt-5 text-white bg-amber-500 px-2  rounded-full text-xs font-semibold py-3">
                <Crown size={15} />
                Private Booking
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 text-sm">
          {/* Booking Ref & Status */}
          <div className="bg-muted p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-xs text-muted-foreground">Booking Ref</div>
                <div className="font-semibold">{booking.bookingRef}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Status</div>
                <div
                  className={`font-semibold ${
                    booking.status === "CONFIRMED"
                      ? "text-green-600"
                      : booking.status === "CANCELLED"
                        ? "text-red-600"
                        : "text-amber-600"
                  }`}
                >
                  {booking.status}
                </div>
              </div>
            </div>
          </div>

          {/* Activity Info */}
          <div>
            <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Activity Information
            </h3>
            <div className="space-y-3 pl-6">
              <div>
                <div className="text-xs text-muted-foreground">Activity</div>
                <div className="font-medium">{booking.activity.title}</div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  {formattedDate} at {booking.departureHour}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Duration: {booking.activity.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>Location: {booking.activity.location}</span>
              </div>
            </div>
          </div>

          {/* Participants & Pricing */}
          <div>
            <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Participants & Pricing
            </h3>
            <div className="space-y-2 pl-6">
              {!booking.isPrivate ? (
                <>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <AdultIcon className="h-4 w-4 text-muted-foreground" />
                      <span>Adults: {booking.adults}</span>
                    </div>
                    <div>€{adultTotal.toFixed(2)}</div>
                  </div>

                  {booking.children > 0 && (
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <FaChild className="h-4 w-4 text-muted-foreground" />
                        <span>Children: {booking.children}</span>
                      </div>
                      <div>€{childTotal && childTotal.toFixed(2)}</div>
                    </div>
                  )}

                  {booking.infants > 0 && (
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <Baby className="h-4 w-4 text-muted-foreground" />
                        <span>Infants: {booking.infants}</span>
                      </div>
                      <div>€0.00</div>
                    </div>
                  )}

                  <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
                    <div>Total Price:</div>
                    <div className="flex items-center gap-1">
                      <FaEuroSign className="h-3 w-3" />
                      <span>{(adultTotal + (childTotal || 0)).toFixed(2)}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex justify-between font-semibold">
                  <div>Private Tour Total:</div>
                  <div className="flex items-center gap-1">
                    <FaEuroSign className="h-3 w-3" />
                    <span>{privateTourTotal.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Transportation */}
          {(booking.pickUpLocation || booking.dropOffLocation) && (
            <div>
              <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Transportation
              </h3>
              <div className="space-y-2 pl-6">
                {booking.pickUpLocation && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Pickup
                      </div>
                      <div>{booking.pickUpLocation}</div>
                    </div>
                  </div>
                )}
                {booking.dropOffLocation && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Dropoff
                      </div>
                      <div>{booking.dropOffLocation}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Client Details */}
          <div>
            <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
              <User className="h-4 w-4" />
              Client Details
            </h3>
            <div className="space-y-3 pl-6">
              <div className="flex items-center gap-2 capitalize">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>
                  {booking.firstName} {booking.lastName}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{booking.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{booking.phone}</span>
              </div>
            </div>
          </div>

          {/* Booking Metadata */}
          <div className="pt-2 border-t text-xs text-muted-foreground">
            Booking created on {createdDate}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
