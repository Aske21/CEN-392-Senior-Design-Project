"use client";

import useDisclosure from "@/hooks/useDisclossure";
import { selectCartTotalItems } from "@/lib/features/cart/cartSelectors";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import {
  selectIsAuthenticated,
  selectAuthUser,
} from "@/lib/features/auth/authSelectors";
import { logout } from "@/lib/features/auth/authSlice";
import { useLocale, useTranslations } from "next-intl";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaBars, FaShoppingCart, FaTimes, FaUser } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const Header = () => {
  const t = useTranslations("Common");
  const { isOpen, onToggle } = useDisclosure();
  const locale = useLocale();
  const router = useRouter();
  const totalCartItems = useAppSelector(selectCartTotalItems);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectAuthUser);
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/auth/logout");
  };

  const routes = [
    { name: t("products"), path: "/products" },
    { name: t("about"), path: "/about" },
    { name: t("contact"), path: "/contact" },
    { name: t("cart"), path: "/cart" },
  ];

  return (
    <header className="sticky top-0 z-50 shadow py-4 bg-background border-b">
      <div className="container mx-auto flex justify-between items-center">
        <NextLink href="/" locale={locale}>
          <span>ShoppyDev</span>
        </NextLink>
        <nav className="hidden md:flex md:space-x-4 items-center">
          {routes.map((route, index) => (
            <NextLink
              key={index}
              href={`${route.path}`}
              locale={locale}
              onClick={(e) => route.path === pathname && e.preventDefault()}
              className={`${
                `/${locale}${route.path}` === pathname
                  ? "underline decoration-slate-900 decoration-2 underline-offset-4"
                  : ""
              }`}
            >
              <span>
                <div className="relative">
                  <div className="relative py-2">
                    <div className="t-0 absolute left-3">
                      {route.name === t("cart") && totalCartItems > 0 && (
                        <p className="flex h-0.5 w-0.5 items-center justify-center rounded-full bg-red-500 p-2 text-xs text-white">
                          {totalCartItems}{" "}
                        </p>
                      )}
                    </div>
                    {route.name !== t("cart") ? route.name : <FaShoppingCart />}
                  </div>
                </div>
              </span>
            </NextLink>
          ))}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <div className="flex items-center justify-center h-full w-full rounded-full bg-primary text-primary-foreground">
                    <span className="text-sm font-medium">
                      {user?.username?.[0]?.toUpperCase() || "U"}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.username || "User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <NextLink href="/profile" locale={locale}>
                    {t("profile")}
                  </NextLink>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  {t("logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <NextLink href="/login" locale={locale}>
              <Button variant="ghost" size="icon">
                <FaUser />
              </Button>
            </NextLink>
          )}
        </nav>
        <div className="md:hidden">
          {isOpen ? (
            <FaTimes className="text-gray-600" onClick={onToggle} />
          ) : (
            <FaBars
              className="text-gray-600"
              onClick={() => {
                onToggle();
              }}
            />
          )}
        </div>
        {isOpen && (
          <nav className="md:hidden absolute top-full left-0 w-full z-50 bg-background border-t">
            <ul className="flex flex-col items-center">
              {routes.map((route, index) => (
                <li key={index} className="py-2">
                  <NextLink
                    href={`${route.path}`}
                    locale={locale}
                    onClick={(e) =>
                      route.path === pathname && e.preventDefault()
                    }
                    className={`${
                      `/${locale}${route.path}` === pathname
                        ? "underline decoration-slate-900 decoration-2 underline-offset-4"
                        : ""
                    }`}
                  >
                    <span>
                      <div className="relative">
                        <div className="relative py-2">
                          <div className="t-0 absolute left-3">
                            {route.name === t("cart") && totalCartItems > 0 && (
                              <p className="flex h-0.5 w-0.5 items-center justify-center rounded-full bg-red-500 p-2 text-xs text-white">
                                {totalCartItems}{" "}
                              </p>
                            )}
                          </div>
                          {route.name !== t("cart") ? (
                            route.name
                          ) : (
                            <FaShoppingCart />
                          )}
                        </div>
                      </div>
                    </span>
                  </NextLink>
                </li>
              ))}
              <li className="py-2">
                {isAuthenticated ? (
                  <div className="flex flex-col items-center space-y-2">
                    <div className="text-sm font-medium">
                      {user?.username || "User"}
                    </div>
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                      {t("logout")}
                    </Button>
                  </div>
                ) : (
                  <NextLink href="/login" locale={locale}>
                    <Button variant="ghost" size="sm">
                      <FaUser className="mr-2" />
                      {t("login")}
                    </Button>
                  </NextLink>
                )}
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
