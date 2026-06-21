import { ProductController } from "../controllers/product-controller";
import express from "express";
import { authMiddleware } from "../middleware/auth-middleware";
import { adminMiddleware } from "../middleware/admin-middleware";

const router = express.Router();
const productController = new ProductController();

router.get("/newlyadded", (req, res) =>
  productController.getNewlyAddedProducts(req, res),
);
router.get("/", (req, res) => productController.getAllProducts(req, res));
router.get("/:id/recommendations", (req, res) =>
  productController.getRecommendedProducts(req, res),
);
router.get("/:id", (req, res) => productController.getProductById(req, res));
router.post("/", authMiddleware, adminMiddleware, (req, res) =>
  productController.createProduct(req, res),
);
router.put("/:id", authMiddleware, adminMiddleware, (req, res) =>
  productController.updateProduct(req, res),
);
router.delete("/:id", authMiddleware, adminMiddleware, (req, res) =>
  productController.deleteProduct(req, res),
);

export default router;
