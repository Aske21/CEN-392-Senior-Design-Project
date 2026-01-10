import { Stripe } from "stripe";

export class StripeService {
  private stripe: Stripe;

  constructor(apiKey: string) {
    this.stripe = new Stripe(apiKey, {});
  }

  async createCheckoutSession(
    items: any[],
    userId: number,
    shippingAddress?: string,
    discountAmount: number = 0,
    discountCode?: string | null
  ) {
    try {
      const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

      let totalAmount = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      const lineItems = items.map((item) => {
        let images: string[] = [];
        if (
          item.imageSrc &&
          typeof item.imageSrc === "string" &&
          item.imageSrc.trim() !== ""
        ) {
          try {
            new URL(item.imageSrc);
            images = [item.imageSrc];
          } catch (urlError) {
            images = [];
          }
        }

        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: item.title,
              description: item.description,
              images: images,
            },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity,
        };
      });

      if (discountAmount > 0) {
        const discountAmountInCents = Math.round(discountAmount * 100);
        lineItems.push({
          price_data: {
            currency: "usd",
            product_data: {
              name: `Discount${discountCode ? ` (${discountCode})` : ""}`,
              description: "Discount applied",
              images: [],
            },
            unit_amount: -discountAmountInCents,
          },
          quantity: 1,
        });
      }

      const successUrl = `${CLIENT_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${CLIENT_URL}/cart`;

      try {
        new URL(successUrl.replace("{CHECKOUT_SESSION_ID}", "test"));
        new URL(cancelUrl);
      } catch (urlError: any) {
        throw new Error(`Invalid URL format: ${urlError.message}`);
      }

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: lineItems,
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          userId: userId.toString(),
          shippingAddress: shippingAddress || "",
          discountCode: discountCode || "",
          discountAmount: discountAmount.toString(),
        },
      });

      return session.url;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
