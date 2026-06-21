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

  public async createCategory(
    categoryData: Partial<Category>,
  ): Promise<Category> {
    try {
      return await this.instance.post("/category", categoryData);
    } catch (error) {
      throw new Error(`Error creating category: ${error}`);
    }
  }

  public async updateCategory(
    id: number,
    categoryData: Partial<Category>,
  ): Promise<Category> {
    try {
      return await this.instance.put(`/category/${id}`, categoryData);
    } catch (error) {
      throw new Error(`Error updating category: ${error}`);
    }
  }

  public async deleteCategory(id: number): Promise<void> {
    try {
      await this.instance.delete(`/category/${id}`);
    } catch (error) {
      throw new Error(`Error deleting category: ${error}`);
    }
  }
}

export default CategoryApi;
