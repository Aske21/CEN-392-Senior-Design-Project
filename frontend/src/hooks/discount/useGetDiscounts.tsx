import { useQuery } from "react-query";
import { getAuthTokenFromStorage } from "@/lib/utils/auth";

const useGetDiscounts = () => {
  return useQuery<any[], Error>(
    ["discounts"],
    async () => {
      const token = getAuthTokenFromStorage();
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(`${process.env.NEXT_API_URL}/discount`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to load discounts");
      }

      return (await response.json()) as any[];
    },
    {
      staleTime: 0,
      cacheTime: 300000,
      refetchOnWindowFocus: false,
    },
  );
};

export default useGetDiscounts;
