import { useTranslations } from "next-intl";
import React from "react";

const Footer = () => {
  const t = useTranslations("Footer");
  return (
    <footer className="py-6 z-10 border-b">
      <div className="container mx-auto flex flex-col items-center justify-between px-4 md:flex-row">
        <div className="mb-4 md:mb-0">
          <h3 className="text-lg font-semibold">ShoppyDev</h3>
          <p className="text-sm">{t("eCommercePlatform")}</p>
        </div>
        <div>
          <p className="text-sm">
            &copy; {new Date().getFullYear()} @{t("author")} Asim Veldarevic
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
