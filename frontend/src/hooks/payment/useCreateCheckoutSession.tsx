import { useMutation } from "react-query";
import { getAuthTokenFromStorage } from "@/lib/utils/auth";

const useCreateCheckoutSession = () => {
  const createCheckoutSessionMutation = useMutation(
    async (data: { items: any[]; shippingAddress?: string }) => {
      const token = getAuthTokenFromStorage();

      if (!token) {
        throw new Error("Authentication required. Please login to continue.");
      }

      const response = await fetch(
        `${process.env.NEXT_API_URL}/payment/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            items: data.items,
            shippingAddress: data.shippingAddress,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to create checkout session");
      }

      const responseData = await response.json();
      return responseData.url;
    }
  );

  return createCheckoutSessionMutation;
};

export default useCreateCheckoutSession;
