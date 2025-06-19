import { db } from "@/lib/database/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { email, code } = await request.json();

        if (!email || !code) {
            return NextResponse.json(
                { success: false, error: "Missing email or code" },
                { status: 400 },
            );
        }

        const record = await db.emailVerification.findFirst({
            where: { email },
            orderBy: { createdAt: "desc" },
        });

        if (!record) {
            return NextResponse.json(
                { success: false, error: "No verification code found" },
                { status: 404 },
            );
        }

        if (record.expiresAt < new Date()) {
            return NextResponse.json(
                { success: false, error: "Verification code expired" },
                { status: 400 },
            );
        }

        if (record.code !== code) {
            return NextResponse.json(
                { success: false, error: "Invalid verification code" },
                { status: 400 },
            );
        }

        // Optionally delete the used verification record
        await db.emailVerification.deleteMany({
            where: { email },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 },
        );
    }
}
