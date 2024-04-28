import { OrderDetailsService } from "./../services/order-details-service";
import { Request, Response } from "express";
import { StripeService } from "../services/payment-service";
import { Order } from "../core/db/entity/order";
import { OrderStatus } from "../enums/OrderStatus";
import { ProductService } from "../services/product-service";
import { OrderService } from "../services/order-service";
import { OrderDetails } from "../core/db/entity/orderDetails";
import { UserType } from "../enums/UserType";

const stripeService = new StripeService(
  process.env.STRIPE_SECRET_KEY as string
);

class StripeController {
  async createCheckoutSession(req: Request, res: Response): Promise<void> {
    try {
      const { items } = req.body;
      const sessionUrl = await stripeService.createCheckoutSession(items);
      res.json({ url: sessionUrl });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async handleWebhookEvent(req: Request, res: Response): Promise<void> {
    const productService = new ProductService();
    const orderService = new OrderService();
    const orderDetailsService = new OrderDetailsService();

    try {
      const event = req.body;

      switch (event.type) {
        case "checkout.session.completed":
          const paymentId = event.data.object.id;
          const customerId = event.data.object.customer;
          const purchasedItems = event.data.object.display_items;

          const user = {
            id: 1,
            google_id: "dummyGoogleId123",
            email: "dummy@example.com",
            username: "dummyUser",
            user_type: UserType.CUSTOMER,
            orders: [],
          };

          const newOrderData: Partial<Order> = {
            paymentId: paymentId,
            user: user,
            orderDate: new Date(),
            totalAmount: 0,
            shippingAddress: "Address goes here",
            status: OrderStatus.Pending,
          };

          const order = await orderService.createOrder(newOrderData);

          let totalAmount = 0;

          for (const item of purchasedItems) {
            const product = await productService.getProductByName(item.name);

            if (!product) {
              throw new Error(`Product not found: ${item.name}`);
            }

            const subtotal = item.quantity * product.price;
            totalAmount += subtotal;

            const orderDetailData: Partial<OrderDetails> = {
              order: order,
              products: purchasedItems,
              quantity: item.quantity,
            };

            await orderDetailsService.createOrderDetails(orderDetailData);
          }

          await orderService.updateOrderStatus(order.id, OrderStatus.Paid);

          res.status(200).send("Webhook received successfully");
          break;
        default:
          res.status(200).send("Webhook received, but not handled");
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default StripeController;
