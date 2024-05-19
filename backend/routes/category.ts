import { CategoryController } from "../controllers/category-controller";
import express from "express";

const router = express.Router();
const categoryController = new CategoryController();

router.get("/:id", categoryController.getCategoryById);
router.get("/", categoryController.getAllCategories);
router.post("/", categoryController.createCategory);
router.put("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

export default router;
