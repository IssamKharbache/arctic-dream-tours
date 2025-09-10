import { stripe } from "@/utils/stripe";
import { db } from "@/lib/database/db";
import { NextRequest, NextResponse } from "next/server";
import { sendBookingEmail } from "@/lib/auth/sendBookingEmail";

export const POST = async (req: NextRequest) => {
  console.log("Webhook received");

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  console.log("Webhook secret exists:", !!webhookSecret);

  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is missing!");
    return NextResponse.json(
      { error: "Missing webhook secret" },
      { status: 500 }
    );
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    console.error("Missing stripe-signature header");
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const body = await req.text();
  console.log("Webhook body received, length:", body.length);

  if (!body || body.trim().length === 0) {
    console.error("Empty body received - not a valid Stripe webhook");
    return NextResponse.json({ error: "No body received" }, { status: 400 });
  }

  let event;
  try {
    console.log("Attempting to verify signature...");
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    console.log("Signature verification successful");
  } catch (err) {
    console.error("Signature verification failed:", err);
    return NextResponse.json(
      { error: `Webhook Error: ${err}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    console.log(
      "Processing checkout.session.completed for booking:",
      session.metadata.bookingRef
    );

    try {
      // Check if booking already exists to prevent duplicates
      const existingBooking = await db.booking.findUnique({
        where: { bookingRef: session.metadata.bookingRef },
      });

      if (existingBooking) {
        console.log(
          "Booking already exists, skipping creation:",
          session.metadata.bookingRef
        );
        return NextResponse.json({ received: true }, { status: 200 });
      }

      // Get the activity details to include in email
      const activity = await db.activity.findUnique({
        where: { id: session.metadata.activityId },
      });

      if (!activity) {
        console.error("Activity not found:", session.metadata.activityId);
        return NextResponse.json(
          { error: "Activity not found" },
          { status: 404 }
        );
      }

      // Create new booking
      const newBooking = await db.booking.create({
        data: {
          activityId: session.metadata.activityId,
          date: new Date(session.metadata.date),
          adults: Number(session.metadata.adults),
          children: Number(session.metadata.children),
          infants: Number(session.metadata.infants),
          firstName: session.metadata.firstName,
          lastName: session.metadata.lastName,
          email: session.metadata.email,
          phone: session.metadata.phone,
          pickUpLocation: session.metadata.pickUpLocation,
          dropOffLocation: session.metadata.dropOffLocation,
          totalPrice: Number(session.metadata.totalPrice),
          status: "PAID",
          isPrivate: session.metadata.isPrivateTour === "true",
          bookingRef: session.metadata.bookingRef,
          departureHour: session.metadata.departureHour,
        },
      });
      await sendBookingEmail({
        bookingRef: newBooking.bookingRef,
        customerName: `${newBooking.firstName} ${newBooking.lastName}`,
        customerEmail: newBooking.email,
        activityName: activity.title,
        date: new Date(newBooking.date).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        time: newBooking.departureHour,
        adults: newBooking.adults,
        children: newBooking.children,
        totalPrice: newBooking.totalPrice,
        pickUpLocation: newBooking.pickUpLocation,
        dropOffLocation: newBooking.dropOffLocation,
        isPrivate: newBooking.isPrivate,
        status: "PAID",
      });
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
};
