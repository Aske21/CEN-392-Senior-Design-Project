import { Stripe } from "stripe";

export class StripeService {
  private stripe: Stripe;

  constructor(apiKey: string) {
    this.stripe = new Stripe(apiKey, {});
  }

  async createCheckoutSession(items: any[]) {
    try {
      const lineItems = items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.title,
            description: item.description,
            images: [item.imageSrc],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }));

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: lineItems,
        success_url: `${process.env.CLIENT_URL}/`,
        cancel_url: `${process.env.CLIENT_URL}/`,
      });

      return session.url;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
