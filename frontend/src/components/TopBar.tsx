"use client ";
import * as React from "react";
import { ModeToggle } from "./theme-toggle";
import { LanguagePicker } from "./language-switcher";

const TopBar = () => {
  return (
    <div className="flex justify-between items-center px-4 py-2  bg-gray-200">
      <div>
        {/* Language Selection */}
        <LanguagePicker />
        {/* Theme Selection */}
      </div>
      <div>
        {/* Text in the middle */}
        <ModeToggle />
      </div>
    </div>
  );
};

export default TopBar;
