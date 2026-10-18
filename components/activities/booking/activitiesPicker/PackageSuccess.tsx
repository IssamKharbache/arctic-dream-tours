
"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  Calendar,
  Check,
  CheckCircle,
  Clock,
  Copy,
  CreditCard,
  Home,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Users,
  User,
  XCircle,
} from "lucide-react";

interface Activity {
  id: string;
  title: string;
  date: string;
  departureHour: string;
  isBonus: boolean;
  adultPrice: number;
  childPrice: number | null;
  totalPrice: number;
}

interface PackageBooking {
  bookingRef: string;
  packageName: string;
  customerName: string;
  email: string;
  phone: string;
  adults: number;
  children: number;
  infants: number;
  pickUpLocation: string;
  dropOffLocation: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  activities: Activity[];
}

interface ApiResponse {
  status: "PAID" | "PROCESSING" | "PAYMENT_PENDING";
  booking?: PackageBooking;
  error?: string;
}

interface Props {
  publicToken: string;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
  }).format(price);

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

export default function PackageSuccess({
  publicToken
}: Props) {
  const [booking, setBooking] = useState<PackageBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [pageUrl, setPageUrl] = useState("");

  useEffect(() => {
    setPageUrl(window.location.href);
  }, []);

  const handleCopyLink = async () => {
  try {
    const url = new URL(window.location.href);
    url.searchParams.delete("session_id");

    await navigator.clipboard.writeText(url.toString());

    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  } catch {
    setError("Unable to copy the link. Please copy the URL from your browser.");
  }
};

  useEffect(() => {
    let cancelled = false;

    async function loadBooking() {
      setLoading(true);
      setError(null);

      try {
        for (let attempt = 0; attempt < 15; attempt++) {
          const response = await fetch(
            `/api/package-booking/${encodeURIComponent(
              publicToken,
            )}`,
            { cache: "no-store" },
          );

          const data = (await response.json()) as ApiResponse;

          if (!response.ok) {
            throw new Error(
              data.error || "Unable to load your booking.",
            );
          }

          if (data.status === "PAID" && data.booking) {
            if (!cancelled) {
              setBooking(data.booking);
              setLoading(false);
            }
            return;
          }

          if (attempt < 14) {
            await new Promise((resolve) => window.setTimeout(resolve, 2000));
          }
        }

        if (!cancelled) {
          setError(
            "Your payment may have succeeded, but confirmation is taking longer than expected. Please check your email or contact support@arcticdreamtours.com.",
          );
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong while loading your booking.",
          );
          setLoading(false);
        }
      }
    }

    loadBooking();

    return () => {
      cancelled = true;
    };
  }, [publicToken]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
        <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-lg">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-indigo-600" />

          <h1 className="text-2xl font-semibold text-slate-800">
            Confirming your booking
          </h1>

          <p className="mt-3 text-slate-600">
            Your payment is being verified. Please wait while we retrieve
            your booking details.
          </p>

          <p className="mt-4 text-sm text-slate-500">
            Booking reference: {booking?.bookingRef}
          </p>
        </div>
      </main>
    );
  }

  if (error || !booking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
        <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-lg">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
            <AlertCircle className="h-8 w-8 text-amber-600" />
          </div>

          <h1 className="text-2xl font-bold text-slate-800">
            Booking confirmation pending
          </h1>

          <p className="mt-4 text-slate-600">
            {error || "We couldn't load your booking details."}
          </p>

          <p className="mt-4 text-sm text-slate-500">
            Booking reference: {booking?.bookingRef}
          </p>

          <a
            href="mailto:support@arcticdreamtours.com"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-700"
          >
            <Mail className="h-4 w-4" />
            Contact support
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto mt-16 max-w-4xl">
        {/* Success header */}
        <header className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-9 w-9 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold text-slate-800 sm:text-4xl">
            Payment Successful!
          </h1>

          <p className="mt-3 text-slate-600">
            Your package booking has been confirmed and paid.
          </p>

          <p className="mt-2 text-slate-600">
            Thank you, {booking.customerName}. We look forward to welcoming
            you to Lapland!
          </p>

          {/* Save booking link */}
          <div className="mx-auto mt-6 max-w-2xl rounded-xl border border-green-200 bg-green-50 p-4">
            <p className="mb-3 flex items-center justify-center gap-2 text-sm font-medium text-green-800">
              <CheckCircle className="h-4 w-4" />
              Save this link to access your booking later
            </p>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="min-w-0 flex-1 rounded-lg border border-green-200 bg-white px-3 py-2.5 text-left text-sm text-slate-600">
                <span className="block truncate">
                  {pageUrl || "Loading booking link..."}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-700"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copied ? "Copied!" : "Copy link"}
              </button>
            </div>
          </div>
        </header>

        {/* Booking confirmation card */}
        <div className="overflow-hidden rounded-xl bg-white shadow-lg">
          <div className="bg-indigo-600 px-6 py-5 text-white sm:px-8">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-bold">
                  Booking Confirmation
                </h2>
                <p className="mt-1 text-indigo-100">
                  Reference #{booking.bookingRef}
                </p>
              </div>

              <span className="inline-flex w-fit items-center gap-2 rounded-lg bg-white/20 px-4 py-2 font-semibold">
                <CheckCircle className="h-5 w-5 text-green-300" />
                PAID
              </span>
            </div>
          </div>

          <div className="space-y-8 p-6 sm:p-8">
            {/* Booking details */}
            <section>
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-800">
                <Calendar className="h-5 w-5 text-indigo-600" />
                Booking Details
              </h3>

              <div className="rounded-lg bg-slate-50 p-4">
                <div className="space-y-3 text-sm">
                  <Detail label="Booking reference" value={booking.bookingRef} />
                  <Detail label="Package" value={booking.packageName} />
                  <Detail
                    label="Selected activities"
                    value={String(booking.activities.length)}
                  />
                  <Detail
                    label="Guests"
                    value={`${booking.adults} Adults, ${booking.children} Children, ${booking.infants} Infants`}
                  />
                  <Detail label="Status" value="Paid and confirmed" />
                </div>
              </div>
            </section>

            {/* Guest information */}
            <section>
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-800">
                <User className="h-5 w-5 text-indigo-600" />
                Guest Information
              </h3>

              <div className="space-y-3 rounded-lg bg-slate-50 p-4 text-sm">
                <Detail label="Full name" value={booking.customerName} />

                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
                  <span className="break-all text-slate-700">
                    {booking.email}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
                  <span className="text-slate-700">{booking.phone}</span>
                </div>
              </div>
            </section>

            {/* Selected activities */}
            <section>
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-800">
                <Calendar className="h-5 w-5 text-indigo-600" />
                Your Selected Activities
              </h3>

              <div className="space-y-4">
                {booking.activities.map((activity) => (
                  <article
                    key={activity.id}
                    className="rounded-xl border border-slate-200 p-5 transition hover:border-indigo-200"
                  >
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                      <div>
                        <h4 className="font-semibold text-slate-800">
                          {activity.title}
                        </h4>

                        {activity.isBonus && (
                          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                            <CheckCircle className="h-3.5 w-3.5" />
                            Bonus activity
                          </span>
                        )}
                      </div>

                      <p className="font-bold text-indigo-600">
                        {formatPrice(activity.totalPrice)}
                      </p>
                    </div>

                    <div className="mt-4 space-y-3 text-sm text-slate-600">
                      <div className="flex items-start gap-2">
                        <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
                        <span>
                          <span className="font-medium text-slate-700">
                            Date:
                          </span>{" "}
                          {formatDate(activity.date)}
                        </span>
                      </div>

                      <div className="flex items-start gap-2">
                        <Clock className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
                        <span>
                          <span className="font-medium text-slate-700">
                            Departure:
                          </span>{" "}
                          {activity.departureHour}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Pickup and drop-off */}
            <section>
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-800">
                <MapPin className="h-5 w-5 text-indigo-600" />
                Location Information
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-slate-50 p-4">
                  <h4 className="mb-2 font-medium text-slate-700">
                    Pick-up Location
                  </h4>
                  <p className="text-sm text-slate-600">
                    {booking.pickUpLocation}
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-4">
                  <h4 className="mb-2 font-medium text-slate-700">
                    Drop-off Location
                  </h4>
                  <p className="text-sm text-slate-600">
                    {booking.dropOffLocation}
                  </p>
                </div>
              </div>
            </section>

            {/* Payment summary */}
            <section className="border-t border-slate-200 pt-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-800">
                <CreditCard className="h-5 w-5 text-indigo-600" />
                Payment Summary
              </h3>

              <div className="rounded-lg bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-4 py-2">
                  <span className="text-slate-600">Package total</span>
                  <span className="font-medium text-slate-800">
                    {formatPrice(booking.totalPrice)}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between gap-4 border-t border-slate-200 pt-4">
                  <span className="text-lg font-bold text-slate-800">
                    Total paid
                  </span>
                  <span className="text-2xl font-bold text-indigo-600">
                    {formatPrice(booking.totalPrice)}
                  </span>
                </div>
              </div>

              <p className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                <Clock className="h-4 w-4 shrink-0" />
                Booking reference: {booking.bookingRef}
              </p>
            </section>

            {/* Support */}
            <section className="border-t border-slate-200 pt-6">
              <p className="text-sm leading-6 text-slate-600">
                A confirmation email will be sent to{" "}
                <span className="font-medium text-slate-800">
                  {booking.email}
                </span>
                . If you have any questions, contact{" "}
                <a
                  href="mailto:support@arcticdreamtours.com"
                  className="font-medium text-indigo-600 underline hover:text-indigo-800"
                >
                  support@arcticdreamtours.com
                </a>
                .
              </p>
            </section>
          </div>

          <footer className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 bg-slate-50 px-6 py-5 sm:flex-row sm:px-8">
            <div>
              <p className="font-semibold text-slate-800">
                Thank you for your booking!
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Arctic Dream Tours
              </p>
            </div>

            <a
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </a>
          </footer>
        </div>
      </div>
    </main>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col justify-between gap-1 sm:flex-row sm:gap-4">
      <span className="text-slate-500">{label}</span>
      <span className="break-words font-medium text-slate-800 sm:text-right">
        {value}
      </span>
    </div>
  );
}
