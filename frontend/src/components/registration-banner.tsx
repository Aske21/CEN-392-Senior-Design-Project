"use client";

import { useState, useEffect } from "react";
import { useAppSelector } from "@/lib/hooks";
import { selectIsAuthenticated } from "@/lib/features/auth/authSelectors";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { FiX } from "react-icons/fi";

export default function RegistrationBanner() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const t = useTranslations();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      const hasSeenBanner = localStorage.getItem("hasSeenRegistrationBanner");
      if (!hasSeenBanner) {
        setIsVisible(true);
      }
    } else {
      setIsVisible(false);
    }
  }, [isAuthenticated]);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem("hasSeenRegistrationBanner", "true");
  };

  const handleRegister = () => {
    localStorage.setItem("hasSeenRegistrationBanner", "true");
    setIsVisible(false);
  };

  if (!isVisible || isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 text-white py-3 px-4 relative">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex-1 text-center">
          <p className="text-sm md:text-base font-medium">
            {t("promoMessage")}
          </p>
        </div>
        <div className="flex items-center gap-3 ml-4">
          <Link href="/login" onClick={handleRegister}>
            <Button
              variant="secondary"
              size="sm"
              className="bg-white text-blue-600 hover:bg-gray-100 dark:bg-gray-100 dark:text-blue-600 dark:hover:bg-gray-200"
            >
              Register Now
            </Button>
          </Link>
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-200 transition-colors p-1"
            aria-label="Close banner"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
