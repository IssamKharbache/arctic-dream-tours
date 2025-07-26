import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";
import { Quicksand } from "next/font/google";

const quickSand = Quicksand({
    subsets: ["latin"],
    display: "swap",
});

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    // Ensure that the incoming `locale` is valid
    const { locale } = await params;
    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }
    return (
        <NextIntlClientProvider>
            <div className={`${quickSand.className}`}>{children}</div>
        </NextIntlClientProvider>
    );
}
