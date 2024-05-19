// components/HeroSection.tsx
import { useTranslations } from "next-intl";
import React from "react";

const HeroSection = () => {
  const t = useTranslations("Landing");

  return (
    <section className="relative bg-cover bg-center h-[600px] ">
      <div className="absolute inset-0"></div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
        <h1 className="text-5xl font-bold mb-4"> {t("hero")}</h1>
        <p className="text-xl mb-8">{t("hero_description")}</p>
        <a
          href="#categories"
          className="px-8 py-4 bg-primary text-white rounded-full"
        >
          {t("hero_cta")}
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
