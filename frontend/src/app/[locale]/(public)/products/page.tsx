"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ProductCard from "@/components/product-card";
import useGetProducts from "@/hooks/product/useGetProducts";
import useGetCategories from "@/hooks/category/useGetCategories";
import ProductFiltersSidebar from "@/components/products/product-filters-sidebar";
import ProductSearchSort from "@/components/products/product-search-sort";
import { ProductFilters } from "@/@types/product";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FaFilter } from "react-icons/fa";
import { useTranslations } from "next-intl";
import {
  buildProductFiltersSearchParams,
  parseProductFiltersFromSearchParams,
} from "@/lib/utils/product-filters-url";

const DEFAULT_FILTERS: ProductFilters = {
  page: 1,
  limit: 20,
};

function filtersFromSearchParams(
  searchParams: URLSearchParams,
): ProductFilters {
  const fromUrl = parseProductFiltersFromSearchParams(searchParams);

  return {
    page: fromUrl.page ?? 1,
    limit: 20,
    categoryId: fromUrl.categoryId,
    search: fromUrl.search,
    sortBy: fromUrl.sortBy,
    sortOrder: fromUrl.sortOrder,
    minPrice: fromUrl.minPrice,
    maxPrice: fromUrl.maxPrice,
  };
}

const Products = () => {
  const t = useTranslations("ProductsPage");
  const tf = useTranslations("ProductFilters");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<ProductFilters>(DEFAULT_FILTERS);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const { data, isLoading, isError, error } = useGetProducts(filters);
  const { data: categories } = useGetCategories();

  const products = data?.products || [];
  const currentPage = data?.page || 1;
  const totalPages = data?.totalPages || 0;
  const total = data?.total || 0;

  useEffect(() => {
    setFilters(filtersFromSearchParams(searchParams));
  }, [searchParams]);

  const syncUrl = (updated: ProductFilters) => {
    const params = buildProductFiltersSearchParams(updated);
    const query = params.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    router.replace(url, { scroll: false });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      const updated = { ...filters, page: newPage };
      setFilters(updated);
      syncUrl(updated);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFiltersChange = (newFilters: ProductFilters) => {
    const updated = {
      ...filters,
      ...newFilters,
      page: newFilters.page ?? 1,
      limit: filters.limit ?? 20,
    };
    setFilters(updated);
    syncUrl(updated);
    setMobileFiltersOpen(false);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="sm">
              <FaFilter className="mr-2 h-4 w-4" />
              {tf("filtersButton")}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader>
              <SheetTitle>{tf("filtersTitle")}</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <ProductFiltersSidebar
                categories={categories}
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <ProductSearchSort
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      <div className="flex flex-col md:flex-row gap-6">
        <aside className="hidden md:block w-64 flex-shrink-0">
          <ProductFiltersSidebar
            categories={categories}
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
        </aside>

        <main className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-96 w-full" />
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-4">{t("errorTitle")}</h2>
              <p>{t("errorMessage")}</p>
              <p className="text-sm text-muted-foreground mt-2">
                {error?.message || t("unknownError")}
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-4">
                {t("noProductsTitle")}
              </h2>
              <p>{t("noProductsMessage")}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => {
                  return (
                    <ProductCard
                      key={product.id}
                      id={product.id.toString()}
                      title={product.name}
                      description={product.description}
                      price={parseFloat(product.price)}
                      imageSrc={product.images?.[0] || ""}
                    />
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    {t("previous")}
                  </Button>

                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={
                            currentPage === pageNum ? "default" : "outline"
                          }
                          onClick={() => handlePageChange(pageNum)}
                          className="min-w-[40px]"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    {t("next")}
                  </Button>
                </div>
              )}
              <div className="text-center text-sm text-muted-foreground mt-4">
                {t("showing", { count: products.length, total })}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;
