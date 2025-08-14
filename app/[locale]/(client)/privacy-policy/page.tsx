"use client";

import { useLocale, useTranslations } from "next-intl";
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
    const t = useTranslations("privacy");
    const locale = useLocale();

    const lastUpdatedLabels: Record<string, string> = {
        en: "Last updated",
        fr: "Dernière mise à jour",
        de: "Zuletzt aktualisiert",
        es: "Última actualización",
        it: "Ultimo aggiornamento",
        ar: "آخر تحديث",
        ch: "最后更新",
        jp: "最終更新日",
    };

    const homeLabels: Record<string, string> = {
        en: "Home",
        fr: "Accueil",
        de: "Startseite",
        es: "Inicio",
        it: "Home",
        ar: "الرئيسية",
        ch: "首页",
        jp: "ホーム",
    };

    const label = lastUpdatedLabels[locale] || lastUpdatedLabels.en;
    const homeLabel = homeLabels[locale] || homeLabels.en;

    // Total number of sections in your JSON
    const totalSections = 6;

    return (
        <div className="min-h-screen bg-background">
            <div className="pt-20">
                <div className="border-b bg-card">
                    <div className="container mx-auto px-4 py-6">
                        <Breadcrumb className="mb-4">
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink
                                        href="/"
                                        className="text-muted-foreground hover:text-foreground"
                                    >
                                        {homeLabel}
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage className="text-foreground font-medium">
                                        {t("title")}
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>

                        <h1 className="text-4xl font-bold text-foreground mb-2">
                            {t("title")}
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            {label}: August 14, 2025
                        </p>
                    </div>
                </div>

                <main className="container mx-auto px-4 py-8">
                    <Card className="max-w-4xl mx-auto">
                        <CardContent className="p-8">
                            <div className="prose prose-gray max-w-none dark:prose-invert">
                                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                                    {t("intro")}
                                </p>

                                {Array.from({ length: totalSections }).map(
                                    (_, index) => {
                                        const sectionNum = index + 1;
                                        return (
                                            <section
                                                key={sectionNum}
                                                className="mb-8"
                                            >
                                                <h2 className="text-2xl font-semibold text-foreground mb-4 border-b pb-2">
                                                    {t(
                                                        `section${sectionNum}Title`,
                                                    )}
                                                </h2>
                                                <p className="text-muted-foreground leading-relaxed">
                                                    {t(
                                                        `section${sectionNum}Content`,
                                                    )}
                                                </p>
                                            </section>
                                        );
                                    },
                                )}

                                <section className="mt-12 pt-8 border-t">
                                    <h2 className="text-2xl font-semibold text-foreground mb-4">
                                        {t("contactTitle")}
                                    </h2>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {t("contactContent")}
                                    </p>
                                </section>

                                <div className="mt-8 pt-6 border-t text-center">
                                    <p className="text-sm text-muted-foreground">
                                        {label}: August 14, 2025
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    );
}
