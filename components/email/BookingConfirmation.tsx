// components/emails/BookingConfirmation.tsx
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Link,
  Row,
  Column,
} from "@react-email/components";

interface BookingConfirmationProps {
  bookingRef: string;
  customerName: string;
  activityName: string;
  date: string;
  time: string;
  adults: number;
  numChildren: number;
  totalPrice: number;
  pickUpLocation: string;
  dropOffLocation: string;
  isPrivate: boolean;
  status: string;
  companyName?: string;
  supportEmail?: string;
}

export const BookingConfirmationEmail = ({
  bookingRef,
  customerName,
  activityName,
  date,
  time,
  adults,
  numChildren,
  totalPrice,
  pickUpLocation,
  dropOffLocation,
  isPrivate,
  status,
  companyName = "Arctic dream tours",
  supportEmail = "arcticdreamtours@gmail.com",
}: BookingConfirmationProps) => (
  <Html>
    <Head />
    <Preview>
      Your{" "}
      {status === "PAID" ? "Booking Confirmation" : "Booking Request Received"}{" "}
      - #{bookingRef}
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoSection}>
          <Heading style={logo}>{companyName}</Heading>
        </Section>

        <Section style={content}>
          <Heading style={h1}>
            {status === "PAID"
              ? "Booking Confirmed!"
              : "Booking Request Received"}
          </Heading>

          <Text style={text}>Dear {customerName},</Text>

          <Text style={text}>
            {status === "PAID"
              ? "Thank you for your booking! Your payment has been successfully processed and your adventure is confirmed."
              : "Thank you for your booking request! We've received your details and will confirm availability shortly."}
          </Text>

          <Section style={detailsContainer}>
            <Heading style={h2}>Booking Details</Heading>

            <Row>
              <Column style={detailColumn}>
                <Text style={detailLabel}>Reference Number</Text>
                <Text style={detailValue}>{bookingRef}</Text>
              </Column>
              <Column style={detailColumn}>
                <Text style={detailLabel}>Status</Text>
                <Text style={detailValue}>{status}</Text>
              </Column>
            </Row>

            <Row>
              <Column style={detailColumn}>
                <Text style={detailLabel}>Activity</Text>
                <Text style={detailValue}>{activityName}</Text>
              </Column>
              <Column style={detailColumn}>
                <Text style={detailLabel}>Tour Type</Text>
                <Text style={detailValue}>
                  {isPrivate ? "Private Tour" : "Group Tour"}
                </Text>
              </Column>
            </Row>

            <Row>
              <Column style={detailColumn}>
                <Text style={detailLabel}>Date & Time</Text>
                <Text style={detailValue}>
                  {date} at {time}
                </Text>
              </Column>
              <Column style={detailColumn}>
                <Text style={detailLabel}>Participants</Text>
                <Text style={detailValue}>
                  {adults} Adults, {numChildren} Children
                </Text>
              </Column>
            </Row>

            <Row>
              <Column style={fullWidthColumn}>
                <Text style={detailLabel}>Pick-up Location</Text>
                <Text style={detailValue}>{pickUpLocation}</Text>
              </Column>
            </Row>

            <Row>
              <Column style={fullWidthColumn}>
                <Text style={detailLabel}>Drop-off Location</Text>
                <Text style={detailValue}>{dropOffLocation}</Text>
              </Column>
            </Row>

            <Row>
              <Column style={fullWidthColumn}>
                <Text style={detailLabel}>Total Amount</Text>
                <Text style={priceValue}>€{totalPrice.toFixed(2)}</Text>
                {status !== "PAID" && (
                  <Text style={smallText}>
                    This is an estimated price. Final amount will be confirmed.
                  </Text>
                )}
              </Column>
            </Row>
          </Section>

          {status === "PAID" ? (
            <Section style={instructions}>
              <Heading style={h3}>What to Expect Next</Heading>
              <Text style={text}>
                • Please arrive at the pick-up location 15 minutes before
                departure
                <br />
                • Have your booking reference ready to present upon arrival
                <br />• In case of questions, contact us at {supportEmail}
              </Text>
            </Section>
          ) : (
            <Section style={instructions}>
              <Heading style={h3}>Next Steps</Heading>
              <Text style={text}>
                • Our team will verify availability within 24 hours
                <br />
                • We will contact you with payment instructions
                <br />
                • Your booking will be held for 48 hours pending confirmation
                <br />• For urgent inquiries, contact us at {supportEmail}
              </Text>
            </Section>
          )}

          <Hr style={hr} />

          <Text style={footerText}>
            Need help? Contact our support team at{" "}
            <Link href={`mailto:${supportEmail}`} style={link}>
              {supportEmail}
            </Link>
          </Text>

          <Text style={footerText}>
            © {new Date().getFullYear()} {companyName}. All rights reserved.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

// Styles (similar to your verification email with some additions)
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
};

const logoSection = {
  padding: "32px 40px",
  textAlign: "center" as const,
  backgroundColor: "#f8fafc",
};

const logo = {
  color: "#1f2937",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0",
  letterSpacing: "-0.5px",
};

const content = {
  padding: "40px 40px 0",
};

const h1 = {
  color: "#1f2937",
  fontSize: "28px",
  fontWeight: "bold",
  margin: "0 0 24px",
  textAlign: "center" as const,
  lineHeight: "1.3",
};

const h2 = {
  color: "#1f2937",
  fontSize: "20px",
  fontWeight: "bold",
  margin: "0 0 16px",
};

const h3 = {
  color: "#1f2937",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "24px 0 16px",
};

const text = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 16px",
};

const detailsContainer = {
  backgroundColor: "#f9fafb",
  borderRadius: "8px",
  padding: "24px",
  margin: "24px 0",
  border: "1px solid #e5e7eb",
};

const detailColumn = {
  width: "50%",
  padding: "0 0 16px 0",
};

const fullWidthColumn = {
  width: "100%",
  padding: "0 0 16px 0",
};

const detailLabel = {
  color: "#6b7280",
  fontSize: "14px",
  fontWeight: "medium",
  margin: "0 0 4px",
};

const detailValue = {
  color: "#1f2937",
  fontSize: "16px",
  fontWeight: "normal",
  margin: "0",
};

const priceValue = {
  color: "#059669",
  fontSize: "20px",
  fontWeight: "bold",
  margin: "4px 0 0",
};

const instructions = {
  backgroundColor: "#f0f9ff",
  borderRadius: "8px",
  padding: "20px",
  margin: "24px 0",
  border: "1px solid #bae6fd",
};

const smallText = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: "8px 0 0",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "32px 0",
};

const footerText = {
  color: "#9ca3af",
  fontSize: "12px",
  lineHeight: "1.5",
  margin: "8px 0",
  textAlign: "center" as const,
};

const link = {
  color: "#3b82f6",
  textDecoration: "underline",
};
