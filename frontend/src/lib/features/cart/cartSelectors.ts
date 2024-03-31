import { RootState } from "@/lib/store";
import { createSelector } from "reselect";

export const selectCartItems = (state: RootState) => state.cart.items;

export const selectCartTotalItems = createSelector(selectCartItems, (items) =>
  items.reduce((total, item) => total + item.quantity, 0)
);
