import { db } from "../database/db";
import { sendVerificationEmail } from "@/lib/auth/email";

export async function generateAndSendVerificationCode(email: string) {
    // Generate cryptographically secure 6-digit code
    const code = await generateSecureCode();

    // Set expiration (10 minutes from now)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Upsert record for this email
    await db.emailVerification.upsert({
        where: { email },
        update: { code, expiresAt },
        create: { email, code, expiresAt },
    });

    // Send the email with the code
    await sendVerificationEmail(email, code);
}

async function generateSecureCode(): Promise<string> {
    // Create a typed array to hold the random values
    const randomValues = new Uint32Array(1);

    // Get cryptographically secure random values
    crypto.getRandomValues(randomValues);

    // Generate a 6-digit code (000000-999999)
    const code = ((randomValues[0] % 900000) + 100000).toString();

    return code;
}
