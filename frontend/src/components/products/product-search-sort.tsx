"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ProductFilters } from "@/@types/product";
import { useDebounce } from "@/hooks/useDebounce";
import { FaSearch } from "react-icons/fa";
import { useTranslations } from "next-intl";

interface ProductSearchSortProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
}

export default function ProductSearchSort({
  filters,
  onFiltersChange,
}: ProductSearchSortProps) {
  const t = useTranslations("ProductSearchSort");
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (filters.search !== searchTerm && filters.search !== debouncedSearch) {
      setSearchTerm(filters.search || "");
    }
  }, [filters.search]);

  useEffect(() => {
    const currentSearch = filters.search || "";
    if (debouncedSearch !== currentSearch) {
      onFiltersChange({
        search: debouncedSearch || undefined,
      });
    }
  }, [debouncedSearch]);

  const handleSortByChange = (value: string) => {
    if (value === "created-desc") {
      onFiltersChange({
        sortBy: undefined,
        sortOrder: undefined,
      });
    } else {
      const [sortBy, sortOrder] = value.split("-");
      onFiltersChange({
        sortBy: sortBy as "name" | "price",
        sortOrder: sortOrder as "asc" | "desc",
      });
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1 space-y-2">
        <Label htmlFor="search">{t("searchLabel")}</Label>
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            id="search"
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="w-full md:w-64 space-y-2">
        <Label htmlFor="sort">{t("sortLabel")}</Label>
        <Select
          value={
            filters.sortBy && filters.sortOrder
              ? `${filters.sortBy}-${filters.sortOrder}`
              : "created-desc"
          }
          onValueChange={handleSortByChange}
        >
          <SelectTrigger id="sort">
            <SelectValue placeholder={t("sortLabel")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created-desc">{t("createdDesc")}</SelectItem>
            <SelectItem value="name-asc">{t("nameAsc")}</SelectItem>
            <SelectItem value="name-desc">{t("nameDesc")}</SelectItem>
            <SelectItem value="price-asc">{t("priceAsc")}</SelectItem>
            <SelectItem value="price-desc">{t("priceDesc")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
