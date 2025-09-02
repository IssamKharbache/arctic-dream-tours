import { buffer } from "micro";
import { stripe } from "@/utils/stripe";
import { db } from "@/lib/database/db";
import { sendBookingEmail } from "@/lib/auth/sendBookingEmail";

export const config = {
  api: { bodyParser: false }, // Stripe requires raw body
};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).end();

  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed.", err);
    return res.status(400).end();
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // Find the booking by ID (you passed booking.id in metadata)
    const booking = await db.booking.findUnique({
      where: { id: session?.metadata?.bookingId },
      include: { activity: true },
    });

    if (!booking) {
      console.error("Booking not found for webhook session:", session.id);
      return res.status(400).end();
    }

    // Update booking status to paid
    await db.booking.update({
      where: { id: booking.id },
      data: { status: "PAID" },
    });

    // Send confirmation email
    try {
      await sendBookingEmail({
        bookingRef: booking.bookingRef,
        customerName: `${booking.firstName} ${booking.lastName}`,
        customerEmail: booking.email,
        activityName: booking.activity.title,
        date: new Date(booking.date).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        time: booking.departureHour,
        adults: booking.adults,
        children: booking.children,
        totalPrice: booking.totalPrice,
        pickUpLocation: booking.pickUpLocation,
        dropOffLocation: booking.dropOffLocation,
        isPrivate: booking.isPrivate,
        status: "paid",
      });
    } catch (emailError) {
      console.error("Failed to send booking email:", emailError);
    }
  }

  res.status(200).end();
}
