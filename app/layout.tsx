import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import Providers from "./providers/Providers";

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
