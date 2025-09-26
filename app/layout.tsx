import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import Providers from "./providers/Providers";
import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://arcticdreamtours.com"),
  title: {
    default: "Arctic Dream Tours",
    template: "%s | Arctic Dream Tours",
  },
  description:
    "Discover the magic of the Arctic through our tours and activities.",
  keywords: [
    "Arctic Dream Tours",
    "Lapland tours",
    "Lapland activities",
    "things to do in Lapland",
    "Northern Lights tours",
    "reindeer safari Lapland",
    "husky sledding Lapland",
    "snowmobile tours Lapland",
    "Lapland winter adventures",
    "Santa Claus village tours",
    "Lapland holiday packages",
    "Aurora Borealis trips",
    "Lapland travel agency",
    "family activities Lapland",
    "Lapland adventure tours",
  ],
  openGraph: {
    title: "Arctic Dream Tours",
    description:
      "Discover the magic of the Arctic through our tours and activities.",
    url: "https://arcticdreamtours.com",
    siteName: "Arctic Dream Tours",
    images: [
      {
        url: "https://arcticdreamtours.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Arctic Dream Tours",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arctic Dream Tours",
    description:
      "Discover the magic of the Arctic through our tours and activities.",
    images: ["https://arcticdreamtours.com/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="h-full min-h-screen">
        <Providers>
          <Toaster position="top-right" />
          {children}
        </Providers>
      </body>
    </html>
  );
}
