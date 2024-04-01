import { useMutation } from "react-query";

const useCreateCheckoutSession = () => {
  const createCheckoutSessionMutation = useMutation(async (items: any) => {
    try {
      const response = await fetch(
        "http://localhost:5000/payment/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ items }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }
      const data = await response.json();
      return data.url;
    } catch (error: any) {
      throw new Error(error.message);
    }
  });

  return createCheckoutSessionMutation;
};

export default useCreateCheckoutSession;
