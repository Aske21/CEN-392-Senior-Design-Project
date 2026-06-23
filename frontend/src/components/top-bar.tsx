import * as React from "react";
import { ModeToggle } from "./theme-toggle";
import { LanguagePicker } from "./language-switcher";

const TopBar = () => {
  return (
    <div className="flex h-10 items-center justify-between border-b px-4 py-2">
      <LanguagePicker />
      <ModeToggle />
    </div>
  );
};

export default TopBar;
