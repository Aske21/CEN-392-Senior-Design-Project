"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks";
import { logoutComplete } from "@/lib/features/auth/authSlice";
import { useTranslations } from "next-intl";

export default function LogoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const t = useTranslations("LogoutPage");

  useEffect(() => {
    const performLogout = async () => {
      dispatch(logoutComplete());
      
      if (typeof window !== "undefined") {
        localStorage.removeItem("persist:root");
        
        setTimeout(() => {
          window.location.href = "/";
        }, 500);
      }
    };

    performLogout();
  }, [dispatch, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">{t("title")}</h2>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>
    </div>
  );
}

