import { baseUrl } from "@/utils/baseUrl";
import type { Booking } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  Clock,
  MapPin,
  Users,
  Phone,
  Mail,
  CreditCard,
  Tag,
  Calendar,
  Search,
} from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: PageProps) => {
  const { id } = await params;
  const res = await fetch(`${baseUrl}/api/user/${id}/booking`);
  const data = await res.json();
  const bookings: Booking[] = data?.data || [];

  if (bookings.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 text-slate-800">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Calendar className="w-12 h-12 text-indigo-500" />
            </div>
            <h1 className="text-3xl font-bold mb-4 text-slate-800">
              No Bookings Yet
            </h1>
            <p className="text-slate-600 mb-8 leading-relaxed">
              You haven't made any bookings yet. Start exploring amazing
              activities and create your first booking!
            </p>
          </div>

          <div className="space-y-4">
            <Button
              asChild
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              <Link href="/activities">
                <Search className="w-4 h-4 mr-2" />
                Browse Activities
              </Link>
            </Button>
            <Button
              variant="outline"
              asChild
              className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50 bg-transparent"
            >
              <Link href="/">Return Home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 mt-24">
          <h1 className="text-3xl font-bold mb-2 text-slate-800">
            My Bookings
          </h1>
          <p className="text-slate-600">
            You have {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="space-y-6">
          {bookings.map((booking: any) => (
            <Card
              key={booking.id}
              className="overflow-hidden shadow-lg bg-white/80 backdrop-blur-sm border-white/20"
            >
              <div className="md:flex">
                {/* Activity Image */}
                <div className="md:w-1/3">
                  <div className="relative h-48 md:h-full">
                    <Image
                      src={
                        booking.activity?.imageUrl ||
                        "/placeholder.svg?height=300&width=400" ||
                        "/placeholder.svg"
                      }
                      alt={booking.activity?.title || "Activity"}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge
                        variant={
                          booking.status === "CONFIRMED"
                            ? "default"
                            : booking.status === "PENDING"
                              ? "secondary"
                              : booking.status === "CANCELLED"
                                ? "destructive"
                                : "outline"
                        }
                      >
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="md:w-2/3 p-6">
                  <CardHeader className="p-0 mb-4">
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-xl font-bold text-slate-800">
                        {booking.activity?.title}
                      </CardTitle>
                      <div className="text-right">
                        <p className="text-sm text-slate-500">Booking Ref</p>
                        <p className="font-mono font-semibold text-slate-700">
                          {booking.bookingRef}
                        </p>
                      </div>
                    </div>
                    <p className="text-slate-600">
                      {booking.activity?.shortDescription}
                    </p>
                  </CardHeader>

                  <CardContent className="p-0 space-y-4">
                    {/* Date and Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-slate-500" />
                        <div>
                          <p className="text-sm text-slate-500">Date</p>
                          <p className="font-medium text-slate-700">
                            {new Date(booking.date).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-slate-500" />
                        <div>
                          <p className="text-sm text-slate-500">
                            Departure Time
                          </p>
                          <p className="font-medium text-slate-700">
                            {booking.departureHour}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-slate-500" />
                      <div>
                        <p className="text-sm text-slate-500">Location</p>
                        <p className="font-medium text-slate-700">
                          {booking.activity?.location}
                        </p>
                      </div>
                    </div>

                    {/* Participants */}
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-slate-500" />
                      <div>
                        <p className="text-sm text-slate-500">Participants</p>
                        <div className="flex gap-4 text-slate-700">
                          {booking.adults > 0 && (
                            <span>
                              {booking.adults} Adult
                              {booking.adults !== 1 ? "s" : ""}
                            </span>
                          )}
                          {booking.children > 0 && (
                            <span>
                              {booking.children} Child
                              {booking.children !== 1 ? "ren" : ""}
                            </span>
                          )}
                          {booking.infants > 0 && (
                            <span>
                              {booking.infants} Infant
                              {booking.infants !== 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-slate-500" />
                        <div>
                          <p className="text-sm text-slate-500">Email</p>
                          <p className="font-medium text-slate-700">
                            {booking.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-slate-500" />
                        <div>
                          <p className="text-sm text-slate-500">Phone</p>
                          <p className="font-medium text-slate-700">
                            {booking.phone}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Transportation */}
                    {(booking.pickUpLocation !== "I don't need pick up" ||
                      booking.dropOffLocation !== "I don't need drop off") && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-slate-700">
                          Transportation
                        </p>
                        {booking.pickUpLocation !== "I don't need pick up" && (
                          <p className="text-sm text-slate-600">
                            <span className="font-medium">Pick-up:</span>{" "}
                            {booking.pickUpLocation}
                          </p>
                        )}
                        {booking.dropOffLocation !==
                          "I don't need drop off" && (
                          <p className="text-sm text-slate-600">
                            <span className="font-medium">Drop-off:</span>{" "}
                            {booking.dropOffLocation}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Activity Tags */}
                    {booking.activity?.tags &&
                      booking.activity.tags.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap">
                          <Tag className="h-4 w-4 text-slate-500" />
                          <div className="flex gap-2 flex-wrap">
                            {booking.activity.tags.map(
                              (tag: string, index: number) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs border-indigo-200 text-indigo-700"
                                >
                                  {tag}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {/* Pricing */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-slate-500" />
                        <span className="text-sm text-slate-500">
                          Total Price
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-slate-800">
                          ${booking.totalPrice}
                        </p>
                        {booking.isPrivate && (
                          <Badge variant="secondary" className="text-xs">
                            Private Tour
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;
