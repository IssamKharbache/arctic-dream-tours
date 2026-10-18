
import { stripe } from "@/utils/stripe";
import { db } from "@/lib/database/db";
import { NextRequest, NextResponse } from "next/server";
import { sendBookingEmail } from "@/lib/auth/sendBookingEmail";
import { sendPackageBookingEmail } from "@/lib/auth/sendPackageBookingEmail";
import type Stripe from "stripe";

export const POST = async (req: NextRequest) => {
  console.log("Webhook received");

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

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

    return NextResponse.json(
      { error: "Missing signature" },
      { status: 400 }
    );
  }

  // Stripe signature verification requires the unmodified raw body.
  const body = await req.text();

  if (!body.trim()) {
    console.error("Empty webhook body");

    return NextResponse.json(
      { error: "No body received" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      webhookSecret
    );

    console.log("Stripe signature verification successful");
  } catch (err) {
    console.error("Signature verification failed:", err);

    return NextResponse.json(
      { error: `Webhook Error: ${err}` },
      { status: 400 }
    );
  }

  // Handle completed Checkout Sessions and delayed payment success.
  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata;

    // ---------------------------------------------------------
    // PACKAGE BOOKING
    // ---------------------------------------------------------
    if (metadata?.bookingType === "package") {
      const bookingId = metadata.packageBookingId;

      if (!bookingId) {
        console.error(
          "Package Checkout Session is missing packageBookingId:",
          session.id
        );

        return NextResponse.json(
          { error: "Missing package booking ID" },
          { status: 400 }
        );
      }

      // Never mark an unpaid session as paid.
      if (session.payment_status !== "paid") {
        console.log(
          "Package payment is not paid yet:",
          metadata.bookingRef,
          session.payment_status
        );

        return NextResponse.json({ received: true }, { status: 200 });
      }

      try {
        // Verify the booking belongs to this exact Checkout Session
        // before updating it or sending an email.
        const existingPackageBooking =
          await db.packageBooking.findUnique({
            where: { id: bookingId },
            select: {
              id: true,
              bookingRef: true,
              status: true,
              stripeSessionId: true,
            },
          });

        if (!existingPackageBooking) {
          console.error("Package booking not found:", bookingId);

          return NextResponse.json(
            { error: "Package booking not found" },
            { status: 500 }
          );
        }

        if (existingPackageBooking.stripeSessionId !== session.id) {
          console.error(
            "Stripe session does not match package booking:",
            existingPackageBooking.bookingRef
          );

          return NextResponse.json(
            { error: "Checkout Session mismatch" },
            { status: 400 }
          );
        }

        // Atomically change PENDING to PAID.
        // This prevents duplicate webhook deliveries from sending
        // another confirmation email during normal retries.
        const result = await db.packageBooking.updateMany({
          where: {
            id: bookingId,
            stripeSessionId: session.id,
            status: "PENDING",
          },
          data: {
            status: "PAID",
          },
        });

        if (result.count === 0) {
          // Another delivery may already have processed this payment.
          const currentBooking = await db.packageBooking.findUnique({
            where: { id: bookingId },
            select: {
              bookingRef: true,
              status: true,
            },
          });

          if (currentBooking?.status === "PAID") {
            console.log(
              "Package booking was already paid:",
              currentBooking.bookingRef
            );

            return NextResponse.json(
              { received: true },
              { status: 200 }
            );
          }

          console.error(
            "Package booking was not updated:",
            currentBooking?.bookingRef,
            currentBooking?.status
          );

          return NextResponse.json(
            { error: "Package booking status was not updated" },
            { status: 500 }
          );
        }

        console.log(
          "Package booking marked as PAID:",
          existingPackageBooking.bookingRef
        );

        // Fetch the complete booking after payment confirmation.
        const booking = await db.packageBooking.findUnique({
          where: { id: bookingId },
          include: {
            activities: {
              orderBy: { date: "asc" },
            },
          },
        });

        if (!booking) {
          throw new Error(`Package booking not found: ${bookingId}`);
        }

        // Send the package confirmation email with every selected activity.
        await sendPackageBookingEmail({
          bookingRef: booking.bookingRef,
          packageName: booking.packageName,
          customerName: `${booking.firstName} ${booking.lastName}`,
          customerEmail: booking.email,
          adults: booking.adults,
          children: booking.children,
          infants: booking.infants,
          totalPrice: booking.totalPrice,
          pickUpLocation: booking.pickUpLocation,
          dropOffLocation: booking.dropOffLocation,
          status: booking.status,
          activities: booking.activities.map((activity) => ({
            title: activity.activityTitle,
            date: activity.date,
            departureHour: activity.departureHour,
            totalPrice: activity.totalPrice,
            isBonus: activity.isBonus,
          })),
        });

        console.log(
          "Package confirmation email sent:",
          booking.bookingRef
        );

        return NextResponse.json({ received: true }, { status: 200 });
      } catch (error) {
        console.error("Error processing package booking:", error);

        // Stripe can retry, but see the email retry note below.
        return NextResponse.json(
          { error: "Failed to process package booking" },
          { status: 500 }
        );
      }
    }

    // ---------------------------------------------------------
    // EXISTING SINGLE-ACTIVITY BOOKING
    // ---------------------------------------------------------
    if (event.type === "checkout.session.completed") {
      console.log(
        "Processing checkout.session.completed for booking:",
        metadata?.bookingRef
      );

      // Protect against incomplete metadata.
      if (
        !metadata?.bookingRef ||
        !metadata.activityId ||
        !metadata.date
      ) {
        console.error("Single-activity session is missing metadata");

        return NextResponse.json(
          { error: "Missing booking metadata" },
          { status: 400 }
        );
      }

      // Don't create a booking for an unpaid Checkout Session.
      if (session.payment_status !== "paid") {
        console.log(
          "Single-activity payment is not paid yet:",
          session.id
        );

        return NextResponse.json({ received: true }, { status: 200 });
      }

      try {
        // Check whether the booking was already created.
        const existingBooking = await db.booking.findUnique({
          where: { bookingRef: metadata.bookingRef },
        });

        if (existingBooking) {
          console.log(
            "Booking already exists, skipping creation:",
            metadata.bookingRef
          );

          return NextResponse.json({ received: true }, { status: 200 });
        }

        // Fetch the activity for the confirmation email.
        const activity = await db.activity.findUnique({
          where: { id: metadata.activityId },
        });

        if (!activity) {
          console.error("Activity not found:", metadata.activityId);

          return NextResponse.json(
            { error: "Activity not found" },
            { status: 500 }
          );
        }

        // Create the single-activity booking.
        const newBooking = await db.booking.create({
          data: {
            activityId: metadata.activityId,
            date: new Date(metadata.date),
            adults: Number(metadata.adults),
            children: Number(metadata.children),
            infants: Number(metadata.infants),
            firstName: metadata.firstName,
            lastName: metadata.lastName,
            email: metadata.email,
            phone: metadata.phone,
            pickUpLocation: metadata.pickUpLocation,
            dropOffLocation: metadata.dropOffLocation,
            totalPrice: Number(metadata.totalPrice),
            status: "PAID",
            isPrivate: metadata.isPrivateTour === "true",
            bookingRef: metadata.bookingRef,
            departureHour: metadata.departureHour,
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

        console.log(
          "Single-activity booking processed:",
          newBooking.bookingRef
        );
      } catch (error) {
        console.error("Error creating single-activity booking:", error);

        return NextResponse.json(
          { error: "Failed to process single-activity booking" },
          { status: 500 }
        );
      }
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
};
