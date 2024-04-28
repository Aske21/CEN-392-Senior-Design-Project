import express from "express";
import StripeController from "../controllers/payment-controller";

const router = express.Router();
const stripeController = new StripeController();

router.post("/create-checkout-session", stripeController.createCheckoutSession);

export default router;
