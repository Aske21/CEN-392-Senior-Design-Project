"use client";

import React from "react";
import useDisclosure from "@/hooks/useDisclossure";
import NextLink from "next/link";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { useLocale, useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import { selectCartTotalItems } from "@/lib/features/cart/cartSelectors";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./theme-toggle";

const Header = () => {
  const t = useTranslations("Common");
  const { isOpen, onToggle } = useDisclosure();
  const locale = useLocale();
  const totalCartItems = useSelector(selectCartTotalItems);
  const pathname = usePathname();

  const routes = [
    { name: t("products"), path: "/products" },
    { name: t("about"), path: "/about" },
    { name: t("contact"), path: "/contact" },
    { name: t("cart"), path: "/cart" },
  ];

  return (
    <div className="relative z-10 border-b py-4 bg-gray-50">
      <div className="container mx-auto flex justify-between items-center">
        <NextLink href="/" locale={locale}>
          <span>ShoppyDev</span>
        </NextLink>
        <div className="md:hidden">
          {isOpen ? (
            <FaTimes className="text-gray-600" onClick={onToggle} />
          ) : (
            <FaBars className="text-gray-600" onClick={onToggle} />
          )}
        </div>
        <nav
          className={`md:flex md:space-x-4 items-center ${
            isOpen ? "block" : "hidden"
          } `}
        >
          {routes.map((route, index) => (
            <>
              <NextLink
                key={index}
                href={`/${locale}/${route.path}`}
                locale={locale}
                onClick={(e) => route.path === pathname && e.preventDefault()}
                className={`${
                  `/${locale}${route.path}` === pathname
                    ? "underline decoration-slate-900 decoration-2 underline-offset-4"
                    : ""
                }`}
              >
                {route.name !== t("cart") ? (
                  route.name
                ) : (
                  <span>
                    <div className="relative">
                      <div className="relative py-2">
                        <div className="t-0 absolute left-3">
                          {totalCartItems > 0 && (
                            <p className="flex h-0.5 w-0.5 items-center justify-center rounded-full bg-red-500 p-2 text-xs text-white">
                              {totalCartItems}{" "}
                            </p>
                          )}
                        </div>
                        <FaShoppingCart />
                      </div>
                    </div>
                  </span>
                )}
              </NextLink>
            </>
          ))}
          {/* <ModeToggle /> */}
        </nav>
      </div>
    </div>
  );
};

export default Header;
