import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "react-query";
import CategoryApi from "@/lib/api/category";

const useDeleteCategory = (
  options?: UseMutationOptions<any, Error, number>,
) => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, number>(
    async (id) => {
      return await new CategoryApi().deleteCategory(id);
    },
    {
      ...options,
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries("categories");
        options?.onSuccess?.(data, variables, context);
      },
    },
  );
};

export default useDeleteCategory;
