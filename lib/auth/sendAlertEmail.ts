import nodemailer from "nodemailer";

import type { Booking, Emails, Activity } from "@prisma/client";

// Booking Email HTML (ALERT TO ADMIN)
const generateBookingAlertHtml = (
  booking: Booking & { activity: Activity }
) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color: #2e7d32;">📩 New Booking Received</h2>

      <p>You have received a new booking on your website.</p>

      <h3>Customer Details</h3>
      <p><strong>Name:</strong> ${booking.firstName} ${booking.lastName}</p>
      <p><strong>Email:</strong> ${booking.email}</p>
      <p><strong>Phone:</strong> ${booking.phone}</p>

      <h3>Booking Information</h3>
      <p><strong>Reference:</strong> ${booking.bookingRef}</p>
      <p><strong>Status:</strong> ${booking.status}</p>
      <p><strong>Activity:</strong> ${booking.activity.title}</p>
      <p><strong>Date:</strong> ${booking.date.toDateString()}</p>
      <p><strong>Departure Hour:</strong> ${booking.departureHour}</p>
      <p><strong>Private Tour:</strong> ${booking.isPrivate ? "Yes" : "No"}</p>

      <h3>Guests</h3>
      <p><strong>Adults:</strong> ${booking.adults}</p>
      <p><strong>Children:</strong> ${booking.children}</p>
      <p><strong>Infants:</strong> ${booking.infants}</p>

      <h3>Pickup & Dropoff</h3>
      <p><strong>Pick Up:</strong> ${booking.pickUpLocation}</p>
      <p><strong>Drop Off:</strong> ${booking.dropOffLocation}</p>

      <h3>Payment</h3>
      <p><strong>Total Price:</strong> ${booking.totalPrice} €</p>

      <br />
      <a href="${process.env.ADMIN_DASHBOARD_URL}/bookings"
        style="display: inline-block; padding: 10px 16px; background: #2e7d32; 
        color: white; text-decoration: none; border-radius: 5px;">
        View Booking in Dashboard
      </a>
    </div>
  `;
};

// Message Email HTML (ALERT TO ADMIN)
const generateMessageAlertHtml = (emailData: Emails) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color: #0277bd;">💬 New Message from arctic website Received</h2>

      <p>You have received a new message from your contact form.</p>

      <h3>Sender</h3>
      <p><strong>Name:</strong> ${emailData.fullName}</p>
      <p><strong>Email:</strong> ${emailData.email}</p>
      <p><strong>Phone:</strong> ${emailData.phoneNumber || "Not provided"}</p>

      <h3>Message</h3>
      <p>${emailData.message}</p>

      <br />
      <a href="${process.env.ADMIN_DASHBOARD_URL}/messages"
        style="display: inline-block; padding: 10px 16px; background: #0277bd; 
        color: white; text-decoration: none; border-radius: 5px;">
        View Message in Dashboard
      </a>
    </div>
  `;
};

interface AlertOptions {
  type: "booking" | "message";
  data: any; // Booking or Emails object
}

export const sendAlertEmail = async ({ type, data }: AlertOptions) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("Email credentials not configured.");
    return;
  }

  if (!process.env.ADMIN_EMAIL) {
    console.warn("ADMIN_EMAIL is missing.");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  let subject = "";
  let html = "";

  // ---- BOOKING ALERT ----
  if (type === "booking") {
    subject = `📩 New Booking – Ref #${data.bookingRef}`;
    html = generateBookingAlertHtml(data);
  }

  // ---- MESSAGE ALERT ----
  else if (type === "message") {
    subject = `💬 New Contact Message from ${data.fullName}`;
    html = generateMessageAlertHtml(data);
  }

  await transporter.sendMail({
    from: `"Arctic dream tours" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject,
    html,
  });

  console.log(`Admin alert email sent (${type}).`);
};
