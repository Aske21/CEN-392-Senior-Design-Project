import { Order } from "../core/db/entity/order";
import { appDataSource } from "../core/data-source";
import { OrderStatus } from "../enums/OrderStatus";

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

  async updateOrderStatus(
    orderId: number,
    newStatus: OrderStatus
  ): Promise<void> {
    const order = await this.orderRepository.findOneBy({ id: orderId });

    if (!order) {
      throw new Error("Order not found");
    }

    order.status = newStatus;
    await this.orderRepository.save(order);
  }

  async calculateOrderTotal(orderId: number): Promise<number> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ["orderDetails"],
    });

    if (!order) {
      throw new Error("Order not found");
    }

    let total = 0;

    for (const orderDetail of order.orderDetails) {
      const product = orderDetail.product;

      if (!product) {
        throw new Error("Product not found for order detail");
      }

      const subtotal = orderDetail.quantity * product.price;

      total += subtotal;
    }

    return total;
  }
}
