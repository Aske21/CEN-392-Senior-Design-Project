"use client";

import Link from "next/link";
import React, { useState } from "react";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="relative z-10 border-b py-4 bg-gray-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">Shoppy</Link>
        <div className="md:hidden">
          {isMenuOpen ? (
            <FaTimes className="text-gray-600" onClick={toggleMenu} />
          ) : (
            <FaBars className="text-gray-600" onClick={toggleMenu} />
          )}
        </div>
        <nav
          className={`md:flex md:space-x-4 items-center ${
            isMenuOpen ? "block" : "hidden"
          } `}
        >
          <Link href="/">Products</Link>
          <Link href="/">About</Link>
          <Link href="/">Contact</Link>
          <Link href="/">
            <FaShoppingCart />
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Header;
