"use client";

import { Button } from "@/components/ui/button";
import useGetProductById from "@/hooks/product/useGetProductById";
import { addItem } from "@/lib/features/cart/cartSlice";
import { useDispatch } from "react-redux";
import ProductImage from "@/components/product-image";
import { SimilarProductsSection } from "@/components/similar-products-section";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { FiShoppingCart, FiTag, FiPackage } from "react-icons/fi";
import { useTranslations, useLocale } from "next-intl";
import { buildProductsHref } from "@/lib/utils/product-filters-url";

const ProductPage = ({ params }: { params: { id: string } }) => {
  const t = useTranslations("ProductPage");
  const tc = useTranslations("Common");
  const locale = useLocale();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { data, isLoading, isError } = useGetProductById(params.id);

  if (isLoading) {
    return (
      <div className="container mx-auto my-8 px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row md:space-x-8 lg:space-x-12">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <Skeleton className="aspect-square w-full rounded-lg" />
          </div>
          <div className="md:w-1/2 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="container mx-auto my-8 px-4 max-w-7xl">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">{t("notFoundTitle")}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t("notFoundMessage")}
          </p>
          <Link href="/products">
            <Button>{t("browseProducts")}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { id, name, description, price, category, brand, images } = data;
  const categoryLabel =
    typeof category === "string" ? category : category?.name || null;
  const categoryIdForLink =
    typeof category === "object" && category?.id ? category.id : null;

  const handleAddToCart = () => {
    dispatch(
      addItem({
        id: id as unknown as string,
        title: name,
        description: description,
        price: parseInt(price),
        imageSrc: images?.[0] || "",
        quantity: 1,
      }),
    );
    toast({
      title: t("addedToCart"),
      description: t("addedToCartDescription", { name }),
      className: cn(
        "top-0 right-0 flex fixed md:max-w-[300px] md:top-4 md:right-4",
      ),
    });
  };

  const categoryProductsHref = categoryIdForLink
    ? buildProductsHref(locale, { categoryId: categoryIdForLink })
    : `/${locale}/products`;

  return (
    <div className="container mx-auto my-8 px-4 max-w-7xl">
      <div className="mb-6">
        <nav className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          <Link
            href={`/${locale}`}
            className="hover:text-gray-900 dark:hover:text-gray-100"
          >
            {tc("home")}
          </Link>
          <span className="mx-2">/</span>
          <Link
            href={`/${locale}/products`}
            className="hover:text-gray-900 dark:hover:text-gray-100"
          >
            {tc("products")}
          </Link>
          {categoryIdForLink && (
            <>
              <span className="mx-2">/</span>
              <Link
                href={categoryProductsHref}
                className="hover:text-gray-900 dark:hover:text-gray-100"
              >
                {categoryLabel}
              </Link>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="text-gray-900 dark:text-gray-100">{name}</span>
        </nav>
      </div>

      <div className="flex flex-col lg:flex-row lg:space-x-12 mb-12">
        <div className="lg:w-1/2 mb-8 lg:mb-0">
          <div className="rounded-xl overflow-hidden aspect-square w-full relative bg-gray-100 dark:bg-gray-800 shadow-lg">
            <ProductImage
              src={images?.[0] || ""}
              alt={name}
              className="rounded-xl"
              fill
            />
          </div>
        </div>

        <div className="lg:w-1/2">
          <div className="mb-4">
            {categoryLabel && (
              <Link
                href={categoryProductsHref}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors mb-4"
              >
                <FiTag className="w-4 h-4" />
                {categoryLabel}
              </Link>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            {name}
          </h1>

          <div className="mb-6">
            <p className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              ${price}
            </p>
            {brand && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-4">
                <FiPackage className="w-4 h-4" />
                <span className="text-sm">{brand}</span>
              </div>
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
              {t("description")}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <Button
              onClick={handleAddToCart}
              size="lg"
              className="w-full sm:w-auto sm:min-w-[220px] h-14 px-6 text-base font-semibold"
            >
              <FiShoppingCart className="w-5 h-5 mr-2" />
              {t("addToCart")}
            </Button>
            <Link href="/cart" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto sm:min-w-[220px] h-14 px-6 text-base"
              >
                {t("viewCart")}
              </Button>
            </Link>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {categoryLabel && (
                <div>
                  <span className="text-gray-600 dark:text-gray-400 block mb-1">
                    {t("category")}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {categoryLabel}
                  </span>
                </div>
              )}
              {brand && (
                <div>
                  <span className="text-gray-600 dark:text-gray-400 block mb-1">
                    {t("brand")}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {brand}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <SimilarProductsSection
        productId={params.id}
        categoryId={categoryIdForLink}
        categoryLabel={categoryLabel}
      />
    </div>
  );
};

export default ProductPage;
