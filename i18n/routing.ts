import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
    locales: ["en", "fr", "de", "ar", "zh", "ja", "it", "es"],
    defaultLocale: "en",
    localeDetection: false,
    pathnames: {
        "/contact": {
            en: "/contact",
            fr: "/contactez-nous",
            de: "/kontakt",
            ar: "/اتصل-بنا",
            zh: "/联系我们",
            ja: "/お問い合わせ",
            it: "/contattaci",
            es: "/contactanos",
        },
        "/about": {
            en: "/about",
            fr: "/a-propos",
            de: "/uber-uns",
            ar: "/معلومات",
            zh: "/关于我们",
            ja: "/私たちについて",
            it: "/chi-siamo",
            es: "/sobre-nosotros",
        },
        "/": {
            en: "/",
            fr: "/",
            de: "/",
            ar: "/",
            zh: "/",
            ja: "/",
            it: "/",
            es: "/",
        },
    },
});
export type LocaleType = keyof typeof localeMeta;

export const localeMeta = {
    en: { label: "English", flag: "🇺🇸" },
    fr: { label: "Français", flag: "🇫🇷" },
    de: { label: "Deutsch", flag: "🇩🇪" },
    ar: { label: "العربية", flag: "🇸🇦" },
    zh: { label: "中文", flag: "🇨🇳" },
    ja: { label: "日本語", flag: "🇯🇵" },
    it: { label: "Italiano", flag: "🇮🇹" },
    es: { label: "Español", flag: "🇪🇸" },
};
