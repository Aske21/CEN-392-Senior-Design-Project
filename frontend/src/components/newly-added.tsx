"use client";

import Link from "next/link";
import { Product } from "@/@types/product";
import ProductCard from "./product-card";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "./ui/button";

type Props = {
  data: Product[];
};

const NewlyAdded = ({ data }: Props) => {
  const t = useTranslations("Landing.newArrivals");
  const locale = useLocale();

  if (!data.length) {
    return null;
  }

  return (
    <section className="py-16 md:py-20">
      <div className="mb-10 flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-end">
        <div className="space-y-2 text-center sm:text-left">
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            {t("eyebrow")}
          </p>
          <h2 className="text-3xl font-semibold tracking-tight">{t("title")}</h2>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Button asChild variant="outline" className="bg-background shrink-0">
          <Link href={`/${locale}/products`}>{t("viewAll")}</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id as unknown as string}
            title={product.name}
            description={product.description}
            price={parseInt(product.price)}
            imageSrc={product.images[0] as string}
          />
        ))}
      </div>
    </section>
  );
};

export default NewlyAdded;
