import { CategoryController } from "../controllers/category-controller";
import express from "express";
import { authMiddleware } from "../middleware/auth-middleware";
import { adminMiddleware } from "../middleware/admin-middleware";

const router = express.Router();
const categoryController = new CategoryController();

router.get("/:id", categoryController.getCategoryById);
router.get("/", categoryController.getAllCategories);
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  categoryController.createCategory,
);
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  categoryController.updateCategory,
);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  categoryController.deleteCategory,
);

export default router;
