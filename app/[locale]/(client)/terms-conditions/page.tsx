"use client";

import { useTranslations } from "next-intl";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";

export default function TermsAndConditionsPage() {
  const t = useTranslations("terms");

  const sections = [
    {
      title: t("section1_title"),
      content: t("section1_content"),
    },
    {
      title: t("section2_title"),
      content: t("section2_content"),
    },
    {
      title: t("section3_title"),
      content: t("section3_content"),
    },
    {
      title: t("section4_title"),
      content: t("section4_content"),
    },
    {
      title: t("section5_title"),
      content: t("section5_content"),
    },
    {
      title: t("section6_title"),
      content: t("section6_content"),
    },
  ];

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
                    {t("home")}
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
            <p className="text-muted-foreground text-lg">{t("lastUpdated")}</p>
          </div>
        </div>

        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="prose prose-gray max-w-none dark:prose-invert">
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  {t("intro")}
                </p>

                {sections.map((section, index) => (
                  <section key={index} className="mb-8">
                    <h2 className="text-2xl font-semibold text-foreground mb-4 border-b pb-2">
                      {section.title}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {section.content}
                    </p>
                  </section>
                ))}

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
                    {t("lastUpdated")}
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
