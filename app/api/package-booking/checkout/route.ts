
import { baseUrl } from "@/utils/baseUrl";
import { stripe } from "@/utils/stripe";
import { db } from "@/lib/database/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json().catch(() => null);

    if (
      !body ||
      typeof body !== "object" ||
      !("bookingId" in body) ||
      typeof body.bookingId !== "string"
    ) {
      return NextResponse.json(
        { error: "A valid booking ID is required" },
        { status: 400 },
      );
    }

    const booking = await db.packageBooking.findUnique({
      where: { id: body.bookingId },
      include: { activities: true },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Package booking not found" },
        { status: 404 },
      );
    }

    if (booking.status !== "PENDING") {
      return NextResponse.json(
        { error: "This booking is not awaiting payment" },
        { status: 409 },
      );
    }

    // Recalculate the amount from the persisted activity prices.
    const total = Math.round(
      booking.activities.reduce(
        (sum, activity) => sum + activity.totalPrice,
        0,
      ) * 100,
    );

    if (
      booking.activities.length === 0 ||
      !Number.isSafeInteger(total) ||
      total <= 0
    ) {
      return NextResponse.json(
        { error: "Invalid package booking amount" },
        { status: 400 },
      );
    }

    // Reuse an existing open Checkout Session where possible.
    if (booking.stripeSessionId) {
      const existingSession =
        await stripe.checkout.sessions.retrieve(
          booking.stripeSessionId,
        );

      if (
        existingSession.status === "open" &&
        existingSession.client_secret
      ) {
        return NextResponse.json({
          id: existingSession.id,
          client_secret: existingSession.client_secret,
        });
      }

      if (existingSession.status === "complete") {
        return NextResponse.json(
          { error: "Checkout has already been completed" },
          { status: 409 },
        );
      }
    }

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: total,
            product_data: {
              name: booking.packageName,
              description: `${booking.activities.length} selected activities`,
            },
          },
          quantity: 1,
        },
      ],
      payment_method_types: ["card"],
      mode: "payment",
      automatic_tax: { enabled: true },
      metadata: {
        bookingType: "package",
        packageBookingId: booking.id,
        bookingRef: booking.bookingRef,
      },
     return_url: `${baseUrl}/en/package-success/${encodeURIComponent(
  booking.publicToken,
)}?session_id={CHECKOUT_SESSION_ID}`,
    });

    if (!session.client_secret) {
      return NextResponse.json(
        { error: "Stripe did not return a Checkout client secret" },
        { status: 500 },
      );
    }

    // Only attach the newly created session if another request
    // has not already attached a session to this booking.
    const saved = await db.packageBooking.updateMany({
      where: {
        id: booking.id,
        stripeSessionId: null,
        status: "PENDING",
      },
      data: { stripeSessionId: session.id },
    });

    if (saved.count === 0) {
      // Another request may have created a session concurrently.
      // Do not silently replace the session attached to the booking.
      return NextResponse.json(
        { error: "Checkout was initialized concurrently. Please retry." },
        { status: 409 },
      );
    }

    return NextResponse.json({
      id: session.id,
      client_secret: session.client_secret,
    });
  } catch (error) {
    console.error("Package Checkout creation error:", error);

    return NextResponse.json(
      { error: "Payment session creation failed" },
      { status: 500 },
    );
  }
}
