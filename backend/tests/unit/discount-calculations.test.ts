import { describe, expect, it } from "vitest";
import { calculateDiscountAmount } from "../../services/discount-calculations";

describe("calculateDiscountAmount", () => {
  it("calculates a percentage discount and rounds to two decimals", () => {
    expect(calculateDiscountAmount(99.99, 10)).toBe(10);
    expect(calculateDiscountAmount(50, 15)).toBe(7.5);
  });

  it("returns 0 when the discount percentage is 0", () => {
    expect(calculateDiscountAmount(100, 0)).toBe(0);
  });
});
