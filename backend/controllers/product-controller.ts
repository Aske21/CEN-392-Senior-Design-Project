import { Request, Response } from "express";
import { ProductService } from "../services/product-service";

const productService = new ProductService();

export class ProductController {
  async getProductById(req: Request, res: Response): Promise<void> {
    const productId: number = parseInt(req.params.id);
    try {
      const product = await productService.getProductById(productId);
      if (product) {
        res.status(200).json(product);
      } else {
        res.status(404).json({ error: "Product not found" });
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const products = await productService.getAllProducts();
      res.status(200).json(products);
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
}

export default new ProductController();
