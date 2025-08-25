import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
    const requested = await requestLocale;
    const locale = hasLocale(routing.locales, requested)
        ? requested
        : routing.defaultLocale;

    try {
        const [
            commonMessages,
            signupMessages,
            signinMessages,
            heroMessages,
            privacyMessages,
            contactMessages,
        ] = await Promise.all([
            import(`@/messages/${locale}/common.json`)
                .then((m) => m.default)
                .catch(() => ({})),
            import(`@/messages/${locale}/signup.json`)
                .then((m) => m.default)
                .catch(() => ({})),
            import(`@/messages/${locale}/signin.json`)
                .then((m) => m.default)
                .catch(() => ({})),
            import(`@/messages/${locale}/hero.json`)
                .then((m) => m.default)
                .catch(() => ({})),
            import(`@/messages/${locale}/privacy.json`)
                .then((m) => m.default)
                .catch(() => ({})),
            import(`@/messages/${locale}/contact.json`)
                .then((m) => m.default)
                .catch(() => ({})),
        ]);

        return {
            locale,
            messages: {
                ...commonMessages,
                ...signupMessages,
                ...signinMessages,
                hero: heroMessages,
                privacy: privacyMessages,
                contact: contactMessages,
            },
        };
    } catch (error) {
        console.error(`Failed to load messages for locale ${locale}:`, error);

        // fallback to default locale
        const [
            commonMessages,
            signupMessages,
            signinMessages,
            heroMessages,
            privacyMessages,
            contactMessages,
        ] = await Promise.all([
            import(`@/messages/${routing.defaultLocale}/common.json`).then(
                (m) => m.default,
            ),
            import(`@/messages/${routing.defaultLocale}/signup.json`).then(
                (m) => m.default,
            ),
            import(`@/messages/${routing.defaultLocale}/signin.json`).then(
                (m) => m.default,
            ),
            import(`@/messages/${routing.defaultLocale}/hero.json`).then(
                (m) => m.default,
            ),
            import(`@/messages/${routing.defaultLocale}/privacy.json`).then(
                (m) => m.default,
            ),
            import(`@/messages/${routing.defaultLocale}/contact.json`).then(
                (m) => m.default,
            ),
        ]);

        return {
            locale: routing.defaultLocale,
            messages: {
                ...commonMessages,
                ...signupMessages,
                ...signinMessages,
                hero: heroMessages,
                privacy: privacyMessages,
                contact: contactMessages,
            },
        };
    }
});
