import type { Metadata } from "next";
import AdminLayoutClient from "./admin-layout-client";
import { createMetadata } from "@/lib/metadata";

type AdminLayoutProps = {
  children: React.ReactNode;
  params: { locale: string };
};

export async function generateMetadata({
  params,
}: AdminLayoutProps): Promise<Metadata> {
  return createMetadata(params.locale, "admin");
}

export default function AdminLayout({ children, params }: AdminLayoutProps) {
  return (
    <AdminLayoutClient locale={params.locale}>{children}</AdminLayoutClient>
  );
}
