import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "react-query";
import AdminApi from "@/lib/api/admin";

const useDeleteAdminUser = (
  options?: UseMutationOptions<any, Error, number>,
) => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, number>(
    async (id) => {
      return await AdminApi.deleteUser(id);
    },
    {
      ...options,
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries("adminUsers");
        options?.onSuccess?.(data, variables, context);
      },
    },
  );
};

export default useDeleteAdminUser;
