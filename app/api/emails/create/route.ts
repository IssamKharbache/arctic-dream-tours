import { sendAlertEmail } from "@/lib/auth/sendAlertEmail";
import { db } from "@/lib/database/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const { fullName, email, phoneNumber, message } = await req.json();

  try {
    const newMail = await db.emails.create({
      data: {
        fullName,
        email,
        phoneNumber,
        message,
      },
    });

    // 🔥 SEND ADMIN ALERT EMAIL
    try {
      await sendAlertEmail({
        type: "message",
        data: newMail,
      });
    } catch (err) {
      console.error("Failed to send admin message alert:", err);
    }

    return NextResponse.json(
      {
        data: newMail,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("[EMAILS CREATION ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
