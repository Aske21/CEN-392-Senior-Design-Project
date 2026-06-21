import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "react-query";
import AdminApi from "@/lib/api/admin";

const useUpdateAdminOrderStatus = (
  options?: UseMutationOptions<any, Error, { id: number; status: string }>,
) => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, { id: number; status: string }>(
    async ({ id, status }) => {
      return await AdminApi.updateOrderStatus(id, status);
    },
    {
      ...options,
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries("adminOrders");
        options?.onSuccess?.(data, variables, context);
      },
    },
  );
};

export default useUpdateAdminOrderStatus;
