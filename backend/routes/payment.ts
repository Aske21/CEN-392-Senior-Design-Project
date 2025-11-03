import express from "express";
import StripeController from "../controllers/payment-controller";
import { authMiddleware } from "../middleware/auth-middleware";

const router = express.Router();
const stripeController = new StripeController();

// Protected route - requires authentication
router.post("/create-checkout-session", authMiddleware, stripeController.createCheckoutSession);
// Webhook doesn't need auth middleware as Stripe signs the requests
router.post("/webhook", stripeController.handleWebhookEvent);

export default router;
