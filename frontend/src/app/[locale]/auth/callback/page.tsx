"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks";
import { setCredentials } from "@/lib/features/auth/authSlice";
import { useTranslations } from "next-intl";

export default function AuthCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const t = useTranslations("AuthCallback");

  useEffect(() => {
    const token = searchParams.get("token");
    const userParam = searchParams.get("user");

    if (token && userParam) {
      try {
        const user = JSON.parse(userParam);
        dispatch(setCredentials({ user, token }));
        router.push("/");
      } catch (error) {
        console.error("Error parsing user data:", error);
        router.push("/login?error=Failed to parse authentication data");
      }
    } else {
      const error = searchParams.get("error") || "Authentication failed";
      router.push(`/login?error=${encodeURIComponent(error)}`);
    }
  }, [searchParams, dispatch, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">{t("title")}</h2>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>
    </div>
  );
}
