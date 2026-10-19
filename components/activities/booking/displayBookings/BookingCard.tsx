import type { Booking, Activity } from "@prisma/client";
import { ArrowDownToLine, ArrowUpFromLine, CalendarDays, Clock, MapPin, Tag } from "lucide-react";
import { BookingShell, ContactTiles, InfoTile, ParticipantsTile } from "./BookingShared";



type BookingWithActivity = Booking & {
  activity: Activity | null;
};

interface BookingCardProps {
  booking: BookingWithActivity;
}

const NO_PICKUP = "I don't need pick up";
const NO_DROPOFF = "I don't need drop off";

const BookingCard = ({ booking }: BookingCardProps) => {
  const activity = booking.activity;
  const hasPickUp = booking.pickUpLocation !== NO_PICKUP;
  const hasDropOff = booking.dropOffLocation !== NO_DROPOFF;

  return (
    <BookingShell
      imageUrl={activity?.imageUrl || "/placeholder.svg"}
      imageAlt={activity?.title || "Activity"}
      status={booking.status}
      title={activity?.title || "Activity"}
      subtitle={activity?.shortDescription}
      bookingRef={booking.bookingRef}
      totalLabel="Total Price"
      total={booking.totalPrice}
      totalExtra={
        booking.isPrivate ? (
          <span className="mt-1 inline-block rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-200">
            Private Tour
          </span>
        ) : null
      }
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <InfoTile icon={<CalendarDays className="h-4 w-4" />} label="Date">
          {new Date(booking.date).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </InfoTile>

        <InfoTile icon={<Clock className="h-4 w-4" />} label="Departure Time">
          {booking.departureHour}
        </InfoTile>

        {activity?.location && (
          <InfoTile icon={<MapPin className="h-4 w-4" />} label="Location">
            {activity.location}
          </InfoTile>
        )}

        <ParticipantsTile
          adults={booking.adults}
          children={booking.children}
          infants={booking.infants}
        />
      </div>

      <ContactTiles email={booking.email} phone={booking.phone} />

      {(hasPickUp || hasDropOff) && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {hasPickUp && (
            <InfoTile
              icon={<ArrowUpFromLine className="h-4 w-4" />}
              label="Pick-up"
            >
              {booking.pickUpLocation}
            </InfoTile>
          )}
          {hasDropOff && (
            <InfoTile
              icon={<ArrowDownToLine className="h-4 w-4" />}
              label="Drop-off"
            >
              {booking.dropOffLocation}
            </InfoTile>
          )}
        </div>
      )}

      {activity?.tags && activity.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <Tag className="h-4 w-4 text-stone-400" />
          {activity.tags.map((tag, index) => (
            <span
              key={`${tag}-${index}`}
              className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-800 ring-1 ring-inset ring-amber-200"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </BookingShell>
  );
};

export default BookingCard;