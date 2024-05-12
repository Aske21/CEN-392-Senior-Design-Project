"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useCreateCheckoutSession from "@/hooks/payment/useCreateCheckoutSession";
import { RootState } from "@/lib/store";
import {
  clearCart,
  removeItem,
  updateItemQuantity,
} from "@/lib/features/cart/cartSlice";
import { selectCartTotalItems } from "@/lib/features/cart/cartSelectors";
import { useSelector, useDispatch } from "react-redux";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

const CartPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
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

  const { mutate } = useCreateCheckoutSession();
  const handleProceedToCheckout = async () => {
    try {
      await mutate(cartItems, {
        onSuccess: (checkoutSessionUrl) => {
          if (checkoutSessionUrl) {
            router.push(checkoutSessionUrl);
          }
        },
        onError: (error: any) => {
          console.error("Error creating checkout session:", error.message);
        },
      });
    } catch (error: any) {
      console.error("Error creating checkout session:", error.message);
    }
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
      {totalCartItems !== 0 && (
        <div className="flex justify-start space-x-4 pb-4">
          <Button onClick={handleClearCart} variant="destructive">
            Clear Cart
          </Button>
          <Button onClick={handleProceedToCheckout}>Proceed to checkout</Button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
