"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ModeToggle } from "@/components/theme-toggle";
import LoginForm from "@/components/login-form";

export default function AdminLoginView() {
  const t = useTranslations("Admin.login");
  const locale = useLocale();

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-muted via-background to-background"
        aria-hidden
      />

      <header className="relative z-10 flex items-center justify-between px-6 py-5">
        <Link
          href={`/${locale}`}
          className="text-lg font-semibold tracking-tight transition-opacity hover:opacity-80"
        >
          ShoppyDev
        </Link>
        <ModeToggle />
      </header>

      <main className="relative z-10 flex min-h-[calc(100vh-4.5rem)] items-center justify-center px-4 pb-12">
        <div className="w-full max-w-[400px]">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <div className="mb-8 space-y-3 text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground">
                S
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight">
                  {t("title")}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {t("description")}
                </p>
              </div>
            </div>

            <LoginForm adminLogin />
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link
              href={`/${locale}`}
              className="font-medium text-foreground underline-offset-4 transition-colors hover:underline"
            >
              {t("backToStore")}
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
