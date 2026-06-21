import { useQuery, UseQueryOptions } from "react-query";
import AdminApi from "@/lib/api/admin";

const useGetAdminUsers = (
  page = 1,
  limit = 20,
  options?: UseQueryOptions<any, Error>,
) => {
  return useQuery<any, Error>(
    ["adminUsers", page, limit],
    async () => {
      return await AdminApi.getUsers(page, limit);
    },
    {
      ...options,
      staleTime: 30000,
      cacheTime: 300000,
      refetchOnWindowFocus: false,
    },
  );
};

export default useGetAdminUsers;
