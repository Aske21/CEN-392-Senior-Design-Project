import { appDataSource } from "../core/data-source";
import { ProductDiscount } from "../core/db/entity/product_discount";
import { DiscountUsage } from "../core/db/entity/discount_usage";
import { Users } from "../core/db/entity/user";
import { Order } from "../core/db/entity/order";

export interface DiscountValidationResult {
  valid: boolean;
  discount?: ProductDiscount;
  discountAmount?: number;
  error?: string;
}

export class DiscountService {
  private discountRepository = appDataSource.getRepository(ProductDiscount);
  private discountUsageRepository = appDataSource.getRepository(DiscountUsage);
  private orderRepository = appDataSource.getRepository(Order);

  async validateDiscountCode(
    code: string,
    userId: number,
    totalAmount: number
  ): Promise<DiscountValidationResult> {
    const discount = await this.discountRepository.findOne({
      where: { code: code.toUpperCase(), active: true },
      relations: ["product"],
    });

    if (!discount) {
      return {
        valid: false,
        error: "Invalid discount code",
      };
    }

    const now = new Date();

    if (discount.start_date && now < discount.start_date) {
      return {
        valid: false,
        error: "Discount code is not yet active",
      };
    }

    if (discount.end_date && now > discount.end_date) {
      return {
        valid: false,
        error: "Discount code has expired",
      };
    }

    if (discount.max_total_uses && discount.current_total_uses >= discount.max_total_uses) {
      return {
        valid: false,
        error: "Discount code has reached maximum uses",
      };
    }

    const user = await appDataSource.getRepository(Users).findOne({
      where: { id: userId },
      relations: ["orders"],
    });

    if (!user) {
      return {
        valid: false,
        error: "User not found",
      };
    }

    if (discount.for_new_users_only) {
      const hasOrders = await this.orderRepository.count({
        where: { user: { id: userId } },
      });

      if (hasOrders > 0) {
        return {
          valid: false,
          error: "This discount is only available for new users",
        };
      }
    }

    let discountUsage = await this.discountUsageRepository.findOne({
      where: {
        user: { id: userId },
        discount: { id: discount.id },
      },
      relations: ["user", "discount"],
    });

    if (!discountUsage) {
      discountUsage = this.discountUsageRepository.create({
        user,
        discount,
        times_used: 0,
      });
      await this.discountUsageRepository.save(discountUsage);
    }

    if (discountUsage.times_used >= discount.max_uses_per_user) {
      return {
        valid: false,
        error: "You have already used this discount code",
      };
    }

    const discountAmount = (totalAmount * discount.discount_percentage) / 100;

    return {
      valid: true,
      discount,
      discountAmount: Math.round(discountAmount * 100) / 100,
    };
  }

  async applyDiscount(
    code: string,
    userId: number,
    totalAmount: number
  ): Promise<DiscountValidationResult> {
    const validation = await this.validateDiscountCode(code, userId, totalAmount);

    if (!validation.valid || !validation.discount) {
      return validation;
    }

    const discountUsage = await this.discountUsageRepository.findOne({
      where: {
        user: { id: userId },
        discount: { id: validation.discount.id },
      },
    });

    if (discountUsage) {
      discountUsage.times_used += 1;
      await this.discountUsageRepository.save(discountUsage);
    }

    validation.discount.current_total_uses += 1;
    await this.discountRepository.save(validation.discount);

    return validation;
  }

  async getDiscountByCode(code: string): Promise<ProductDiscount | null> {
    return this.discountRepository.findOne({
      where: { code: code.toUpperCase() },
    });
  }

  async createDiscount(discountData: Partial<ProductDiscount>): Promise<ProductDiscount> {
    const discount = this.discountRepository.create(discountData);
    return this.discountRepository.save(discount);
  }
}
