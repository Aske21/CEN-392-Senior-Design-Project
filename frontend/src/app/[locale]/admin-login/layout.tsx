import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

type AdminLoginLayoutProps = {
  children: React.ReactNode;
  params: { locale: string };
};

export async function generateMetadata({
  params,
}: AdminLoginLayoutProps): Promise<Metadata> {
  return createMetadata(params.locale, "adminLogin");
}

export default function AdminLoginLayout({ children }: AdminLoginLayoutProps) {
  return children;
}
