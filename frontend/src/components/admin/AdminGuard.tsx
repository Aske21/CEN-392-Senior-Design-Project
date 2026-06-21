"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import { selectAuthUser } from "@/lib/features/auth/authSelectors";

interface Props {
  locale: string;
}

export default function AdminGuard({ locale }: Props) {
  const router = useRouter();
  const user = useAppSelector(selectAuthUser);
  const initialized = useAppSelector((state) => state.auth.initialized);

  useEffect(() => {
    if (!initialized) {
      return;
    }

    if (!user) {
      router.push(`/${locale}/admin-login`);
      return;
    }

    if (user.user_type !== "admin") {
      router.push(`/${locale}`);
    }
  }, [user, initialized, router, locale]);

  return <>{/* Layout renders children */}</>;
}
