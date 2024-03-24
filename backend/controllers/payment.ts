import { Request, Response } from "express";
import { StripeService } from "../services/payment/index";
import config from "../core/config";

const stripeService = new StripeService(
  process.env.STRIPE_SECRET_KEY as string
);

class StripeController {
  async createCheckoutSession(req: Request, res: Response): Promise<void> {
    try {
      const { items } = req.body;
      const sessionUrl = await stripeService.createCheckoutSession();
      res.json({ url: sessionUrl });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default StripeController;
