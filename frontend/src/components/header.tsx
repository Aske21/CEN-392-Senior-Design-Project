"use client";

import React from "react";
import useDisclosure from "@/hooks/useDisclossure";
import Link from "next/link";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { useLocale, useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import { selectCartTotalItems } from "@/lib/features/cart/cartSelectors";

const Header = () => {
  const t = useTranslations("Common");
  const locale = useLocale();
  const { isOpen, onToggle } = useDisclosure();

  const totalCartItems = useSelector(selectCartTotalItems);

  return (
    <div className="relative z-10 border-b py-4 bg-gray-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">ShoppyDev</Link>
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
          <Link href={`${locale}/products`}>{t("products")}</Link>
          <Link href="/">{t("about")}</Link>
          <Link href="/">{t("contact")}</Link>
          <Link href="/">
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
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Header;
