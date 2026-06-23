"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Product } from "@/@types/product";
import ProductImage from "@/components/product-image";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import useGetRecommendedProducts from "@/hooks/product/useGetRecommendedProducts";
import { buildProductsHref } from "@/lib/utils/product-filters-url";

type SimilarProductsSectionProps = {
  productId: string;
  categoryId?: number | null;
  categoryLabel?: string | null;
};

function CompactProductCard({
  product,
  locale,
}: {
  product: Product;
  locale: string;
}) {
  const price =
    typeof product.price === "number"
      ? product.price
      : parseFloat(String(product.price));

  return (
    <Link
      href={`/${locale}/products/${product.id}`}
      className="group block h-full"
    >
      <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:bg-accent/30">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <ProductImage
            src={product.images?.[0] || ""}
            alt={product.name}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            fill
          />
        </div>
        <div className="flex flex-1 flex-col p-3">
          <h3 className="line-clamp-2 text-sm font-medium leading-snug tracking-tight">
            {product.name}
          </h3>
          <p className="mt-2 text-sm font-semibold tabular-nums">
            ${Number.isFinite(price) ? price.toFixed(2) : product.price}
          </p>
        </div>
      </article>
    </Link>
  );
}

export function SimilarProductsSection({
  productId,
  categoryId,
  categoryLabel,
}: SimilarProductsSectionProps) {
  const t = useTranslations("ProductPage.similarProducts");
  const locale = useLocale();

  const { data, isLoading } = useGetRecommendedProducts(productId, 12, {
    enabled: !!productId,
  });

  const products =
    data?.filter((product) => String(product.id) !== String(productId)) ?? [];

  if (!isLoading && products.length === 0) {
    return null;
  }

  const categoryHref = categoryId
    ? buildProductsHref(locale, { categoryId })
    : `/${locale}/products`;

  return (
    <section className="mt-12 border-t border-border pt-12 md:mt-16 md:pt-16">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            {t("eyebrow")}
          </p>
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            {t("title")}
          </h2>
          <p className="max-w-xl text-sm text-muted-foreground md:text-base">
            {categoryLabel
              ? t("subtitleWithCategory", { category: categoryLabel })
              : t("subtitle")}
          </p>
        </div>
        {categoryId && (
          <Button asChild variant="outline" className="shrink-0 bg-background">
            <Link href={categoryHref}>{t("viewAll")}</Link>
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="aspect-[3/4] rounded-xl" />
          ))}
        </div>
      ) : (
        <Carousel
          className="w-full"
          opts={{
            align: "start",
            dragFree: true,
          }}
        >
          <CarouselContent className="-ml-3">
            {products.map((product) => (
              <CarouselItem
                key={product.id}
                className="basis-[44%] pl-3 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
              >
                <CompactProductCard product={product} locale={locale} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 hidden sm:flex" />
          <CarouselNext className="right-2 hidden sm:flex" />
        </Carousel>
      )}
    </section>
  );
}
