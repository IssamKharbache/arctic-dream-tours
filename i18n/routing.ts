import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
    // A list of all locales that are supported
    locales: ["en", "fr"],

    // Used when no locale matches
    defaultLocale: "en",
    pathnames: {
        "/contact": {
            en: "/contact",
            fr: "/contactez-nous",
        },
    },
});
export type LocaleType = keyof typeof localeMeta;
// Add this for flags and labels
export const localeMeta = {
    en: { label: "English", flag: "🇺🇸" },
    fr: { label: "Français", flag: "🇫🇷" },
};
