"use client";

import { useTranslations } from "next-intl";

const valueKeys = ["quality", "customer", "innovation"] as const;

const highlightKeys = [
  "wideSelection",
  "competitivePrices",
  "excellentService",
  "fastShipping",
] as const;

const AboutPage = () => {
  const t = useTranslations("About");

  return (
    <div className="py-12 md:py-16 lg:py-20">
      <header className="mx-auto mb-16 max-w-2xl text-center md:mb-20">
        <p className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
          {t("eyebrow")}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-base text-muted-foreground md:text-lg">
          {t("subtitle")}
        </p>
      </header>

      <div className="mx-auto max-w-3xl space-y-16 md:space-y-20">
        <section className="space-y-4">
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            {t("mission.description")}
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">
            {t("mission.title")}
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            {t("mission.content")}
          </p>
        </section>

        <section className="space-y-4 border-t border-border pt-16 md:pt-20">
          <h2 className="text-2xl font-semibold tracking-tight">
            {t("story.title")}
          </h2>
          <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
            <p>{t("story.paragraph1")}</p>
            <p>{t("story.paragraph2")}</p>
            <p>{t("story.paragraph3")}</p>
          </div>
        </section>

        <section className="border-t border-border pt-16 md:pt-20">
          <div className="mb-10 space-y-3">
            <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              {t("values.eyebrow")}
            </p>
            <h2 className="text-2xl font-semibold tracking-tight">
              {t("values.title")}
            </h2>
          </div>

          <ul className="divide-y divide-border">
            {valueKeys.map((key) => (
              <li key={key} className="py-6 first:pt-0 last:pb-0">
                <h3 className="text-base font-semibold tracking-tight">
                  {t(`values.${key}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t(`values.${key}.description`)}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="border-t border-border pt-16 md:pt-20">
          <div className="mb-10 space-y-3">
            <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              {t("whyChooseUs.eyebrow")}
            </p>
            <h2 className="text-2xl font-semibold tracking-tight">
              {t("whyChooseUs.title")}
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {highlightKeys.map((key) => (
              <div key={key} className="space-y-2">
                <h3 className="text-base font-semibold tracking-tight">
                  {t(`whyChooseUs.${key}.title`)}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t(`whyChooseUs.${key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
