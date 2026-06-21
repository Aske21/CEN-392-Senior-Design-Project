import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "react-query";
import ProductApi from "@/lib/api/product";

interface UpdateAdminProductInput {
  id: number;
  data: any;
}

const useUpdateAdminProduct = (
  options?: UseMutationOptions<any, Error, UpdateAdminProductInput>,
) => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, UpdateAdminProductInput>(
    async ({ id, data }) => {
      return await new ProductApi().updateProduct(id, data);
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

export default useUpdateAdminProduct;
