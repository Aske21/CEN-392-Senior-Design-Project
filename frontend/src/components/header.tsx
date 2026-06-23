"use client";

import { useRef, useState } from "react";
import { selectCartTotalItems } from "@/lib/features/cart/cartSelectors";
import { useAppSelector } from "@/lib/hooks";
import {
  selectAuthUser,
  selectIsAuthenticated,
} from "@/lib/features/auth/authSelectors";
import { useLocale, useTranslations } from "next-intl";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { FaBars, FaShoppingCart } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import SlideSidebar, {
  SIDEBAR_NAV_LIST_CLASS,
  sidebarNavLinkClassName,
} from "@/components/slide-sidebar";
import UserMenu from "@/components/user-menu";

const Header = () => {
  const t = useTranslations("Common");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const locale = useLocale();
  const totalCartItems = useAppSelector(selectCartTotalItems);
  const user = useAppSelector(selectAuthUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const pathname = usePathname();

  const routes = [
    { name: t("products"), path: "/products" },
    { name: t("about"), path: "/about" },
    { name: t("contact"), path: "/contact" },
    { name: t("cart"), path: "/cart" },
    ...(user?.user_type === "admin" ? [{ name: t("admin"), path: "/admin" }] : []),
  ];

  const sidebarRoutes = routes.filter((route) => route.path !== "/cart");

  const isRouteActive = (path: string) => pathname === `/${locale}${path}`;

  const closeSidebar = () => setSidebarOpen(false);

  const renderDesktopRouteContent = (route: { name: string; path: string }) => {
    const isCart = route.name === t("cart");

    if (isCart) {
      return (
        <span className="relative inline-flex">
          <FaShoppingCart />
          {totalCartItems > 0 && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {totalCartItems}
            </span>
          )}
        </span>
      );
    }

    return route.name;
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-background shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <NextLink
              href="/"
              locale={locale}
              className="text-xl font-semibold tracking-tight transition-opacity hover:opacity-80 md:text-2xl lg:text-3xl"
            >
              ShoppyDev
            </NextLink>

            <nav className="hidden items-center gap-4 md:flex">
              {routes.map((route) => (
                <NextLink
                  key={route.path}
                  href={route.path}
                  locale={locale}
                  className={
                    isRouteActive(route.path)
                      ? "underline decoration-foreground decoration-2 underline-offset-4"
                      : ""
                  }
                >
                  {renderDesktopRouteContent(route)}
                </NextLink>
              ))}
              <UserMenu />
            </nav>

            <div className="flex items-center gap-1 md:hidden">
              <NextLink
                href="/cart"
                locale={locale}
                aria-label={t("cart")}
                className={
                  isRouteActive("/cart")
                    ? "underline decoration-foreground decoration-2 underline-offset-4"
                    : ""
                }
              >
                <Button variant="ghost" size="icon" className="relative">
                  <FaShoppingCart className="h-5 w-5" />
                  {totalCartItems > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                      {totalCartItems}
                    </span>
                  )}
                </Button>
              </NextLink>

              <Button
                ref={menuButtonRef}
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                aria-label={t("openMenu")}
                aria-expanded={sidebarOpen}
                aria-controls="mobile-nav"
              >
                <FaBars className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <SlideSidebar
        open={sidebarOpen}
        onClose={closeSidebar}
        side="right"
        returnFocusRef={menuButtonRef}
        header={
          <NextLink
            href="/"
            locale={locale}
            onClick={closeSidebar}
            className="min-w-0 flex-1"
          >
            <div className="rounded-2xl bg-muted p-4">
              <span className="text-2xl font-semibold text-foreground">ShoppyDev</span>
            </div>
          </NextLink>
        }
        footer={
          isAuthenticated ? <UserMenu showName /> : undefined
        }
      >
        <ul className={SIDEBAR_NAV_LIST_CLASS}>
          {sidebarRoutes.map((route) => (
            <li key={route.path}>
              <NextLink
                href={route.path}
                locale={locale}
                onClick={closeSidebar}
                className={sidebarNavLinkClassName(isRouteActive(route.path))}
              >
                {route.name}
              </NextLink>
            </li>
          ))}
        </ul>
      </SlideSidebar>
    </>
  );
};

export default Header;
