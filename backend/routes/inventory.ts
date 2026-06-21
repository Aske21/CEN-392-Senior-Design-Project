import { InventoryController } from "../controllers/inventory-controller";
import express from "express";
import { authMiddleware } from "../middleware/auth-middleware";
import { adminMiddleware } from "../middleware/admin-middleware";

const router = express.Router();
const inventoryController = new InventoryController();

router.get("/:id", inventoryController.getInventoryById);
router.get("/", inventoryController.getAllInventories);
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  inventoryController.createInventory,
);
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  inventoryController.updateInventory,
);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  inventoryController.deleteInventory,
);

export default router;
