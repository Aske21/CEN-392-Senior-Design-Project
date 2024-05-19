import { InventoryController } from "../controllers/inventory-controller";
import express from "express";

const router = express.Router();
const inventoryController = new InventoryController();

router.get("/:id", inventoryController.getInventoryById);
router.get("/", inventoryController.getAllInventories);
router.post("/", inventoryController.createInventory);
router.put("/:id", inventoryController.updateInventory);
router.delete("/:id", inventoryController.deleteInventory);

export default router;
