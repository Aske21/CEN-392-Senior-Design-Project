export const LOW_STOCK_THRESHOLD = 5;

export type StockStatus = "out" | "low" | "in";

export function getStockQuantity(product: { stockQuantity?: number }): number {
  const value = Number(product?.stockQuantity);
  return Number.isFinite(value) && value > 0 ? value : 0;
}

export function getStockStatus(quantity: number): StockStatus {
  if (quantity <= 0) return "out";
  if (quantity <= LOW_STOCK_THRESHOLD) return "low";
  return "in";
}

export function stockBadgeVariant(
  status: StockStatus,
): "success" | "warning" | "destructive" {
  switch (status) {
    case "in":
      return "success";
    case "low":
      return "warning";
    case "out":
    default:
      return "destructive";
  }
}
