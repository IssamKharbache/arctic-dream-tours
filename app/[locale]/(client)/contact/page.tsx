import { getTranslations } from "next-intl/server";

const page = async () => {
    const t = await getTranslations("ContactPage");

    return <div>{t("header")}</div>;
};

export default page;
