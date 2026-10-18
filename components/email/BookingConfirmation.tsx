
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Hr,
  Preview,
} from "@react-email/components";

interface BookingConfirmationEmailProps {
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
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
  }).format(price);

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
}: BookingConfirmationEmailProps) => {
  const paid = status === "PAID";

  return (
    <Html lang="en">
      <Head />
      <Preview>
        {paid
          ? `Your booking confirmation #${bookingRef}`
          : `Your booking request #${bookingRef}`}
      </Preview>

      <Body
        style={{
          margin: 0,
          padding: "24px",
          backgroundColor: "#f4f6f8",
          fontFamily: "Arial, Helvetica, sans-serif",
          color: "#24313d",
        }}
      >
        <Container
          style={{
            maxWidth: "640px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <Section
            style={{
              backgroundColor: "#003d68",
              padding: "28px",
              textAlign: "center",
            }}
          >
            <Heading
              as="h1"
              style={{
                margin: 0,
                fontSize: "25px",
                color: "#ffffff",
              }}
            >
              Arctic Dream Tours
            </Heading>

            <Text
              style={{
                margin: "12px 0 0",
                color: "#a8e6cf",
                fontSize: "13px",
                letterSpacing: "1px",
              }}
            >
              {paid ? "BOOKING CONFIRMED" : "BOOKING REQUEST RECEIVED"}
            </Text>
          </Section>

          <Section style={{ padding: "28px" }}>
            <Heading
              as="h2"
              style={{ color: "#003d68", fontSize: "23px" }}
            >
              {paid
                ? "Your Lapland adventure is booked!"
                : "Thank you for your booking request!"}
            </Heading>

            <Text>Hi {customerName},</Text>

            <Text style={{ lineHeight: "1.7" }}>
              {paid
                ? `Thank you for booking ${activityName} with Arctic Dream Tours. Your payment has been received. We look forward to welcoming you to Lapland!`
                : `Thank you for choosing ${activityName}. We have received your booking request and will follow up with you regarding its confirmation.`}
            </Text>

            <Section
              style={{
                backgroundColor: "#f4f8f7",
                padding: "18px",
                borderRadius: "8px",
                margin: "24px 0",
              }}
            >
              <Heading
                as="h3"
                style={{
                  marginTop: 0,
                  color: "#003d68",
                  fontSize: "18px",
                }}
              >
                Booking details
              </Heading>

              <Text>
                <strong>Reference:</strong> {bookingRef}
              </Text>
              <Text>
                <strong>Activity:</strong> {activityName}
              </Text>
              <Text>
                <strong>Date:</strong> {date}
              </Text>
              <Text>
                <strong>Departure:</strong> {time}
              </Text>
              <Text>
                <strong>Adults:</strong> {adults}
              </Text>
              <Text>
                <strong>Children:</strong> {numChildren}
              </Text>
              <Text>
                <strong>Tour type:</strong>{" "}
                {isPrivate ? "Private tour" : "Shared tour"}
              </Text>
              <Text>
                <strong>Status:</strong> {status}
              </Text>
            </Section>

            <Heading
              as="h3"
              style={{ color: "#003d68", fontSize: "18px" }}
            >
              Pickup and drop-off
            </Heading>

            <Text>
              <strong>Pickup:</strong> {pickUpLocation}
            </Text>
            <Text>
              <strong>Drop-off:</strong> {dropOffLocation}
            </Text>

            <Hr
              style={{
                borderColor: "#95b4aa",
                borderWidth: "1px",
                margin: "24px 0",
              }}
            />

            <Section>
              <Text
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#003d68",
                }}
              >
                Total {paid ? "paid" : "price"}: {formatPrice(totalPrice)}
              </Text>
            </Section>

            <Text style={{ marginTop: "28px", lineHeight: "1.7" }}>
              Thank you for choosing Arctic Dream Tours. We wish you an
              unforgettable Arctic experience!
            </Text>

            <Text style={{ lineHeight: "1.7" }}>
              If you have any questions or need assistance, contact our
              support team at{" "}
              <a
                href="mailto:support@arcticdreamtours.com"
                style={{ color: "#003d68", fontWeight: "bold" }}
              >
                support@arcticdreamtours.com
              </a>
              .
            </Text>
          </Section>

          <Section
            style={{
              padding: "18px",
              textAlign: "center",
              backgroundColor: "#f4f6f8",
            }}
          >
            <Text style={{ color: "#667085", fontSize: "12px", margin: 0 }}>
              Arctic Dream Tours
            </Text>
            <Text style={{ fontSize: "12px", margin: "8px 0 0" }}>
              <a
                href="mailto:support@arcticdreamtours.com"
                style={{ color: "#003d68", textDecoration: "none" }}
              >
                support@arcticdreamtours.com
              </a>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};
