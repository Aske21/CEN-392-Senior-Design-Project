import { useMutation } from "react-query";
import { getAuthTokenFromStorage } from "@/lib/utils/auth";

interface ValidateDiscountResponse {
  valid: boolean;
  discount?: {
    code: string;
    name: string;
    discountPercentage: number;
  };
  discountAmount?: number;
  finalAmount?: number;
  error?: string;
}

const useValidateDiscount = () => {
  const validateDiscountMutation = useMutation(
    async (data: { code: string; totalAmount: number }) => {
      const token = getAuthTokenFromStorage();

      if (!token) {
        throw new Error("Authentication required. Please login to continue.");
      }

      const response = await fetch(
        `${process.env.NEXT_API_URL}/discount/validate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            code: data.code,
            totalAmount: data.totalAmount,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to validate discount code");
      }

      const responseData = await response.json();
      return responseData as ValidateDiscountResponse;
    }
  );

  return validateDiscountMutation;
};

export default useValidateDiscount;
