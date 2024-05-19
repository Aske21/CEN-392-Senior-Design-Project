import { Category } from "@/@types/category";
import AxiosClient from "@/lib/axios/axiosClient";

class CategoryApi extends AxiosClient {
  constructor() {
    super(process.env.NEXT_API_URL as string);
  }

  public async getCategories(): Promise<Category[]> {
    try {
      const response = await this.instance.get("/category");
      return response as unknown as Category[];
    } catch (error) {
      throw new Error(`Error fetching categories: ${error}`);
    }
  }

  public async getCategoryById(id: string): Promise<Category> {
    try {
      const response = await this.instance.get(`/category/${id}`);
      return response.data as Category;
    } catch (error) {
      throw new Error(`Error fetching category: ${error}`);
    }
  }
}

export default CategoryApi;
