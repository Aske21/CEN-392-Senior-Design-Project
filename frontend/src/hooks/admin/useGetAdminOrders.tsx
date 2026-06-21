import { useQuery, UseQueryOptions } from "react-query";
import AdminApi from "@/lib/api/admin";

const useGetAdminOrders = (
  page = 1,
  limit = 20,
  options?: UseQueryOptions<any, Error>,
) => {
  return useQuery<any, Error>(
    ["adminOrders", page, limit],
    async () => {
      return await AdminApi.getOrders(page, limit);
    },
    {
      ...options,
      staleTime: 30000,
      cacheTime: 300000,
      refetchOnWindowFocus: false,
    },
  );
};

export default useGetAdminOrders;
