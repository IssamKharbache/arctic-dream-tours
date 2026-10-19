  import { baseUrl } from "@/utils/baseUrl";
import { stripe } from "@/utils/stripe";
import { NextRequest, NextResponse } from "next/server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";

export const POST = async (request: NextRequest) => {
  try {

    const authSession = await getServerSession(authOptions);
const userId = authSession?.user?.id ?? "";
    const { bookingData } = await request.json();

    if (!bookingData) {
      return NextResponse.json({ error: "Booking not found" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      line_items: [
        {
          price_data: {
            unit_amount: bookingData.totalPrice * 100,
            currency: "eur",
            product_data: {
              name: bookingData.email,
              images: [bookingData.email],
            },
          },
          quantity: 1,
        },
      ],
      payment_method_types: ["card"],
      mode: "payment",
      metadata: {
        activityId: bookingData.activityId,
        date: bookingData.date!, // ISO string
        adults: bookingData.adults?.toString() || "1",
        children: bookingData.children?.toString() || "0",
        infants: bookingData.infants?.toString() || "0",
        firstName: bookingData.firstName,
        lastName: bookingData.lastName,
        email: bookingData.email,
        phone: bookingData.phone,
        pickUpLocation: bookingData.pickUpLocation,
        dropOffLocation: bookingData.dropOffLocation,
        isPrivateTour: bookingData.isPrivateTour ? "true" : "false",
        bookingRef: bookingData.bookingRef,
        departureHour: bookingData.departureHour,
        totalPrice: bookingData.totalPrice!.toString(),
         userId,
      },
      automatic_tax: { enabled: true },
      return_url: `${baseUrl}/en/booking/success/${encodeURIComponent(bookingData.bookingRef)}?session_id={CHECKOUT_SESSION_ID}`,
    });

    return NextResponse.json({
      id: session.id,
      client_secret: session.client_secret,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Payment session creation failed" },
      { status: 500 }
    );
  }
};