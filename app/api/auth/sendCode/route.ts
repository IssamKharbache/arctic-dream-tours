import { NextRequest, NextResponse } from "next/server";
import { generateAndSendVerificationCode } from "@/lib/auth/generateAndSendCode";

export async function POST(req: NextRequest) {
    const { email } = await req.json();
    if (!email)
        return NextResponse.json(
            { error: "Email is required" },
            { status: 400 },
        );

    try {
        await generateAndSendVerificationCode(email);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to send email:", error);
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}
