
import { baseUrl } from "@/utils/baseUrl";
import { Button } from "@/components/ui/button";
import { Calendar, Search } from "lucide-react";
import { Link } from "@/i18n/navigation";
import BookingCard from "@/components/activities/booking/displayBookings/BookingCard";
import PackageBookingCard from "@/components/activities/booking/displayBookings/PackageBookingCard";

interface PageProps {
  params: Promise<{ id: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;

  const res = await fetch(`${baseUrl}/api/user/${id}/booking`);

  if (!res.ok) {
    throw new Error("Failed to fetch bookings");
  }

  const data = await res.json();

  const bookings = data?.data ?? [];
  const packageBookings = data?.packageBookings ?? [];
  const totalBookings = bookings.length + packageBookings.length;

  if (totalBookings === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 text-slate-800">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-24 h-24 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-lg">
            <Calendar className="w-12 h-12 text-indigo-500" />
          </div>

          <h1 className="text-3xl font-bold mb-4">No Bookings Yet</h1>

          <p className="text-slate-600 mb-8 leading-relaxed">
            You haven't made any bookings yet. Start exploring amazing
            activities and create your first booking!
          </p>

          <div className="space-y-4">
            <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700">
              <Link href="/activities">
                <Search className="w-4 h-4 mr-2" />
                Browse Activities
              </Link>
            </Button>

            <Button
              variant="outline"
              asChild
              className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50"
            >
              <Link href="/">Return Home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 mt-24">
          <h1 className="text-3xl font-bold mb-2 text-slate-800">
            My Bookings
          </h1>
          <p className="text-slate-600">
            You have {totalBookings} booking
            {totalBookings !== 1 ? "s" : ""}
          </p>
        </div>

        {bookings.length > 0 && (
          <section className="space-y-6 mb-10">
            <h2 className="text-xl font-semibold text-slate-800">
              Activity Bookings
            </h2>

            {bookings.map((booking: any) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </section>
        )}

        {packageBookings.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-xl font-semibold text-slate-800">
              Package Bookings
            </h2>

            {packageBookings.map((booking: any) => (
              <PackageBookingCard
                key={booking.id}
                booking={booking}
              />
            ))}
          </section>
        )}
      </div>
    </div>
  );
};

export default Page;
