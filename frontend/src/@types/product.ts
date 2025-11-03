export type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  category: {
    id: number;
    name: string;
    description: string;
    image: string;
  } | string;
  brand?: string;
  stockQuantity?: number;
  images: string[];
  attributes: {
    layout?: string;
    switch?: string;
    backlight?: string;
    case_material?: string;
    [key: string]: string | undefined;
  };
  createdAt?: string;
  updatedAt?: string;
  created_at?: string;
  updated_at?: string;
};

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number;
  sortBy?: "name" | "price";
  sortOrder?: "asc" | "desc";
  minPrice?: number;
  maxPrice?: number;
}

export interface PaginatedProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
