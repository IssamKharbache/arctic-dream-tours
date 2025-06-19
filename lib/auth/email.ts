import nodemailer from "nodemailer"; // use import, not require

import { generateVerificationEmailHtml } from "./generateEmailHtml";

export const sendVerificationEmail = async (toEmail: string, code: string) => {
    const html = await generateVerificationEmailHtml(code);
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: "Your Verification Code",
        html: html,
    });

    console.log("✅ Message sent: %s", info.messageId);
    console.log("🔗 Preview URL: %s", nodemailer.getTestMessageUrl(info));
};
