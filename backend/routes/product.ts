import { ProductController } from "../controllers/product-controller";
import express from "express";

const router = express.Router();
const productController = new ProductController();

router.get("/newlyadded", productController.getNewlyAddedProducts);
router.get("/:id", productController.getProductById);
router.get("/", productController.getAllProducts);
router.post("/", productController.createProduct);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

export default router;
