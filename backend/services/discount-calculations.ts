export function calculateDiscountAmount(
  totalAmount: number,
  discountPercentage: number,
): number {
  const discountAmount = (totalAmount * discountPercentage) / 100;
  return Math.round(discountAmount * 100) / 100;
}
