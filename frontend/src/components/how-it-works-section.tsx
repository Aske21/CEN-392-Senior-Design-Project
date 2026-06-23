"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "./ui/button";

const HowItWorksSection = () => {
  const t = useTranslations("Landing.howItWorks");
  const locale = useLocale();

  const steps = [
    {
      step: "01",
      title: t("steps.browse.title"),
      description: t("steps.browse.description"),
    },
    {
      step: "02",
      title: t("steps.cart.title"),
      description: t("steps.cart.description"),
    },
    {
      step: "03",
      title: t("steps.checkout.title"),
      description: t("steps.checkout.description"),
    },
  ];

  return (
    <section className="border-t border-border py-16 md:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 space-y-3 text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            {t("eyebrow")}
          </p>
          <h2 className="text-3xl font-semibold tracking-tight">{t("title")}</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((item) => (
            <div key={item.step} className="text-center md:text-left">
              <span className="text-sm font-medium text-primary">{item.step}</span>
              <h3 className="mt-2 text-lg font-semibold tracking-tight">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button asChild variant="outline" className="bg-background">
            <Link href={`/${locale}/products`}>{t("cta")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
