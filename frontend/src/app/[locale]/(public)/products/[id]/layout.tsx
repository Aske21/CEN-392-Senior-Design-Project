import type { Metadata } from "next";
import {
  createMetadata,
  fetchProductForMetadata,
} from "@/lib/metadata";

type LayoutProps = {
  children: React.ReactNode;
  params: { locale: string; id: string };
};

export async function generateMetadata({
  params,
}: LayoutProps): Promise<Metadata> {
  const product = await fetchProductForMetadata(params.id);

  if (product?.name) {
    return createMetadata(params.locale, "productDetail", {
      name: product.name,
    });
  }

  return createMetadata(params.locale, "products");
}

export default function ProductDetailLayout({ children }: LayoutProps) {
  return children;
}
