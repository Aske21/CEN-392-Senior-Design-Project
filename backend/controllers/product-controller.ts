import { Request, Response } from "express";
import { ProductService } from "../services/product-service";

const productService = new ProductService();

export class ProductController {
  async getProductById(req: Request, res: Response): Promise<void> {
    const productId: number = parseInt(req.params.id);
    try {
      if (productId) {
        const product = await productService.getProductById(productId);
        if (product) {
          res.status(200).json(product);
        } else {
          res.status(404).json({ error: "Product not found" });
        }
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const searchParam = req.query.search as string | undefined;
      const filters = {
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        search: searchParam && searchParam.trim().length > 0 ? searchParam.trim() : undefined,
        categoryId: req.query.categoryId
          ? parseInt(req.query.categoryId as string)
          : undefined,
        sortBy: (req.query.sortBy as "name" | "price") || undefined,
        sortOrder: (req.query.sortOrder as "asc" | "desc") || undefined,
        minPrice: req.query.minPrice
          ? parseFloat(req.query.minPrice as string)
          : undefined,
        maxPrice: req.query.maxPrice
          ? parseFloat(req.query.maxPrice as string)
          : undefined,
      };

      console.log("Received filters:", filters);
      const result = await productService.getAllProducts(filters);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async createProduct(req: Request, res: Response): Promise<void> {
    const productData = req.body;
    try {
      const newProduct = await productService.createProduct(productData);
      res.status(201).json(newProduct);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async updateProduct(req: Request, res: Response): Promise<void> {
    const productId: number = parseInt(req.params.id);
    const updateData = req.body;
    try {
      const updatedProduct = await productService.updateProduct(
        productId,
        updateData
      );
      if (updatedProduct) {
        res.status(200).json(updatedProduct);
      } else {
        res.status(404).json({ error: "Product not found" });
      }
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async deleteProduct(req: Request, res: Response): Promise<void> {
    const productId: number = parseInt(req.params.id);
    try {
      await productService.deleteProduct(productId);
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getNewlyAddedProducts(req: Request, res: Response): Promise<void> {
    console.log("hello");
    try {
      const products = await productService.getNewlyAddedProducts();
      res.status(200).json(products);
    } catch (error) {
      console.error("Error fetching newly added products:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default new ProductController();
