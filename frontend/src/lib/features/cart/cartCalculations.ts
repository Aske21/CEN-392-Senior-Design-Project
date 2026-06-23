export type CartLineItem = {
  price: number;
  quantity: number;
};

export function calculateCartSubtotal(items: CartLineItem[]): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

export function calculateOrderTotal(
  subtotal: number,
  discountAmount = 0,
): number {
  return Math.max(0, subtotal - discountAmount);
}
