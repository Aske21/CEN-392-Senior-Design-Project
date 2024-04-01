import { useQuery, UseQueryOptions } from "react-query";
import ProductApi from "@/lib/api/product";
import { Product } from "@/@types/product";

const useGetProductById = (
  id: string,
  options?: UseQueryOptions<Product, Error>
) => {
  return useQuery<Product, Error>(
    ["product", id],
    async () => {
      const productApi = new ProductApi();
      const product = await productApi.getProductById(id);
      return product;
    },
    options
  );
};

export default useGetProductById;
