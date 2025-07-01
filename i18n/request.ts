import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
    const requested = await requestLocale;
    const locale = hasLocale(routing.locales, requested)
        ? requested
        : routing.defaultLocale;

    const [commonMessages, signupMessages] = await Promise.all([
        import(`@/messages/${locale}/common.json`).then((m) => m.default),
        import(`@/messages/${locale}/signup.json`).then((m) => m.default),
    ]);

    return {
        locale,
        messages: {
            ...commonMessages,
            ...signupMessages,
        },
    };
});
