import nodemailer from "nodemailer";
import { generateBookingEmailHtml } from "../booking/generateBookingEmailHtml";

interface BookingData {
  bookingRef: string;
  customerName: string;
  customerEmail: string;
  activityName: string;
  date: string;
  time: string;
  adults: number;
  children: number;
  totalPrice: number;
  pickUpLocation: string;
  dropOffLocation: string;
  isPrivate: boolean;
  status: string;
}

export const sendBookingEmail = async (bookingData: BookingData) => {
  // Check if email credentials are configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("Email credentials not configured. Skipping email sending.");
    return;
  }

  const html = await generateBookingEmailHtml(bookingData);

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const subject =
    bookingData.status === "PAID"
      ? `Booking Confirmation #${bookingData.bookingRef}`
      : `Booking Request Received #${bookingData.bookingRef}`;

  await transporter.sendMail({
    // Change this line - add your brand/company name in quotes
    from: `"Arctic dream tours" <${process.env.EMAIL_USER}>`,
    to: bookingData.customerEmail,
    subject: subject,
    html: html,
  });
};
