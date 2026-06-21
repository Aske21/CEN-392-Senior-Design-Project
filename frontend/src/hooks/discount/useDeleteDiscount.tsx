import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "react-query";
import { getAuthTokenFromStorage } from "@/lib/utils/auth";

const useDeleteDiscount = (
  options?: UseMutationOptions<any, Error, number>,
) => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, number>(
    async (id) => {
      const token = getAuthTokenFromStorage();
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        `${process.env.NEXT_API_URL}/discount/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete discount");
      }
    },
    {
      ...options,
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries("discounts");
        options?.onSuccess?.(data, variables, context);
      },
    },
  );
};

export default useDeleteDiscount;
