import { Order } from "../core/db/entity/order";
import { appDataSource } from "../core/data-source";
import { OrderStatus } from "../enums/OrderStatus";

export class OrderService {
  private orderRepository = appDataSource.getRepository(Order);

  async getOrderById(orderId: number): Promise<Order | null> {
    return this.orderRepository.findOne({
      where: { id: orderId },
      relations: ["user", "orderDetails", "orderDetails.product"],
    });
  }

  async getOrderByPaymentId(paymentId: string): Promise<Order | null> {
    return this.orderRepository.findOne({
      where: { paymentId },
      relations: ["user", "orderDetails", "orderDetails.product"],
    });
  }

  async getAllOrders(): Promise<Order[] | null> {
    return this.orderRepository.find();
  }

  async getOrdersByUserId(
    userId: number,
    page: number = 1,
    limit: number = 10
  ): Promise<{ orders: Order[]; total: number; page: number; limit: number; totalPages: number }> {
    const skip = (page - 1) * limit;

    const [orders, total] = await this.orderRepository.findAndCount({
      where: { user: { id: userId } },
      relations: ["orderDetails", "orderDetails.product"],
      order: { orderDate: "DESC" },
      skip,
      take: limit,
    });

    return {
      orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
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
}
