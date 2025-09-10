import { stripe } from "@/utils/stripe";
import { db } from "@/lib/database/db";
import { NextRequest, NextResponse } from "next/server";
import { sendBookingEmail } from "@/lib/auth/sendBookingEmail";

export const POST = async (req: NextRequest) => {
  console.log("Webhook received");

  // Debug: Check if secret is available
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

  // ✅ ADD THIS CHECK: Validate that body is not empty
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
      // ✅ ADD DUPLICATE CHECK: Prevent creating the same booking multiple times
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

      await db.booking.create({
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
      try {
        await sendBookingEmail({
          bookingRef: session.metadata.bookingRef,
          customerName: `${session.metadata.firstName} ${session.metadata.lastName}`,
          customerEmail: session.metadata.email,
          activityName: session.metadata.activity.title,
          date: new Date(session.metadata.date).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          time: session.metadata.departureHour,
          adults: session.metadata.adults,
          children: session.metadata.children,
          totalPrice: session.metadata.totalPrice,
          pickUpLocation: session.metadata.pickUpLocation,
          dropOffLocation: session.metadata.dropOffLocation,
          isPrivate: session.metadata.isPrivateTour,
          status: "PAID",
        });
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
      }
      console.log("Booking created successfully in database");
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
};
