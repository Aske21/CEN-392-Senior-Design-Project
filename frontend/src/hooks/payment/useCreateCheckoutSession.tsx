import { useMutation } from "react-query";

const useCreateCheckoutSession = () => {
  const createCheckoutSessionMutation = useMutation(async (items: any) => {
    const response = await fetch(
      `${process.env.NEXT_API_URL}/payment/create-checkout-session`,
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
  });

  return createCheckoutSessionMutation;
};

export default useCreateCheckoutSession;
