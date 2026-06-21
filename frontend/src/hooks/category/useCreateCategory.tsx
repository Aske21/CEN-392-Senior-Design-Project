import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "react-query";
import CategoryApi from "@/lib/api/category";

const useCreateCategory = (options?: UseMutationOptions<any, Error, any>) => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, any>(
    async (categoryData) => {
      return await new CategoryApi().createCategory(categoryData);
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

export default useCreateCategory;
