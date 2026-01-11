import { useQuery, UseQueryOptions } from "react-query";
import OrderApi, { PaginatedOrdersResponse } from "@/lib/api/order";

const useGetUserOrders = (
  page: number = 1,
  limit: number = 10,
  options?: UseQueryOptions<PaginatedOrdersResponse, Error>
) => {
  return useQuery<PaginatedOrdersResponse, Error>(
    ["userOrders", page, limit],
    async () => {
      const orderApi = new OrderApi();
      return await orderApi.getUserOrders(page, limit);
    },
    {
      ...options,
      staleTime: 30000, // 30 seconds
      cacheTime: 300000,
      refetchOnWindowFocus: false,
    }
  );
};

export default useGetUserOrders;
