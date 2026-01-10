import express from "express";
import DiscountController from "../controllers/discount-controller";
import { authMiddleware } from "../middleware/auth-middleware";

const router = express.Router();

router.post(
  "/validate",
  authMiddleware,
  async (req, res, next) => {
    try {
      await DiscountController.validateDiscount(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/create",
  authMiddleware,
  async (req, res, next) => {
    try {
      await DiscountController.createDiscount(req, res);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
