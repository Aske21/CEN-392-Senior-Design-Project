import express from "express";
import StripeController from "../controllers/payment-controller";

const router = express.Router();
const stripeController = new StripeController();

router.post("/create-checkout-session", stripeController.createCheckoutSession);
router.post("/webhook", stripeController.handleWebhookEvent);

export default router;
