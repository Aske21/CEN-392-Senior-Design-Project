import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "react-query";
import ProductApi from "@/lib/api/product";

const useDeleteAdminProduct = (
  options?: UseMutationOptions<any, Error, number>,
) => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, number>(
    async (id) => {
      return await new ProductApi().deleteProduct(id);
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

export default useDeleteAdminProduct;
