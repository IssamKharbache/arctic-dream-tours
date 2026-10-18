import { db } from "@/lib/database/db";
import { stripe } from "@/utils/stripe";
import { NextRequest, NextResponse } from "next/server";

interface RouteProps {
  params: Promise<{ publicToken: string }>;
}

export async function GET(
  _request: NextRequest,
  { params }: RouteProps,
) {
  try {
    const { publicToken } = await params;
    const token = publicToken?.trim();

    if (!token) {
      return NextResponse.json(
        { error: "Missing public booking token" },
        { status: 400 },
      );
    }

    const booking = await db.packageBooking.findUnique({
      where: { publicToken: token },
      include: {
        activities: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Package booking not found" },
        { status: 404 },
      );
    }

    const sessionId = booking.stripeSessionId;

    if (!sessionId) {
      return NextResponse.json({ status: "PROCESSING" });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Verify this Stripe session belongs to this package booking.
    if (
      session.metadata?.bookingType !== "package" ||
      session.metadata?.packageBookingId !== booking.id ||
      session.metadata?.bookingRef !== booking.bookingRef
    ) {
      return NextResponse.json(
        { error: "Stripe session does not match this booking" },
        { status: 403 },
      );
    }

    if (session.payment_status !== "paid") {
      return NextResponse.json({ status: "PAYMENT_PENDING" });
    }

    if (booking.status !== "PAID") {
      return NextResponse.json({ status: "PROCESSING" });
    }

    return NextResponse.json({
      status: "PAID",
      booking: {
        bookingRef: booking.bookingRef,
        packageName: booking.packageName,
        customerName: `${booking.firstName} ${booking.lastName}`,
        email: booking.email,
        phone: booking.phone,
        adults: booking.adults,
        children: booking.children,
        infants: booking.infants,
        pickUpLocation: booking.pickUpLocation,
        dropOffLocation: booking.dropOffLocation,
        totalPrice: booking.totalPrice,
        status: booking.status,
        createdAt: booking.createdAt,
        activities: booking.activities.map((activity) => ({
          id: activity.id,
          title: activity.activityTitle,
          date: activity.date,
          departureHour: activity.departureHour,
          isBonus: activity.isBonus,
          adultPrice: activity.adultPrice,
          childPrice: activity.childPrice,
          totalPrice: activity.totalPrice,
        })),
      },
    });
  } catch (error) {
    console.error("Package booking fetch error:", error);

    return NextResponse.json(
      { error: "Failed to fetch package booking" },
      { status: 500 },
    );
  }
}