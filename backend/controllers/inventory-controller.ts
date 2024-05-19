import { Request, Response } from "express";
import { InventoryService } from "../services/inventory-service";

const inventoryService = new InventoryService();

export class InventoryController {
  async getAllInventories(req: Request, res: Response): Promise<void> {
    try {
      const inventories = await inventoryService.getAllInventories();
      res.status(200).json(inventories);
    } catch (error) {
      console.error("Error fetching inventories:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getInventoryById(req: Request, res: Response): Promise<void> {
    const inventoryId: number = parseInt(req.params.id);
    try {
      const inventory = await inventoryService.getInventoryById(inventoryId);
      if (inventory) {
        res.status(200).json(inventory);
      } else {
        res.status(404).json({ error: "Inventory not found" });
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async createInventory(req: Request, res: Response): Promise<void> {
    const inventoryData = req.body;
    try {
      const newInventory = await inventoryService.createInventory(
        inventoryData
      );
      res.status(201).json(newInventory);
    } catch (error) {
      console.error("Error creating inventory:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async updateInventory(req: Request, res: Response): Promise<void> {
    const inventoryId: number = parseInt(req.params.id);
    const updateData = req.body;
    try {
      const updatedInventory = await inventoryService.updateInventory(
        inventoryId,
        updateData
      );
      if (updatedInventory) {
        res.status(200).json(updatedInventory);
      } else {
        res.status(404).json({ error: "Inventory not found" });
      }
    } catch (error) {
      console.error("Error updating inventory:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async deleteInventory(req: Request, res: Response): Promise<void> {
    const inventoryId: number = parseInt(req.params.id);
    try {
      await inventoryService.deleteCategory(inventoryId);
      res.status(200).json({ message: "Inventory deleted successfully" });
    } catch (error) {
      console.error("Error deleting inventory:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default new InventoryController();
