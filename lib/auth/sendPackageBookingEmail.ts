
import nodemailer from "nodemailer";

export interface PackageBookingEmailData {
  bookingRef: string;
  packageName: string;
  customerName: string;
  customerEmail: string;
  adults: number;
  children: number;
  infants: number;
  totalPrice: number;
  pickUpLocation: string;
  dropOffLocation: string;
  status: string;
  activities: {
    title: string;
    date: Date | string;
    departureHour: string;
    totalPrice: number;
    isBonus: boolean;
  }[];
}

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[char];
  });

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
  }).format(price);

const formatDate = (date: Date | string) =>
  new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

const generatePackageEmailHtml = (
  booking: PackageBookingEmailData
) => {
  const activitiesHtml = booking.activities
    .map(
      (activity, index) => `
        <tr>
          <td style="padding:16px;border-bottom:1px solid #e5e7eb;">
            <strong>${index + 1}. ${escapeHtml(activity.title)}</strong>
            ${activity.isBonus
              ? '<span style="color:#087f5b;font-size:12px;"> (Bonus activity)</span>'
              : ""}
            <div style="margin-top:8px;color:#555;">
              Date: ${escapeHtml(formatDate(activity.date))}
            </div>
            <div style="margin-top:4px;color:#555;">
              Departure: ${escapeHtml(activity.departureHour)}
            </div>
            <div style="margin-top:4px;color:#555;">
              Activity total: ${escapeHtml(formatPrice(activity.totalPrice))}
            </div>
          </td>
        </tr>
      `
    )
    .join("");

  return `
    <div style="margin:0;padding:24px;background:#f4f6f8;font-family:Arial,sans-serif;color:#24313d;">
      <div style="max-width:640px;margin:auto;background:#ffffff;border-radius:12px;overflow:hidden;">
        <div style="background:#003d68;padding:28px;text-align:center;color:#ffffff;">
          <h1 style="margin:0;font-size:25px;">Arctic Dream Tours</h1>
          <p style="margin:12px 0 0;color:#a8e6cf;font-size:13px;letter-spacing:1px;">
            BOOKING CONFIRMED
          </p>
        </div>

        <div style="padding:28px;">
          <h2 style="color:#003d68;">Your Lapland adventure is booked!</h2>

          <p>Hi ${escapeHtml(booking.customerName)},</p>

          <p>
            Thank you for booking <strong>${escapeHtml(booking.packageName)}</strong>
            with Arctic Dream Tours. Your payment has been received.
            We look forward to welcoming you to Lapland!
          </p>

          <div style="background:#f4f8f7;padding:18px;border-radius:8px;margin:24px 0;">
            <h3 style="margin-top:0;color:#003d68;">Booking details</h3>
            <p><strong>Reference:</strong> ${escapeHtml(booking.bookingRef)}</p>
            <p><strong>Package:</strong> ${escapeHtml(booking.packageName)}</p>
            <p><strong>Status:</strong> ${escapeHtml(booking.status)}</p>
            <p><strong>Adults:</strong> ${booking.adults}</p>
            <p><strong>Children:</strong> ${booking.children}</p>
            <p><strong>Infants:</strong> ${booking.infants}</p>
          </div>

          <h3 style="color:#003d68;">Your selected activities</h3>

          <table role="presentation" style="width:100%;border-collapse:collapse;">
            <tbody>${activitiesHtml}</tbody>
          </table>

          <div style="margin-top:24px;">
            <h3 style="color:#003d68;">Pickup and drop-off</h3>
            <p><strong>Pickup:</strong> ${escapeHtml(booking.pickUpLocation)}</p>
            <p><strong>Drop-off:</strong> ${escapeHtml(booking.dropOffLocation)}</p>
          </div>

          <div style="border-top:2px solid #95b4aa;margin-top:24px;padding-top:18px;">
            <table role="presentation" style="width:100%;">
              <tr>
                <td style="font-size:18px;font-weight:bold;">Total paid</td>
                <td style="font-size:22px;font-weight:bold;text-align:right;color:#003d68;">
                  ${escapeHtml(formatPrice(booking.totalPrice))}
                </td>
              </tr>
            </table>
          </div>

          <p style="margin-top:28px;">
            Thank you for choosing Arctic Dream Tours.<br />
            We wish you an unforgettable Arctic experience!
          </p>
        </div>

        <div style="padding:18px;text-align:center;background:#f4f6f8;">
          <p style="color:#667085;font-size:12px;margin:0;">
            Arctic Dream Tours
          </p>
          <p style="font-size:12px;margin:8px 0 0;">
            <a
              href="mailto:support@arcticdreamtours.com"
              style="color:#003d68;text-decoration:none;"
            >support@arcticdreamtours.com</a>
          </p>
        </div>
      </div>
    </div>
  `;
};

export const sendPackageBookingEmail = async (
  bookingData: PackageBookingEmailData
) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn(
      "Email credentials not configured. Skipping package email."
    );
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

  await transporter.sendMail({
    from: `"Arctic Dream Tours" <${process.env.EMAIL_USER}>`,
    to: bookingData.customerEmail,
    subject: `Package Booking Confirmation #${bookingData.bookingRef}`,
    html: generatePackageEmailHtml(bookingData),
  });
};
