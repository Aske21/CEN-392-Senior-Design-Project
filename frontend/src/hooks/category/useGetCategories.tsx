import { Category } from "@/@types/category";
import CategoryApi from "@/lib/api/category";
import { useQuery, UseQueryOptions } from "react-query";

const useGetCategories = (options?: UseQueryOptions<Category[], Error>) => {
  return useQuery<Category[], Error>(
    "categories",
    async () => {
      const categoryApi = new CategoryApi();
      const categories = await categoryApi.getCategories();
      return categories;
    },
    options
  );
};

export default useGetCategories;
