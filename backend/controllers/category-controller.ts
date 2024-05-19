import { Request, Response } from "express";
import { CategoryService } from "../services/category-service";

const categoryService = new CategoryService();

export class CategoryController {
  async getAllCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await categoryService.getAllCategories();
      res.status(200).json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getCategoryById(req: Request, res: Response): Promise<void> {
    const categoryId: number = parseInt(req.params.id);
    try {
      const category = await categoryService.getCategoryById(categoryId);
      if (category) {
        res.status(200).json(category);
      } else {
        res.status(404).json({ error: "Category not found" });
      }
    } catch (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async createCategory(req: Request, res: Response): Promise<void> {
    const categoryData = req.body;
    try {
      const newCategory = await categoryService.createCategory(categoryData);
      res.status(201).json(newCategory);
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async updateCategory(req: Request, res: Response): Promise<void> {
    const categoryId: number = parseInt(req.params.id);
    const updateData = req.body;
    try {
      const updatedCategory = await categoryService.updateCategory(
        categoryId,
        updateData
      );
      if (updatedCategory) {
        res.status(200).json(updatedCategory);
      } else {
        res.status(404).json({ error: "Category not found" });
      }
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async deleteCategory(req: Request, res: Response): Promise<void> {
    const categoryId: number = parseInt(req.params.id);
    try {
      await categoryService.deleteCategory(categoryId);
      res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default new CategoryController();
