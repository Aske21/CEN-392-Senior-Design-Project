import { useQuery, UseQueryOptions } from "react-query";
import ProductApi from "@/lib/api/product";
import { Product } from "@/@types/product";

const useGetRecommendedProducts = (
  productId: string,
  limit?: number,
  options?: UseQueryOptions<Product[], Error>
) => {
  return useQuery<Product[], Error>(
    ["recommendedProducts", productId, limit],
    async () => {
      const productApi = new ProductApi();
      const products = await productApi.getRecommendedProducts(productId, limit);
      return products;
    },
    {
      ...options,
      enabled: !!productId && (options?.enabled !== false),
      staleTime: 300000,
      cacheTime: 600000,
      refetchOnWindowFocus: false,
    }
  );
};

export default useGetRecommendedProducts;
