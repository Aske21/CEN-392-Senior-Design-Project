import express from "express";
import OrderController from "../controllers/order-controller";
import { authMiddleware } from "../middleware/auth-middleware";

const router = express.Router();
const orderController = new OrderController();

// Protected route - requires authentication
router.get(
  "/user-orders",
  authMiddleware,
  orderController.getUserOrders
);

export default router;
