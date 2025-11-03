import {
  Product,
  ProductFilters,
  PaginatedProductsResponse,
} from "@/@types/product";
import AxiosClient from "@/lib/axios/axiosClient";

class ProductApi extends AxiosClient {
  constructor() {
    super(process.env.NEXT_API_URL as string);
  }

  public async getProducts(
    filters?: ProductFilters
  ): Promise<PaginatedProductsResponse> {
    try {
      const params = new URLSearchParams();
      if (filters?.page) params.append("page", filters.page.toString());
      if (filters?.limit) params.append("limit", filters.limit.toString());
      if (filters?.search && filters.search.trim().length > 0) {
        params.append("search", filters.search.trim());
      }
      if (filters?.categoryId !== undefined && filters?.categoryId !== null) {
        params.append("categoryId", filters.categoryId.toString());
      }
      if (filters?.sortBy) params.append("sortBy", filters.sortBy);
      if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);
      if (filters?.minPrice !== undefined)
        params.append("minPrice", filters.minPrice.toString());
      if (filters?.maxPrice !== undefined)
        params.append("maxPrice", filters.maxPrice.toString());

      const url = `/product${params.toString() ? `?${params.toString()}` : ""}`;
      const data = (await this.instance.get(url)) as unknown as any;

      if (!data || typeof data !== "object") {
        throw new Error("Invalid response format from API");
      }

      if (Array.isArray(data)) {
        return {
          products: data,
          total: data.length,
          page: filters?.page || 1,
          limit: filters?.limit || 20,
          totalPages: Math.ceil(data.length / (filters?.limit || 20)),
        } as PaginatedProductsResponse;
      }

      if (!("products" in data) || !Array.isArray((data as any).products)) {
        throw new Error("Response missing products array");
      }

      return data as PaginatedProductsResponse;
    } catch (error) {
      throw new Error(`Error fetching products: ${error}`);
    }
  }

  public async getProductsLegacy(): Promise<Product[]> {
    try {
      const response = await this.instance.get("/product");
      return response as unknown as Product[];
    } catch (error) {
      throw new Error(`Error fetching products: ${error}`);
    }
  }

  public async getProductById(id: string): Promise<Product> {
    try {
      const response = await this.instance.get(`/product/${id}`);
      return response as unknown as Product;
    } catch (error) {
      throw new Error(`Error fetching products: ${error}`);
    }
  }

  public async getNewlyAddedProducts(): Promise<Product[]> {
    try {
      const response = await this.instance.get("/product/newlyadded");
      return response as unknown as Product[];
    } catch (error) {
      throw new Error(`Error fetching products: ${error}`);
    }
  }
}

export default ProductApi;
