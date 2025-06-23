import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
    locales: ["en", "fr", "de"],
    defaultLocale: "en",
    pathnames: {
        "/contact": {
            en: "/contact",
            fr: "/contactez-nous",
            de: "/kontakt",
        },
    },
});

export type LocaleType = keyof typeof localeMeta;

export const localeMeta = {
    en: { label: "English", flag: "🇺🇸" },
    fr: { label: "Français", flag: "🇫🇷" },
    de: { label: "Deutsch", flag: "🇩🇪" },
};
