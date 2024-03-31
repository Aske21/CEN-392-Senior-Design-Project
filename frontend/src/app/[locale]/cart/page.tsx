"use client";

import React from "react";
import { selectCartTotalItems } from "@/lib/features/cart/cartSelectors";
import {
  clearCart,
  removeItem,
  updateItemQuantity,
} from "@/lib/features/cart/cartSlice";
import { RootState } from "@/lib/store";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const CartPage = () => {
  const dispatch = useDispatch();
  const totalCartItems = useSelector(selectCartTotalItems);
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const handleRemoveItem = (itemId: string) => {
    dispatch(removeItem(itemId));
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    dispatch(updateItemQuantity({ id: itemId, quantity }));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col h-screen">
      <div className="flex-grow-0.8 overflow-y-auto">
        {totalCartItems === 0 ? (
          <>
            <p>Your cart is empty.</p>
            <Link href="products">
              <b>Browse products</b>
            </Link>
          </>
        ) : (
          <>
            {cartItems?.map((item: any) => (
              <div key={item.id} className="py-4">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-gray-600">Price: ${item.price}</p>
                <div className="flex items-center space-x-4">
                  <p className="text-gray-600">Quantity:</p>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleUpdateQuantity(item.id, parseInt(e.target.value))
                    }
                    className="border rounded-md px-2 py-1 w-16 text-center"
                  />
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
                <Separator className="my-4" />
              </div>
            ))}
          </>
        )}
      </div>
      {totalCartItems !== 0 ? (
        <div className="flex justify-start space-x-4 pb-4">
          <Button onClick={handleClearCart} variant="destructive">
            Clear Cart
          </Button>
          <Button onClick={() => console.log("Proceed to checkout")}>
            Proceed to Checkout
          </Button>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default CartPage;
