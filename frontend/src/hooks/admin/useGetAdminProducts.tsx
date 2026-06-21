import { useQuery, UseQueryOptions } from "react-query";
import ProductApi from "@/lib/api/product";
import { ProductFilters, PaginatedProductsResponse } from "@/@types/product";

const useGetAdminProducts = (
  filters?: ProductFilters,
  options?: UseQueryOptions<PaginatedProductsResponse, Error>,
) => {
  const serializedFilters = filters
    ? JSON.stringify(filters, Object.keys(filters).sort())
    : null;

  return useQuery<PaginatedProductsResponse, Error>(
    ["adminProducts", serializedFilters],
    async () => {
      const api = new ProductApi();
      return await api.getProducts(filters);
    },
    {
      ...options,
      staleTime: 0,
      cacheTime: 300000,
      refetchOnWindowFocus: false,
    },
  );
};

export default useGetAdminProducts;
