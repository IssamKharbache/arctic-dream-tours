import nodemailer from "nodemailer";
import { generateVerificationEmailHtml } from "./generateEmailHtml";

export const sendVerificationEmail = async (toEmail: string, code: string) => {
  const html = await generateVerificationEmailHtml(code);
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "Your Verification Code",
    html: html,
  });

  console.log("✅ Message sent: %s");
};
