"use client";

import React, { useState } from "react";
import Link from "next/link";
import AdminGuard from "@/components/admin/AdminGuard";
import { Button } from "@/components/ui/button";
import { FiMenu, FiX } from "react-icons/fi";

export default function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <AdminGuard locale={locale} />
      <div className="min-h-screen flex bg-slate-100">
        {/* Mobile menu overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-slate-200 bg-white p-6 shadow-sm transition-transform duration-300 ease-in-out lg:relative lg:transform-none ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="mb-8 flex items-center justify-between lg:block">
            <div className="rounded-2xl bg-slate-50 p-4 flex-1">
              <h2 className="text-2xl font-semibold">Admin Panel</h2>
              <p className="mt-1 text-sm text-slate-500">
                Your control center.
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden ml-2"
              onClick={() => setSidebarOpen(false)}
            >
              <FiX className="h-5 w-5" />
            </Button>
          </div>

          <nav>
            <ul className="space-y-2 text-sm text-slate-700">
              {[
                { label: "Dashboard", href: `/${locale}/admin` },
                { label: "Products", href: `/${locale}/admin/products` },
                { label: "Categories", href: `/${locale}/admin/categories` },
                { label: "Users", href: `/${locale}/admin/users` },
                { label: "Orders", href: `/${locale}/admin/orders` },
                { label: "Discounts", href: `/${locale}/admin/discounts` },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block rounded-lg px-3 py-2 transition hover:bg-slate-50 hover:text-slate-900"
                    onClick={() => setSidebarOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 flex flex-col">
          {/* Mobile header */}
          <div className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white p-4 lg:hidden">
            <h1 className="text-xl font-semibold text-slate-900">Admin</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
            >
              <FiMenu className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
