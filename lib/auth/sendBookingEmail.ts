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
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
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
    from: process.env.EMAIL_USER,
    to: bookingData.customerEmail,
    subject: subject,
    html: html,
  });
};
