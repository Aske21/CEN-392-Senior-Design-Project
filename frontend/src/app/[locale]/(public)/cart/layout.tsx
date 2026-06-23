import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

type LayoutProps = {
  children: React.ReactNode;
  params: { locale: string };
};

export async function generateMetadata({
  params,
}: LayoutProps): Promise<Metadata> {
  return createMetadata(params.locale, "cart");
}

export default function CartLayout({ children }: LayoutProps) {
  return children;
}
