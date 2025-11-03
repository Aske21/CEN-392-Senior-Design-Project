import { useQuery, UseQueryOptions } from "react-query";
import ProductApi from "@/lib/api/product";
import { ProductFilters, PaginatedProductsResponse } from "@/@types/product";

const useGetProducts = (
  filters?: ProductFilters,
  options?: UseQueryOptions<PaginatedProductsResponse, Error>
) => {
  const serializedFilters = filters
    ? JSON.stringify(filters, Object.keys(filters).sort())
    : null;

  return useQuery<PaginatedProductsResponse, Error>(
    ["products", serializedFilters],
    async () => {
      const productApi = new ProductApi();
      const result = await productApi.getProducts(filters);
      return result;
    },
    {
      ...options,
      staleTime: 0,
      cacheTime: 300000,
      refetchOnWindowFocus: false,
    }
  );
};

export default useGetProducts;
