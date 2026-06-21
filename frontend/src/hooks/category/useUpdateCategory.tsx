import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "react-query";
import CategoryApi from "@/lib/api/category";

interface UpdateCategoryInput {
  id: number;
  data: any;
}

const useUpdateCategory = (
  options?: UseMutationOptions<any, Error, UpdateCategoryInput>,
) => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, UpdateCategoryInput>(
    async ({ id, data }) => {
      return await new CategoryApi().updateCategory(id, data);
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

export default useUpdateCategory;
