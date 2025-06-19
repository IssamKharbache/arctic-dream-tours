import { db } from "../database/db";
import { sendVerificationEmail } from "@/lib/auth/email"; // your nodemailer send function

export async function generateAndSendVerificationCode(email: string) {
    // Generate 6-digit code as string
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Set expiration (10 minutes from now)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Upsert record for this email
    await db.emailVerification.upsert({
        where: { email },
        update: { code, expiresAt },
        create: { email, code, expiresAt },
    });
    //send the email with the code
    await sendVerificationEmail(email, code);
}
