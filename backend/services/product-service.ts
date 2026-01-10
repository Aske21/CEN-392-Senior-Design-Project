import { Product } from "../core/db/entity/product";
import { appDataSource } from "../core/data-source";
import { Brackets } from "typeorm";

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number;
  sortBy?: "name" | "price";
  sortOrder?: "asc" | "desc";
  minPrice?: number;
  maxPrice?: number;
}

export interface PaginatedProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ProductService {
  private productRepository = appDataSource.getRepository(Product);

  async getProductById(productId: number): Promise<Product | null> {
    return this.productRepository.findOne({
      where: { id: productId },
      relations: ["category"],
    });
  }

  async getAllProducts(
    filters?: ProductFilters
  ): Promise<PaginatedProductsResponse> {
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const skip = (page - 1) * limit;

    const queryBuilder = this.productRepository
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.category", "category")
      .distinct(true);

    let hasWhere = false;

    if (filters?.search && filters.search.trim().length > 0) {
      const searchTerm = filters.search.trim();
      const searchPattern = `%${searchTerm}%`;

      queryBuilder
        .where(
          new Brackets((qb) => {
            qb.where("product.name ILIKE :search", {
              search: searchPattern,
            }).orWhere("product.description ILIKE :search", {
              search: searchPattern,
            });
          })
        )
        .addSelect(
          `
          CASE 
            WHEN LOWER(product.name) = LOWER(:exactMatch) THEN 3
            WHEN product.name ILIKE :startsWith THEN 2
            WHEN product.name ILIKE :contains THEN 1
            WHEN product.description ILIKE :contains THEN 0.5
            ELSE 0
          END
          `,
          "search_rank"
        )
        .setParameter("exactMatch", searchTerm)
        .setParameter("startsWith", `${searchTerm}%`)
        .setParameter("contains", searchPattern);

      hasWhere = true;
    }

    if (filters?.categoryId !== undefined && filters?.categoryId !== null) {
      console.log("Applying category filter:", filters.categoryId);
      if (hasWhere) {
        queryBuilder.andWhere("product.categoryId = :categoryId", {
          categoryId: filters.categoryId,
        });
      } else {
        queryBuilder.where("product.categoryId = :categoryId", {
          categoryId: filters.categoryId,
        });
        hasWhere = true;
      }
    }

    if (filters?.minPrice !== undefined) {
      console.log("Applying minPrice filter:", filters.minPrice);
      queryBuilder.andWhere("product.price >= :minPrice", {
        minPrice: filters.minPrice,
      });
    }

    if (filters?.maxPrice !== undefined) {
      console.log("Applying maxPrice filter:", filters.maxPrice);
      queryBuilder.andWhere("product.price <= :maxPrice", {
        maxPrice: filters.maxPrice,
      });
    }

    const sortBy = filters?.sortBy || "created_at";
    const sortOrder =
      filters?.sortOrder?.toUpperCase() === "ASC" ? "ASC" : "DESC";

    if (filters?.search && filters.search.trim().length > 0) {
      queryBuilder.orderBy("search_rank", "DESC");

      if (sortBy === "name") {
        queryBuilder.addOrderBy("product.name", sortOrder);
      } else if (sortBy === "price") {
        queryBuilder.addOrderBy("product.price", sortOrder);
      } else {
        queryBuilder.addOrderBy("product.created_at", "DESC");
      }
    } else {
      if (sortBy === "name") {
        queryBuilder.orderBy("product.name", sortOrder);
      } else if (sortBy === "price") {
        queryBuilder.orderBy("product.price", sortOrder);
      } else {
        queryBuilder.orderBy("product.created_at", "DESC");
      }
    }

    const query = queryBuilder.getQuery();
    const params = queryBuilder.getParameters();

    const [products, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    console.log("Found products:", products.length, "Total:", total);
    if (products.length > 0) {
      console.log(
        "First product:",
        products[0].name,
        "Category:",
        products[0].category?.name
      );
    }

    return {
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
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

  async getRecommendedProducts(productId: number, limit: number = 4): Promise<Product[]> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ["category"],
    });

    if (!product) {
      return [];
    }

    const queryBuilder = this.productRepository
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.category", "category")
      .where("product.id != :productId", { productId });

    if (product.category) {
      queryBuilder.andWhere("product.categoryId = :categoryId", {
        categoryId: product.category.id,
      });
    }

    const recommended = await queryBuilder
      .orderBy("product.created_at", "DESC")
      .take(limit)
      .getMany();

    if (recommended.length < limit) {
      const additionalProducts = await this.productRepository
        .createQueryBuilder("product")
        .leftJoinAndSelect("product.category", "category")
        .where("product.id != :productId", { productId })
        .andWhere(
          product.category
            ? "product.categoryId != :categoryId OR product.categoryId IS NULL"
            : "product.categoryId IS NOT NULL",
          product.category ? { categoryId: product.category.id } : {}
        )
        .orderBy("product.created_at", "DESC")
        .take(limit - recommended.length)
        .getMany();

      return [...recommended, ...additionalProducts].slice(0, limit);
    }

    return recommended;
  }
}
