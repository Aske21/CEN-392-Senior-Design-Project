import { useQuery, UseQueryOptions } from "react-query";
import OrderApi, { Order } from "@/lib/api/order";

const useGetOrderByPaymentId = (
  paymentId: string | null,
  options?: UseQueryOptions<Order, Error>
) => {
  return useQuery<Order, Error>(
    ["order", paymentId],
    async () => {
      if (!paymentId) {
        throw new Error("Payment ID is required");
      }
      const orderApi = new OrderApi();
      return await orderApi.getOrderByPaymentId(paymentId);
    },
    {
      ...options,
      enabled: !!paymentId,
      staleTime: 0,
      cacheTime: 300000,
      refetchOnWindowFocus: false,
      retry: 3, // Retry 3 times
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000), // Exponential backoff: 1s, 2s, 4s
    }
  );
};

export default useGetOrderByPaymentId;
