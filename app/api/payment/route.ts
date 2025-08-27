import { db } from "@/lib/database/db";
import { baseUrl } from "@/utils/baseUrl";
import { stripe } from "@/utils/stripe";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const data = await request.json();
    const booking = await db.booking.findUnique({
      where: {
        id: data.id,
      },
    });
    if (!booking) {
      return NextResponse.json(
        { error: "Activity not found " },
        {
          status: 400,
        }
      );
    }
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
      return_url: `${baseUrl}/en/booking/success?session_id={CHECKOUT_SESSION_ID}`,
    });
    console.log("client secret : ", session.client_secret);

    return NextResponse.json({
      id: session.id,
      client_secret: session.client_secret,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "error here buddy" },
      {
        status: 500,
      }
    );
  }
};
