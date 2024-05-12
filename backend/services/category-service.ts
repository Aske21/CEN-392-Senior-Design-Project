import { appDataSource } from "../core/data-source";
import { Category } from "../core/db/entity/product_category";

export class CategoryService {
  private categoryRepository = appDataSource.getRepository(Category);

  async getAllCategories(): Promise<Category[] | null> {
    return this.categoryRepository.find();
  }

  async getCategoryById(categoryId: number): Promise<Category | null> {
    return this.categoryRepository.findOneBy({ id: categoryId });
  }

  async createCategory(categoryData: Partial<Category>): Promise<Category> {
    const category = this.categoryRepository.create(categoryData);
    return this.categoryRepository.save(category);
  }

  async updateCategory(
    categoryId: number,
    updateData: Partial<Category>
  ): Promise<Category | undefined> {
    const category = await this.categoryRepository.findOneBy({
      id: categoryId,
    });
    if (!category) {
      throw new Error("Category not found");
    }
    Object.assign(category, updateData);
    return this.categoryRepository.save(category);
  }

  async deleteCategory(categoryId: number): Promise<void> {
    await this.categoryRepository.delete(categoryId);
  }
}
