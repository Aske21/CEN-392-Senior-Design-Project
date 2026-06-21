import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "react-query";
import { getAuthTokenFromStorage } from "@/lib/utils/auth";

const useCreateDiscount = (options?: UseMutationOptions<any, Error, any>) => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, any>(
    async (discountData) => {
      const token = getAuthTokenFromStorage();
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        `${process.env.NEXT_API_URL}/discount/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(discountData),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to create discount");
      }

      return await response.json();
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

export default useCreateDiscount;
