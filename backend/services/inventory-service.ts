import { ProductInventory } from "../core/db/entity/product_inventory";
import { appDataSource } from "../core/data-source";

export class InventoryService {
  private inventoryRepository = appDataSource.getRepository(ProductInventory);

  async getAllInventories(): Promise<ProductInventory[] | null> {
    return this.inventoryRepository.find();
  }

  async getInventoryById(
    inventoryId: number
  ): Promise<ProductInventory | null> {
    return this.inventoryRepository.findOneBy({ id: inventoryId });
  }

  async createInventory(
    inventoryData: Partial<ProductInventory>
  ): Promise<ProductInventory> {
    const inventory = this.inventoryRepository.create(inventoryData);
    return this.inventoryRepository.save(inventory);
  }

  async updateInventory(
    inventoryId: number,
    updateData: Partial<ProductInventory>
  ): Promise<ProductInventory | undefined> {
    const inventory = await this.inventoryRepository.findOneBy({
      id: inventoryId,
    });
    if (!inventory) {
      throw new Error("Inventory not found");
    }
    Object.assign(inventory, updateData);
    return this.inventoryRepository.save(inventory);
  }

  async deleteCategory(inventoryId: number): Promise<void> {
    await this.inventoryRepository.delete(inventoryId);
  }
}
