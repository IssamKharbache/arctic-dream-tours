export function isoToNormalDate(isoString: string, locale = "en-GB") {
    const date = new Date(isoString);
    return date.toLocaleDateString(locale, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}
