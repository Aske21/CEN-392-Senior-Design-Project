import { useQuery, UseQueryOptions } from "react-query";
import ProductApi from "@/lib/api/product";
import { Product } from "@/@types/product";

const useGetNewlyAddedProducts = (
  options?: UseQueryOptions<Product[], Error>
) => {
  return useQuery<Product[], Error>(
    "newly-added",
    async () => {
      const productApi = new ProductApi();
      const products = await productApi.getNewlyAddedProducts();
      return products;
    },
    options
  );
};

export default useGetNewlyAddedProducts;
