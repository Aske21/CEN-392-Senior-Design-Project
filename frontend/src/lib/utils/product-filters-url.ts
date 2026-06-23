import { ProductFilters } from "@/@types/product";

export function parseProductFiltersFromSearchParams(
  searchParams: URLSearchParams,
): ProductFilters {
  const filters: ProductFilters = {};

  const categoryId = searchParams.get("categoryId");
  if (categoryId && !Number.isNaN(Number(categoryId))) {
    filters.categoryId = Number(categoryId);
  }

  const search = searchParams.get("search");
  if (search) {
    filters.search = search;
  }

  const sortBy = searchParams.get("sortBy");
  if (sortBy === "name" || sortBy === "price") {
    filters.sortBy = sortBy;
  }

  const sortOrder = searchParams.get("sortOrder");
  if (sortOrder === "asc" || sortOrder === "desc") {
    filters.sortOrder = sortOrder;
  }

  const minPrice = searchParams.get("minPrice");
  if (minPrice && !Number.isNaN(Number(minPrice))) {
    filters.minPrice = Number(minPrice);
  }

  const maxPrice = searchParams.get("maxPrice");
  if (maxPrice && !Number.isNaN(Number(maxPrice))) {
    filters.maxPrice = Number(maxPrice);
  }

  const page = searchParams.get("page");
  if (page && !Number.isNaN(Number(page))) {
    filters.page = Number(page);
  }

  return filters;
}

export function buildProductFiltersSearchParams(
  filters: ProductFilters,
): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.categoryId !== undefined && filters.categoryId !== null) {
    params.set("categoryId", String(filters.categoryId));
  }
  if (filters.search?.trim()) {
    params.set("search", filters.search.trim());
  }
  if (filters.sortBy) {
    params.set("sortBy", filters.sortBy);
  }
  if (filters.sortOrder) {
    params.set("sortOrder", filters.sortOrder);
  }
  if (filters.minPrice !== undefined) {
    params.set("minPrice", String(filters.minPrice));
  }
  if (filters.maxPrice !== undefined) {
    params.set("maxPrice", String(filters.maxPrice));
  }
  if (filters.page && filters.page > 1) {
    params.set("page", String(filters.page));
  }

  return params;
}

export function buildProductsHref(
  locale: string,
  filters?: Partial<ProductFilters>,
): string {
  const params = buildProductFiltersSearchParams({
    page: 1,
    limit: 20,
    ...filters,
  });
  const query = params.toString();
  return `/${locale}/products${query ? `?${query}` : ""}`;
}
