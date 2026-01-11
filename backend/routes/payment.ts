import express from "express";
import StripeController from "../controllers/payment-controller";
import { authMiddleware } from "../middleware/auth-middleware";

const router = express.Router();
const stripeController = new StripeController();

// Stripe webhook needs raw body for signature verification
// This must be before the JSON parser middleware
const webhookRouter = express.Router();
webhookRouter.use(express.raw({ type: "application/json" }));
webhookRouter.post("/webhook", stripeController.handleWebhookEvent);

// Protected route - requires authentication
router.post(
  "/create-checkout-session",
  authMiddleware,
  stripeController.createCheckoutSession
);
// Get order by payment ID (session ID) - accessible without auth since payment ID is unique
router.get(
  "/order/:paymentId",
  stripeController.getOrderByPaymentId
);

export { webhookRouter };
export default router;
