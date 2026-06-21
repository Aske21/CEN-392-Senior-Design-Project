import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "react-query";
import AdminApi from "@/lib/api/admin";

const useUpdateAdminUserRole = (
  options?: UseMutationOptions<any, Error, { id: number; role: string }>,
) => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, { id: number; role: string }>(
    async ({ id, role }) => {
      return await AdminApi.updateUserRole(id, role);
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

export default useUpdateAdminUserRole;
