import { Request, Response } from "express";
import { StripeService } from "../services/payment-service";
import config from "../core/config";

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
    try {
      const event = req.body;

      switch (event.type) {
        case "checkout.session.completed":
          const paymentId = event.data.object.id;
          const customerId = event.data.object.customer;
          const purchasedItems = event.data.object.display_items;

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
