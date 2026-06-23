"use client";

import * as React from "react";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import { useLocale, useTranslations } from "next-intl";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Category } from "@/@types/category";
import { buildProductsHref } from "@/lib/utils/product-filters-url";

interface CategoryCarouselProps {
  categories: Category[];
}

export function CategoryCarousel({ categories }: CategoryCarouselProps) {
  const t = useTranslations("Common");
  const locale = useLocale();
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true }),
  );

  return (
    <div className="mb-8 overflow-hidden">
      <h2 className="mb-10 text-center text-3xl font-semibold tracking-tight">
        {t("browseCategories")}
      </h2>
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="-ml-1">
          {categories.map((category) => (
            <CarouselItem
              key={category.id}
              className="pl-1 md:basis-1/2 lg:basis-1/3"
            >
              <div className="p-1">
                <Link
                  href={buildProductsHref(locale, { categoryId: category.id })}
                  className="block transition-transform hover:scale-[1.02]"
                >
                  <Card
                    className="overflow-hidden"
                    style={{
                      backgroundImage: `url(${category.image})`,
                      backgroundSize: "cover",
                    }}
                  >
                    <CardContent className="flex aspect-square items-center justify-center bg-black/50 p-6">
                      <span className="text-2xl font-semibold text-white">
                        {category.name}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </div>
  );
}
