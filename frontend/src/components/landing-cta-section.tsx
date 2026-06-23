"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "./ui/button";

const LandingCtaSection = () => {
  const t = useTranslations("Landing.cta");
  const locale = useLocale();

  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-muted/40 px-6 py-12 text-center md:px-12">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          {t("title")}
        </h2>
        <p className="mt-3 text-muted-foreground">{t("subtitle")}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href={`/${locale}/products`}>{t("primary")}</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="bg-background">
            <Link href={`/${locale}/login`}>{t("secondary")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LandingCtaSection;
