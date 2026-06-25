"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import AdminGuard from "@/components/admin/AdminGuard";
import { Button } from "@/components/ui/button";
import SlideSidebar, {
  SIDEBAR_NAV_LIST_CLASS,
  sidebarNavLinkClassName,
} from "@/components/slide-sidebar";
import UserMenu from "@/components/user-menu";
import { FiArrowLeft, FiMenu } from "react-icons/fi";
import { useTranslations } from "next-intl";
import { ModeToggle } from "@/components/theme-toggle";
import { LanguagePicker } from "@/components/language-switcher";

export default function AdminLayoutClient({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  const t = useTranslations("Admin.layout");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const closeSidebar = () => setSidebarOpen(false);
  const storeHref = `/${locale}`;

  const navItems = [
    { label: t("dashboard"), href: `/${locale}/admin` },
    { label: t("products"), href: `/${locale}/admin/products` },
    { label: t("inventory"), href: `/${locale}/admin/inventory` },
    { label: t("categories"), href: `/${locale}/admin/categories` },
    { label: t("users"), href: `/${locale}/admin/users` },
    { label: t("orders"), href: `/${locale}/admin/orders` },
    { label: t("discounts"), href: `/${locale}/admin/discounts` },
  ];

  return (
    <>
      <AdminGuard locale={locale} />
      <div className="flex min-h-screen overflow-x-hidden bg-muted">
        <SlideSidebar
          open={sidebarOpen}
          onClose={closeSidebar}
          persistent
          returnFocusRef={menuButtonRef}
          header={
            <Link
              href={storeHref}
              onClick={closeSidebar}
              className="min-w-0 flex-1 text-lg font-semibold tracking-tight transition-opacity hover:opacity-80"
            >
              ShoppyDev
            </Link>
          }
          footer={
            <div className="space-y-4">
              <Link
                href={storeHref}
                className={`${sidebarNavLinkClassName()} flex items-center gap-2`}
                onClick={closeSidebar}
              >
                <FiArrowLeft className="h-4 w-4 shrink-0" />
                {t("backToStore")}
              </Link>
              <UserMenu showName showProfileLink={false} />
            </div>
          }
        >
          <div className="mb-6 hidden lg:block">
            <Link
              href={storeHref}
              className="text-lg font-semibold tracking-tight transition-opacity hover:opacity-80"
            >
              ShoppyDev
            </Link>
            <p className="mt-1 text-xs text-muted-foreground">{t("title")}</p>
          </div>

          <ul className={SIDEBAR_NAV_LIST_CLASS}>
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={sidebarNavLinkClassName()}
                  onClick={closeSidebar}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </SlideSidebar>

        <main className="flex min-w-0 flex-1 flex-col">
          <div className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-background p-4">
            <Link
              href={storeHref}
              className="flex min-w-0 items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground lg:hidden"
            >
              <FiArrowLeft className="h-4 w-4 shrink-0" />
              <span className="truncate">{t("backToStore")}</span>
            </Link>
            <h1 className="shrink-0 text-lg font-semibold text-foreground lg:hidden">
              {t("title")}
            </h1>
            <div className="hidden flex-1 lg:block" />
            <div className="flex items-center gap-1">
              <LanguagePicker />
              <ModeToggle />
              <Button
                ref={menuButtonRef}
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="shrink-0 lg:hidden"
                aria-expanded={sidebarOpen}
              >
                <FiMenu className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="min-w-0 flex-1 overflow-auto p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
