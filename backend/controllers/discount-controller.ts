import { Request, Response } from "express";
import { DiscountService } from "../services/discount-service";

const discountService = new DiscountService();

class DiscountController {
  async validateDiscount(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      if (!user) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }

      const { code, totalAmount } = req.body;

      if (!code || typeof code !== "string") {
        res.status(400).json({ error: "Discount code is required" });
        return;
      }

      if (!totalAmount || typeof totalAmount !== "number" || totalAmount <= 0) {
        res.status(400).json({ error: "Valid total amount is required" });
        return;
      }

      const validation = await discountService.validateDiscountCode(
        code,
        user.id,
        totalAmount
      );

      if (!validation.valid) {
        res.status(400).json({
          valid: false,
          error: validation.error || "Invalid discount code",
        });
        return;
      }

      res.json({
        valid: true,
        discount: {
          code: validation.discount!.code,
          name: validation.discount!.name,
          discountPercentage: validation.discount!.discount_percentage,
        },
        discountAmount: validation.discountAmount,
        finalAmount: totalAmount - (validation.discountAmount || 0),
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async createDiscount(req: Request, res: Response): Promise<void> {
    try {
      const {
        name,
        code,
        discount_percentage,
        start_date,
        end_date,
        for_new_users_only,
        max_uses_per_user,
        max_total_uses,
        productId,
      } = req.body;

      if (!name || !code || !discount_percentage) {
        res.status(400).json({
          error: "Name, code, and discount_percentage are required",
        });
        return;
      }

      const discountData: any = {
        name,
        code: code.toUpperCase(),
        discount_percentage: parseFloat(discount_percentage),
        for_new_users_only: for_new_users_only || false,
        max_uses_per_user: max_uses_per_user || 1,
        max_total_uses: max_total_uses || null,
        current_total_uses: 0,
        active: true,
      };

      if (start_date) {
        discountData.start_date = new Date(start_date);
      }

      if (end_date) {
        discountData.end_date = new Date(end_date);
      }

      if (productId) {
        const { Product } = await import("../core/db/entity/product");
        const productRepository = (await import("../core/data-source")).appDataSource.getRepository(Product);
        const product = await productRepository.findOne({ where: { id: productId } });
        if (product) {
          discountData.product = product;
        }
      }

      const discount = await discountService.createDiscount(discountData);

      res.status(201).json(discount);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new DiscountController();
