import { OrderDetailsService } from "./../services/order-details-service";
import { Request, Response } from "express";
import { StripeService } from "../services/payment-service";
import { Order } from "../core/db/entity/order";
import { OrderStatus } from "../enums/OrderStatus";
import { ProductService } from "../services/product-service";
import { OrderService } from "../services/order-service";
import { OrderDetails } from "../core/db/entity/order_details";
import { authMiddleware } from "../middleware/auth-middleware";

const stripeService = new StripeService(
  process.env.STRIPE_SECRET_KEY as string
);

class StripeController {
  async createCheckoutSession(req: Request, res: Response): Promise<void> {
    try {
      // User is attached by auth middleware
      const user = (req as any).user;

      if (!user) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }

      const { items, shippingAddress, discountCode } = req.body;

      if (!items || !Array.isArray(items) || items.length === 0) {
        res.status(400).json({ error: "Items are required" });
        return;
      }

      let totalAmount = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      let discountAmount = 0;
      let appliedDiscountCode = null;

      if (discountCode) {
        const { DiscountService } = await import(
          "../services/discount-service"
        );
        const discountService = new DiscountService();
        const validation = await discountService.validateDiscountCode(
          discountCode,
          user.id,
          totalAmount
        );

        if (validation.valid && validation.discountAmount) {
          discountAmount = validation.discountAmount;
          appliedDiscountCode = validation.discount!.code;
          totalAmount = totalAmount - discountAmount;
        }
      }

      const sessionUrl = await stripeService.createCheckoutSession(
        items,
        user.id,
        shippingAddress,
        discountAmount,
        appliedDiscountCode
      );

      res.json({ url: sessionUrl });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async handleWebhookEvent(req: Request, res: Response): Promise<void> {
    // TODO: Create order details on purchase
    const productService = new ProductService();
    const orderService = new OrderService();
    // const orderDetailsService = new OrderDetailsService();

    try {
      const event = req.body;

      switch (event.type) {
        case "checkout.session.completed":
          const paymentId = event.data.object.id;
          const sessionData = event.data.object;
          const userId = parseInt(sessionData.metadata?.userId || "0");
          const shippingAddress =
            sessionData.metadata?.shippingAddress || "Not provided";

          if (!userId) {
            throw new Error("User ID not found in session metadata");
          }

          // Get user from database
          const { AuthService } = await import("../services/auth-service");
          const authService = new AuthService();
          const user = await authService.getUserById(userId);

          if (!user) {
            throw new Error(`User with ID ${userId} not found`);
          }

          // Calculate total amount from line items
          let totalAmount = 0;
          if (sessionData.amount_total) {
            totalAmount = sessionData.amount_total / 100; // Convert from cents to dollars
          }

          const discountCode = sessionData.metadata?.discountCode || null;
          const discountAmount = sessionData.metadata?.discountAmount
            ? parseFloat(sessionData.metadata.discountAmount)
            : undefined;

          const newOrderData: Partial<Order> = {
            paymentId: paymentId,
            user: user,
            orderDate: new Date(),
            totalAmount: totalAmount,
            discountAmount: discountAmount,
            discountCode: discountCode,
            shippingAddress: shippingAddress,
            status: OrderStatus.Paid,
          };

          if (discountCode) {
            const { DiscountService } = await import(
              "../services/discount-service"
            );
            const discountService = new DiscountService();
            await discountService.applyDiscount(
              discountCode,
              userId,
              totalAmount + (discountAmount || 0)
            );
          }

          const createdOrder = await orderService.createOrder(newOrderData);

          // Create order details from line items if available
          if (sessionData.line_items) {
            const orderDetailsService = new OrderDetailsService();
            // Note: Stripe API requires expanding line_items, so we might need to fetch the session with expanded line_items
            // For now, we'll leave this as a TODO and handle it in a future update
          }

          // let totalAmount = 0;

          // for (const item of purchasedItems) {
          //   const product = await productService.getProductByName(item.name);

          //   if (!product) {
          //     throw new Error(`Product not found: ${item.name}`);
          //   }

          //   const subtotal = item.quantity * product.price;
          //   totalAmount += subtotal;

          //   const orderDetailData: Partial<OrderDetails> = {
          //     order: order,
          //     product: item,
          //     quantity: item.quantity,
          //   };

          //   await orderDetailsService.createOrderDetails(orderDetailData);
          // }

          // await orderService.updateOrderStatus(order.id, OrderStatus.Paid);

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
