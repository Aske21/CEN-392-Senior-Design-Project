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
import { Category } from "@/@types/category";
import { ProductFilters } from "@/@types/product";
import { useDebounce } from "@/hooks/useDebounce";

interface ProductFiltersProps {
  categories?: Category[];
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
}

export default function ProductFiltersComponent({
  categories,
  filters,
  onFiltersChange,
}: ProductFiltersProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    onFiltersChange({
      ...filters,
      search: debouncedSearch || undefined,
    });
  }, [debouncedSearch]);

  const handleCategoryChange = (value: string) => {
    onFiltersChange({
      ...filters,
      categoryId: value === "all" ? undefined : parseInt(value),
    });
  };

  const handleSortByChange = (value: string) => {
    const [sortBy, sortOrder] = value.split("-");
    onFiltersChange({
      ...filters,
      sortBy: sortBy as "name" | "price",
      sortOrder: sortOrder as "asc" | "desc",
    });
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={filters.categoryId?.toString() || "all"}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sort">Sort By</Label>
          <Select
            value={
              filters.sortBy && filters.sortOrder
                ? `${filters.sortBy}-${filters.sortOrder}`
                : "created-desc"
            }
            onValueChange={handleSortByChange}
          >
            <SelectTrigger id="sort">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created-desc">Newest First</SelectItem>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="price-asc">Price (Low to High)</SelectItem>
              <SelectItem value="price-desc">Price (High to Low)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

