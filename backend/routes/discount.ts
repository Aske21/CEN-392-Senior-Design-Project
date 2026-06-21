import express from "express";
import DiscountController from "../controllers/discount-controller";
import { authMiddleware } from "../middleware/auth-middleware";
import { adminMiddleware } from "../middleware/admin-middleware";

const router = express.Router();

router.get("/", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    await DiscountController.getAllDiscounts(req, res);
  } catch (error) {
    next(error);
  }
});

router.post("/validate", authMiddleware, async (req, res, next) => {
  try {
    await DiscountController.validateDiscount(req, res);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/create",
  authMiddleware,
  adminMiddleware,
  async (req, res, next) => {
    try {
      await DiscountController.createDiscount(req, res);
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res, next) => {
    try {
      await DiscountController.deleteDiscount(req, res);
    } catch (error) {
      next(error);
    }
  },
);

export default router;
