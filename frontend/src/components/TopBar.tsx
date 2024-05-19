import * as React from "react";
import { ModeToggle } from "./theme-toggle";
import { LanguagePicker } from "./language-switcher";
import { useTranslations } from "next-intl";

const TopBar = () => {
  const t = useTranslations();

  return (
    <div
      className="flex justify-between items-center px-4 py-2 bg-gray-200"
      style={{ height: "40px" }}
    >
      <div>
        {/* Language Selection */}
        <LanguagePicker />
      </div>
      <div>
        <i>{t("promoMessage")}</i>
      </div>
      <div>
        {/* Text in the middle */}
        <ModeToggle />
      </div>
    </div>
  );
};

export default TopBar;
