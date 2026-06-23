import { describe, expect, it } from "vitest";
import {
  calculateCartSubtotal,
  calculateOrderTotal,
} from "./cartCalculations";

describe("calculateCartSubtotal", () => {
  it("sums price times quantity for all cart lines", () => {
    expect(
      calculateCartSubtotal([
        { price: 10, quantity: 2 },
        { price: 5.5, quantity: 1 },
      ]),
    ).toBe(25.5);
  });

  it("returns 0 for an empty cart", () => {
    expect(calculateCartSubtotal([])).toBe(0);
  });
});

describe("calculateOrderTotal", () => {
  it("subtracts a discount from the subtotal", () => {
    expect(calculateOrderTotal(100, 15)).toBe(85);
  });

  it("never returns a negative total", () => {
    expect(calculateOrderTotal(10, 25)).toBe(0);
  });
});
