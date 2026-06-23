import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

type LayoutProps = {
  children: React.ReactNode;
  params: { locale: string };
};

export async function generateMetadata({
  params,
}: LayoutProps): Promise<Metadata> {
  return createMetadata(params.locale, "adminOrders");
}

export default function AdminOrdersLayout({ children }: LayoutProps) {
  return children;
}
