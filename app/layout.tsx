import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import Providers from "./providers/Providers";
import { Metadata } from "next";
import Script from "next/script";

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
          <Script id="fb-pixel" strategy="afterInteractive">
            {`
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${process.env.NEXT_PUBLIC_FB_PIXEL_ID}');
    fbq('track', 'PageView');
  `}
          </Script>

          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_FB_PIXEL_ID}&ev=PageView&noscript=1`}
            />
          </noscript>
          {children}
        </Providers>
      </body>
    </html>
  );
}
