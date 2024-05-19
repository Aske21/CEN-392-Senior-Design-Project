import { Product } from "../core/db/entity/product";
import { appDataSource } from "../core/data-source";

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

  async getProductByName(productName: string): Promise<Product | null> {
    return await this.productRepository.findOneBy({ name: productName });
  }

  async getNewlyAddedProducts(): Promise<Product[]> {
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const products = await this.productRepository
      .createQueryBuilder("product")
      .where("product.created_at >= :twoWeeksAgo", { twoWeeksAgo })
      .orderBy("product.created_at", "DESC")
      .take(6)
      .getMany();

    if (products.length < 6) {
      const latestProducts = await this.productRepository.find({
        order: { created_at: "DESC" },
        take: 6,
      });
      return latestProducts;
    }

    return products;
  }
}
