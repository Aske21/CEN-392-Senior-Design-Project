import { Inventory } from "./../core/db/entity/inventory";
import { appDataSource } from "../core/data-source";

export class InventorySerice {
  private inventoryRepository = appDataSource.getRepository(Inventory);

  async getAllCategories(): Promise<Inventory[] | null> {
    return this.inventoryRepository.find();
  }

  async getInventoryById(inventoryId: number): Promise<Inventory | null> {
    return this.inventoryRepository.findOneBy({ id: inventoryId });
  }

  async createInventory(inventoryData: Partial<Inventory>): Promise<Inventory> {
    const inventory = this.inventoryRepository.create(inventoryData);
    return this.inventoryRepository.save(inventory);
  }

  async updateCategory(
    inventoryId: number,
    updateData: Partial<Inventory>
  ): Promise<Inventory | undefined> {
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
