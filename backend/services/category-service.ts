import { appDataSource } from "../core/data-source";
import { ProductCategory } from "../core/db/entity/product_category";

export class CategoryService {
  private categoryRepository = appDataSource.getRepository(ProductCategory);

  async getAllCategories(): Promise<ProductCategory[] | null> {
    return this.categoryRepository.find();
  }

  async getCategoryById(categoryId: number): Promise<ProductCategory | null> {
    return this.categoryRepository.findOneBy({ id: categoryId });
  }

  async createCategory(
    categoryData: Partial<ProductCategory>
  ): Promise<ProductCategory> {
    const category = this.categoryRepository.create(categoryData);
    return this.categoryRepository.save(category);
  }

  async updateCategory(
    categoryId: number,
    updateData: Partial<ProductCategory>
  ): Promise<ProductCategory | undefined> {
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
