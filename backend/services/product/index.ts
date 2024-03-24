import { Product } from "../../core/db/entity/product";
import { appDataSource } from "../../core/data-source";

export class ProductService {
  private productRepository = appDataSource.getRepository(Product);

  async getProductById(productId: number): Promise<Product | null> {
    return this.productRepository.findOneBy({ id: productId });
  }

  async getAllProducts(): Promise<Product[] | null> {
    return this.productRepository.find();
  }

  async createProduct(productData: Partial<Product>): Promise<Product> {
    const product = this.productRepository.create(productData);
    return this.productRepository.save(product);
  }

  async updateProduct(
    productId: number,
    updateData: Partial<Product>
  ): Promise<Product | undefined> {
    const product = await this.productRepository.findOneBy({ id: productId });
    if (!product) {
      throw new Error("Product not found");
    }
    Object.assign(product, updateData);
    return this.productRepository.save(product);
  }

  async deleteProduct(productId: number): Promise<void> {
    await this.productRepository.delete(productId);
  }
}
