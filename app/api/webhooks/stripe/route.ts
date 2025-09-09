import { stripe } from "@/utils/stripe";
import { db } from "@/lib/database/db";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  const sig = req.headers.get("stripe-signature")!;
  const body = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return new Response(`Webhook Error: ${err}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;

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
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
};
