import { Stripe } from "stripe";

export class StripeService {
  private stripe: Stripe;

  constructor(apiKey: string) {
    this.stripe = new Stripe(apiKey, {});
  }

  async createCheckoutSession(
    items: { name: string; priceInCents: number; quantity: number }[]
  ): Promise<string> {
    try {
      const lineItems = items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: item.priceInCents,
        },
        quantity: item.quantity,
      }));

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: lineItems,
        success_url: `${process.env.CLIENT_URL}/success.html`,
        cancel_url: `${process.env.CLIENT_URL}/cancel.html`,
      });

      return session.url as string;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
