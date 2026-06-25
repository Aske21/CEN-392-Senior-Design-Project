import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export type MetadataPage =
  | "home"
  | "products"
  | "productDetail"
  | "about"
  | "contact"
  | "cart"
  | "login"
  | "profile"
  | "orderSuccess"
  | "authCallback"
  | "authLogout"
  | "admin"
  | "adminProducts"
  | "adminInventory"
  | "adminCategories"
  | "adminUsers"
  | "adminOrders"
  | "adminDiscounts"
  | "adminLogin";

type MetadataParams = Record<string, string | number | Date>;

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export async function createMetadata(
  locale: string,
  page: MetadataPage,
  params?: MetadataParams,
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "Metadata" });

  const title = t(`pages.${page}`, params);
  const description = t(`descriptions.${page}`, params);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: t("siteName"),
      type: "website",
      locale: locale === "de" ? "de_DE" : "en_US",
    },
  };
}

export async function createRootMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: t("defaultTitle"),
      template: `%s | ${t("siteName")}`,
    },
    description: t("defaultDescription"),
    applicationName: t("siteName"),
    openGraph: {
      siteName: t("siteName"),
      type: "website",
      locale: locale === "de" ? "de_DE" : "en_US",
    },
  };
}

export async function fetchProductForMetadata(id: string) {
  const baseUrl = process.env.NEXT_API_URL;
  if (!baseUrl) {
    return null;
  }

  try {
    const response = await fetch(`${baseUrl}/product/${id}`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as { name: string; description?: string };
  } catch {
    return null;
  }
}
