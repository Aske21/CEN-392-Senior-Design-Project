import { describe, expect, it } from "vitest";
import cartReducer, {
  addItem,
  clearCart,
  removeItem,
  updateItemQuantity,
} from "./cartSlice";
import { selectCartTotalItems } from "./cartSelectors";
import type { RootState } from "@/lib/store";

const sampleItem = {
  id: "product-1",
  title: "Test Product",
  description: "A test product",
  price: 19.99,
  quantity: 1,
  imageSrc: "/test.jpg",
};

describe("cartSlice", () => {
  it("adds a new item to an empty cart", () => {
    const state = cartReducer(undefined, addItem(sampleItem));

    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toEqual(sampleItem);
  });

  it("increments quantity when adding the same product again", () => {
    let state = cartReducer(undefined, addItem(sampleItem));
    state = cartReducer(state, addItem({ ...sampleItem, quantity: 2 }));

    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(3);
  });

  it("removes an item and updates quantity", () => {
    let state = cartReducer(undefined, addItem(sampleItem));
    state = cartReducer(
      state,
      updateItemQuantity({ id: sampleItem.id, quantity: 5 }),
    );
    state = cartReducer(state, removeItem(sampleItem.id));

    expect(state.items).toHaveLength(0);

    state = cartReducer(state, addItem(sampleItem));
    state = cartReducer(state, clearCart());

    expect(state.items).toHaveLength(0);
  });
});

describe("selectCartTotalItems", () => {
  it("returns the sum of item quantities", () => {
    const state = {
      cart: {
        items: [
          { ...sampleItem, quantity: 2 },
          { ...sampleItem, id: "product-2", quantity: 3 },
        ],
      },
      auth: {
        user: null,
        token: null,
        loading: false,
        error: null,
        initialized: true,
      },
      _persist: { version: -1, rehydrated: true },
    } as RootState;

    expect(selectCartTotalItems(state)).toBe(5);
  });
});
