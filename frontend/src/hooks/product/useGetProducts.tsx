import { useQuery, UseQueryOptions } from "react-query";
import ProductApi from "@/lib/api/product";
import { Product } from "@/@types/product";

const useGetProducts = (options?: UseQueryOptions<Product[], Error>) => {
  return useQuery<Product[], Error>(
    "products",
    async () => {
      const productApi = new ProductApi();
      const products = await productApi.getProducts();
      return products;
    },
    options
  );
};

export default useGetProducts;
