import { OrderDetails } from "../core/db/entity/order_details";
import { appDataSource } from "../core/data-source";

export class OrderDetailsService {
  private orderDetailsRepository = appDataSource.getRepository(OrderDetails);

  async getOrderDetailsById(
    orderDetailsId: number
  ): Promise<OrderDetails | null> {
    return this.orderDetailsRepository.findOneBy({ id: orderDetailsId });
  }

  async getAllOrderDetails(): Promise<OrderDetails[] | null> {
    return this.orderDetailsRepository.find();
  }

  async createOrderDetails(
    orderDetailsData: Partial<OrderDetails>
  ): Promise<OrderDetails> {
    const orderDetails = this.orderDetailsRepository.create(orderDetailsData);
    return this.orderDetailsRepository.save(orderDetails);
  }

  async updateOrderDetails(
    orderDetailsId: number,
    updateData: Partial<OrderDetails>
  ): Promise<OrderDetails | undefined> {
    const orderDetails = await this.orderDetailsRepository.findOneBy({
      id: orderDetailsId,
    });
    if (!orderDetails) {
      throw new Error("Order details not found");
    }
    Object.assign(orderDetails, updateData);
    return this.orderDetailsRepository.save(orderDetails);
  }

  async deleteOrderDetails(orderDetailsId: number): Promise<void> {
    await this.orderDetailsRepository.delete(orderDetailsId);
  }
}
