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
} from "@react-email/components";

interface VerificationEmailProps {
  code: string;
  userEmail?: string;
  companyName?: string;
  expirationTime?: string;
}

export const VerificationEmail = ({
  code,
  userEmail,
  companyName = "Arctic Dream tours",
  expirationTime = "10 minutes",
}: VerificationEmailProps) => (
  <Html>
    <Head />
    <Preview>Your verification code: {code}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoSection}>
          <Heading style={logo}>{companyName}</Heading>
        </Section>

        <Section style={content}>
          <Heading style={h1}>Verify your email address</Heading>

          <Text style={text}>
            {userEmail
              ? `Hi there! We received a request to verify the email address ${userEmail}.`
              : "Hi there! We received a request to verify your email address."}
          </Text>

          <Text style={text}>
            Enter the verification code below to complete the process:
          </Text>

          <Section style={codeContainer}>
            <Text style={codeText}>{code}</Text>
          </Section>

          <Text style={smallText}>
            This code will expire in {expirationTime}. If you didn&apos;t
            request this verification, you can safely ignore this email.
          </Text>

          <Hr style={hr} />

          <Text style={footerText}>
            Need help? Contact our support team at{" "}
            <Link href="mailto:support@arcticdreamtours.com" style={link}>
              support@arcticdreamtours.com
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

// Styles
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

const text = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 16px",
};

const codeContainer = {
  backgroundColor: "#f3f4f6",
  borderRadius: "8px",
  padding: "32px",
  textAlign: "center" as const,
  margin: "32px 0",
  border: "1px solid #e5e7eb",
};

const codeText = {
  color: "#1f2937",
  fontSize: "32px",
  fontWeight: "bold",
  letterSpacing: "8px",
  margin: "0",
  fontFamily: "Monaco, Consolas, 'Courier New', monospace",
};

const smallText = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: "24px 0 0",
  textAlign: "center" as const,
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
