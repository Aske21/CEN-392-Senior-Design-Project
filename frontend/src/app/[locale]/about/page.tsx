"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AboutPage = () => {
  const t = useTranslations("About");

  return (
    <div className="py-12 md:py-16 lg:py-20">
      {/* Hero Section */}
      <div className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
          {t("title")}
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          {t("subtitle")}
        </p>
      </div>

      {/* Mission Section */}
      <section className="mb-12 md:mb-16">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl">{t("mission.title")}</CardTitle>
            <CardDescription className="text-base md:text-lg">
              {t("mission.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {t("mission.content")}
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Values Section */}
      <section className="mb-12 md:mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">
          {t("values.title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>{t("values.quality.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{t("values.quality.description")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t("values.customer.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{t("values.customer.description")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t("values.innovation.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{t("values.innovation.description")}</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Story Section */}
      <section className="mb-12 md:mb-16">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl">{t("story.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>{t("story.paragraph1")}</p>
              <p>{t("story.paragraph2")}</p>
              <p>{t("story.paragraph3")}</p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Why Choose Us Section */}
      <section>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">
          {t("whyChooseUs.title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>{t("whyChooseUs.wideSelection.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t("whyChooseUs.wideSelection.description")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t("whyChooseUs.competitivePrices.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t("whyChooseUs.competitivePrices.description")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t("whyChooseUs.excellentService.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t("whyChooseUs.excellentService.description")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t("whyChooseUs.fastShipping.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t("whyChooseUs.fastShipping.description")}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
