"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Category } from "@/@types/category";
import { ProductFilters } from "@/@types/product";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";

interface ProductFiltersSidebarProps {
  categories?: Category[];
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
}

export default function ProductFiltersSidebar({
  categories,
  filters,
  onFiltersChange,
}: ProductFiltersSidebarProps) {
  const t = useTranslations("ProductFilters");
  const [minPrice, setMinPrice] = useState(filters.minPrice?.toString() || "");
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice?.toString() || "");

  const handleCategoryChange = (value: string) => {
    onFiltersChange({
      categoryId: value === "all" ? undefined : parseInt(value),
    });
  };

  const handlePriceFilter = () => {
    onFiltersChange({
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    });
  };

  const clearPriceFilter = () => {
    setMinPrice("");
    setMaxPrice("");
    onFiltersChange({
      minPrice: undefined,
      maxPrice: undefined,
    });
  };

  const clearAllFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    onFiltersChange({
      page: filters.page,
      limit: filters.limit,
      categoryId: undefined,
      minPrice: undefined,
      maxPrice: undefined,
    });
  };

  return (
    <div className="w-full md:w-64 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">{t("filtersTitle")}</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={clearAllFilters}
          className="w-full mb-4"
        >
          {t("clearAll")}
        </Button>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="category-filter">{t("categoryLabel")}</Label>
          <Select
            value={filters.categoryId?.toString() || "all"}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger id="category-filter">
              <SelectValue placeholder={t("allCategories")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allCategories")}</SelectItem>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label htmlFor="price-range">{t("priceRange")}</Label>
          <div className="space-y-2">
            <Input
              id="min-price"
              type="number"
              placeholder={t("minPrice")}
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              min="0"
              step="0.01"
            />
            <Input
              id="max-price"
              type="number"
              placeholder={t("maxPrice")}
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              min="0"
              step="0.01"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePriceFilter}
                className="flex-1"
              >
                {t("apply")}
              </Button>
              {(minPrice || maxPrice) && (
                <Button variant="ghost" size="sm" onClick={clearPriceFilter}>
                  {t("clear")}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
