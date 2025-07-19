import { getTranslations } from "next-intl/server";
export default async function HomePage() {
    const t = await getTranslations("HomePage");
    return (
        <div>
            <h1>{t("header")}</h1>
        </div>
    );
}
