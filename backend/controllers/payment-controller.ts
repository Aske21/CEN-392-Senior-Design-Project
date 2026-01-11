import { OrderDetailsService } from "./../services/order-details-service";
import { Request, Response } from "express";
import { StripeService } from "../services/payment-service";
import { Order } from "../core/db/entity/order";
import { OrderStatus } from "../enums/OrderStatus";
import { ProductService } from "../services/product-service";
import { OrderService } from "../services/order-service";
import { OrderDetails } from "../core/db/entity/order_details";
import { Product } from "../core/db/entity/product";
import { appDataSource } from "../core/data-source";
import { authMiddleware } from "../middleware/auth-middleware";
import { AuthService } from "../services/auth-service";
import { DiscountService } from "../services/discount-service";
import { InventoryService } from "../services/inventory-service";

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

  async getOrderByPaymentId(req: Request, res: Response): Promise<void> {
    try {
      const { paymentId } = req.params;
      const orderService = new OrderService();

      if (!paymentId) {
        res.status(400).json({ error: "Payment ID is required" });
        return;
      }

      const order = await orderService.getOrderByPaymentId(paymentId);

      if (!order) {
        res.status(404).json({ error: "Order not found" });
        return;
      }

      res.json(order);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async handleWebhookEvent(req: Request, res: Response): Promise<void> {
    const productService = new ProductService();
    const orderService = new OrderService();
    const orderDetailsService = new OrderDetailsService();

    try {
      // Get the raw body for signature verification
      const sig = req.headers["stripe-signature"] as string;
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

      let event;

      // req.body is a Buffer when using express.raw()
      const body = Buffer.isBuffer(req.body) ? req.body : req.body;

      if (webhookSecret) {
        // Verify webhook signature in production
        try {
          event = stripeService.stripe.webhooks.constructEvent(
            body,
            sig,
            webhookSecret
          );
        } catch (err: any) {
          console.error("Webhook signature verification failed:", err.message);
          res.status(400).send(`Webhook Error: ${err.message}`);
          return;
        }
      } else {
        // In development, parse the body directly
        if (Buffer.isBuffer(body)) {
          event = JSON.parse(body.toString());
        } else if (typeof body === "string") {
          event = JSON.parse(body);
        } else {
          event = body;
        }
        console.warn(
          "⚠️  Stripe webhook secret not set - skipping signature verification"
        );
      }

      console.log("Received webhook event:", event.type);
      console.log("Event data:", JSON.stringify(event.data, null, 2));

      switch (event.type) {
        case "checkout.session.completed":
          console.log("Processing checkout.session.completed event...");
          const paymentId = event.data.object.id;
          const sessionId = event.data.object.id;
          const sessionData = event.data.object;
          const userId = parseInt(sessionData.metadata?.userId || "0");
          const shippingAddress =
            sessionData.metadata?.shippingAddress || "Not provided";

          if (!userId) {
            throw new Error("User ID not found in session metadata");
          }

          // Get user from database
          const authService = new AuthService();
          const user = await authService.getUserById(userId);

          if (!user) {
            throw new Error(`User with ID ${userId} not found`);
          }

          // Retrieve the full session with expanded line_items
          const fullSession = await stripeService.getCheckoutSession(sessionId);

          // Calculate total amount from line items
          let totalAmount = 0;
          if (fullSession.amount_total) {
            totalAmount = fullSession.amount_total / 100; // Convert from cents to dollars
          }

          // Get shipping address from Stripe session (collected during checkout)
          // Format: { name, line1, line2, city, state, postal_code, country }
          let finalShippingAddress = shippingAddress;
          if (fullSession.shipping_details?.address) {
            const addr = fullSession.shipping_details.address;
            const name = fullSession.shipping_details.name || "";
            finalShippingAddress = `${name}\n${addr.line1 || ""}${
              addr.line2 ? `, ${addr.line2}` : ""
            }\n${addr.city || ""}, ${addr.state || ""} ${
              addr.postal_code || ""
            }\n${addr.country || ""}`.trim();
          }

          const discountCode = fullSession.metadata?.discountCode || undefined;
          const discountAmount = fullSession.metadata?.discountAmount
            ? parseFloat(fullSession.metadata.discountAmount)
            : undefined;

          const newOrderData: Partial<Order> = {
            paymentId: paymentId,
            user: user,
            orderDate: new Date(),
            totalAmount: totalAmount,
            discountAmount: discountAmount,
            discountCode: discountCode,
            shippingAddress: finalShippingAddress || "Not provided",
            status: OrderStatus.Paid,
          };

          // Apply discount if applicable
          if (discountCode) {
            const discountService = new DiscountService();
            await discountService.applyDiscount(
              discountCode,
              userId,
              totalAmount + (discountAmount || 0)
            );
          }

          // Create the order
          console.log("Creating order with data:", {
            paymentId,
            userId: user.id,
            totalAmount,
            discountAmount,
            discountCode,
            shippingAddress,
          });

          const createdOrder = await orderService.createOrder(newOrderData);

          console.log("Order created successfully:", {
            orderId: createdOrder.id,
            paymentId: createdOrder.paymentId,
            userId: createdOrder.user?.id || "user not loaded",
            totalAmount: createdOrder.totalAmount,
          });

          // Create order details from line items
          if (fullSession.line_items && fullSession.line_items.data) {
            const inventoryService = new InventoryService();

            for (const lineItem of fullSession.line_items.data) {
              // Skip discount line items
              if (
                lineItem.price?.product &&
                typeof lineItem.price.product === "object" &&
                "name" in lineItem.price.product &&
                lineItem.price.product.name?.toLowerCase().includes("discount")
              ) {
                continue;
              }

              // Get product ID from metadata or product name
              let product: any = null;
              const productId =
                lineItem.price?.product &&
                typeof lineItem.price.product === "object" &&
                "metadata" in lineItem.price.product &&
                (lineItem.price.product as any).metadata?.productId
                  ? parseInt((lineItem.price.product as any).metadata.productId)
                  : null;

              if (productId) {
                // Get product with inventory relation loaded
                const productRepo = appDataSource.getRepository(Product);
                product = await productRepo.findOne({
                  where: { id: productId },
                  relations: ["inventory_id", "category"],
                });
              }

              // Fallback to finding by name if product ID not found
              if (!product && lineItem.price?.product) {
                const productName =
                  typeof lineItem.price.product === "string"
                    ? lineItem.price.product
                    : (lineItem.price.product as any).name;
                if (productName) {
                  const productRepo = appDataSource.getRepository(Product);
                  product = await productRepo.findOne({
                    where: { name: productName },
                    relations: ["inventory_id", "category"],
                  });
                }
              }

              if (!product) {
                console.error(
                  `Product not found for line item: ${JSON.stringify(lineItem)}`
                );
                continue;
              }

              // Create order detail
              const orderDetailData: Partial<OrderDetails> = {
                order: createdOrder,
                product: product,
                quantity: lineItem.quantity || 1,
              };

              const createdOrderDetail =
                await orderDetailsService.createOrderDetails(orderDetailData);

              console.log("Order detail created:", {
                orderDetailId: createdOrderDetail.id,
                orderId: createdOrderDetail.order?.id || "order not loaded",
                productId:
                  createdOrderDetail.product?.id || "product not loaded",
                quantity: createdOrderDetail.quantity,
              });

              // Update inventory quantity
              if (product.inventory_id && product.inventory_id.id) {
                const inventory = await inventoryService.getInventoryById(
                  product.inventory_id.id
                );
                if (inventory) {
                  const newQuantity = Math.max(
                    0,
                    inventory.total_stock_quantity - (lineItem.quantity || 1)
                  );
                  await inventoryService.updateInventory(inventory.id, {
                    total_stock_quantity: newQuantity,
                  });
                  console.log(
                    `Updated inventory for product ${product.id}: ${inventory.total_stock_quantity} -> ${newQuantity}`
                  );
                }
              }
            }
          }

          console.log("✅ Order created successfully via webhook");
          res.status(200).send("Webhook received successfully");
          break;
        default:
          console.log(`⚠️  Unhandled webhook event type: ${event.type}`);
          res.status(200).send("Webhook received, but not handled");
      }
    } catch (error: any) {
      console.error("❌ Webhook error:", error);
      console.error("Error stack:", error.stack);
      res.status(500).json({
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  }
}

export default StripeController;
