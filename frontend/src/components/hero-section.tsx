"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "./ui/button";

const HeroSection = () => {
  const t = useTranslations("Landing");
  const locale = useLocale();

  return (
    <section className="relative overflow-hidden rounded-2xl border border-border px-6 py-20 md:py-28">
      <div
        className="pointer-events-none absolute inset-0 animate-gradient-shift bg-gradient-to-br from-gray-200 via-white to-gray-300 bg-[length:200%_200%] motion-reduce:animate-none dark:from-gray-800 dark:via-black dark:to-gray-700"
        aria-hidden
      />
      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <p className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
          {t("heroEyebrow")}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
          {t("hero")}
          <span
            aria-hidden
            className="ml-1 inline-block h-[0.85em] w-[3px] translate-y-[0.08em] animate-cursor-blink bg-foreground motion-reduce:animate-none motion-reduce:opacity-100"
          />
        </h1>
        <p className="mt-4 text-lg text-muted-foreground md:text-xl">
          {t("hero_description")}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href={`/${locale}/products`}>{t("hero_cta")}</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="bg-background">
            <Link href={`/${locale}/about`}>{t("hero_secondary_cta")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
