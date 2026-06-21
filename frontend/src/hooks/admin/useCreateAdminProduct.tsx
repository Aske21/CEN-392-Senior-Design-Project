import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "react-query";
import ProductApi from "@/lib/api/product";

const useCreateAdminProduct = (
  options?: UseMutationOptions<any, Error, any>,
) => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, any>(
    async (productData) => {
      return await new ProductApi().createProduct(productData);
    },
    {
      ...options,
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries("adminProducts");
        options?.onSuccess?.(data, variables, context);
      },
    },
  );
};

export default useCreateAdminProduct;
