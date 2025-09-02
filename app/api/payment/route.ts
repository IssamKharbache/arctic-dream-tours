// Update your payment API
import { sendBookingEmail } from "@/lib/auth/sendBookingEmail";
import { db } from "@/lib/database/db";
import { baseUrl } from "@/utils/baseUrl";
import { stripe } from "@/utils/stripe";
import { generateAccessToken } from "@/utils/tokens";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const data = await request.json();
    const booking = await db.booking.findUnique({
      where: {
        id: data.id,
      },
      include: {
        activity: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 400 });
    }

    // Generate access token for this booking
    const accessToken = generateAccessToken();

    // Update booking with access token
    await db.booking.update({
      where: { id: booking.id },
      data: { accessToken },
    });

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      line_items: [
        {
          price_data: {
            unit_amount: booking.totalPrice * 100,
            currency: "eur",
            product_data: {
              name: booking.email,
              images: [booking.email],
            },
          },
          quantity: 1,
        },
      ],
      payment_method_types: ["card"],
      mode: "payment",
      automatic_tax: { enabled: true },
      return_url: `${baseUrl}/en/booking/success/${booking.id}?session_id={CHECKOUT_SESSION_ID}&token=${accessToken}`,
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
