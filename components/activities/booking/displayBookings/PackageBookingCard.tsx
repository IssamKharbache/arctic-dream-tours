import type { Prisma } from "@prisma/client";
import { CalendarDays, Clock, Gift, MapPin, Package } from "lucide-react";
import { BookingShell, ContactTiles, ParticipantsTile } from "./BookingShared";



type PackageBookingWithActivities = Prisma.PackageBookingGetPayload<{
  include: {
    activities: {
      include: {
        activity: true;
      };
    };
  };
}>;

interface PackageBookingCardProps {
  booking: PackageBookingWithActivities;
}

const PackageBookingCard = ({ booking }: PackageBookingCardProps) => {
  const activities = booking.activities;
  const firstImage = activities.find((item) => item.activity?.imageUrl)
    ?.activity?.imageUrl;

  return (
    <BookingShell
      imageUrl={firstImage}
      imageAlt={booking.packageName}
      fallbackIcon={<Package className="h-16 w-16" />}
      status={booking.status}
      typeLabel="Package"
      title={booking.packageName}
      subtitle={`${activities.length} activities included`}
      bookingRef={booking.bookingRef}
      totalLabel="Package Total"
      total={booking.totalPrice}
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ParticipantsTile
          adults={booking.adults}
          children={booking.children}
          infants={booking.infants}
        />
      </div>

      <ContactTiles email={booking.email} phone={booking.phone} />

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-500">
          Included Activities
        </h4>

        <ol className="relative space-y-3 border-l-2 border-dashed border-stone-200 pl-5">
          {activities.map((item) => (
            <li key={item.id} className="relative">
              <span className="absolute -left-[27px] top-4 h-3 w-3 rounded-full border-2 border-white bg-amber-500 ring-1 ring-amber-200" />

              <div className="rounded-xl bg-stone-50 p-4 ring-1 ring-inset ring-stone-200/70">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-stone-900">
                        {item.activity?.title ?? "Activity"}
                      </p>

                      {item.isBonus && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                          <Gift className="h-3 w-3" />
                          Free bonus
                        </span>
                      )}
                    </div>

                    {item.activity?.location && (
                      <p className="mt-1.5 flex items-center gap-1.5 text-sm text-stone-500">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        {item.activity.location}
                      </p>
                    )}
                  </div>

                  <p
                    className={
                      item.isBonus
                        ? "shrink-0 text-sm font-semibold text-emerald-600"
                        : "shrink-0 font-semibold text-stone-900"
                    }
                  >
                    {item.isBonus ? "Free" : `€${item.totalPrice.toFixed(2)}`}
                  </p>
                </div>

                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-stone-600">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="h-4 w-4 text-amber-600" />
                    {new Date(item.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-amber-600" />
                    {item.departureHour}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </BookingShell>
  );
};

export default PackageBookingCard;