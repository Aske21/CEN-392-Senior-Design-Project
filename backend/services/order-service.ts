import { Order } from "../core/db/entity/order";
import { appDataSource } from "../core/data-source";

export class OrderService {
  private orderRepository = appDataSource.getRepository(Order);

  async getOrderById(orderId: number): Promise<Order | null> {
    return this.orderRepository.findOneBy({ id: orderId });
  }

  async getAllOrders(): Promise<Order[] | null> {
    return this.orderRepository.find();
  }

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    const order = this.orderRepository.create(orderData);
    return this.orderRepository.save(order);
  }

  async updateOrder(
    orderId: number,
    updateData: Partial<Order>
  ): Promise<Order | undefined> {
    const order = await this.orderRepository.findOneBy({ id: orderId });
    if (!order) {
      throw new Error("Order not found");
    }
    Object.assign(order, updateData);
    return this.orderRepository.save(order);
  }

  async deleteOrder(orderId: number): Promise<void> {
    await this.orderRepository.delete(orderId);
  }
}
