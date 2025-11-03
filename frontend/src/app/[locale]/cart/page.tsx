"use client";

import React, { useState } from "react";
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
import { useAppSelector } from "@/lib/hooks";
import { selectIsAuthenticated, selectAuthUser } from "@/lib/features/auth/authSelectors";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CartPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectAuthUser);
  const totalCartItems = useSelector(selectCartTotalItems);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [shippingAddress, setShippingAddress] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [error, setError] = useState("");

  const handleRemoveItem = (itemId: string) => {
    dispatch(removeItem(itemId));
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    dispatch(updateItemQuantity({ id: itemId, quantity }));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const { mutate, isLoading } = useCreateCheckoutSession();
  
  const handleProceedToCheckout = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!showCheckout) {
      setShowCheckout(true);
      return;
    }

    if (!shippingAddress.trim()) {
      setError("Please enter a shipping address");
      return;
    }

    setError("");

    try {
      await mutate(
        { items: cartItems, shippingAddress },
        {
          onSuccess: (checkoutSessionUrl) => {
            if (checkoutSessionUrl) {
              window.location.href = checkoutSessionUrl;
            }
          },
          onError: (error: any) => {
            setError(error.message || "Failed to create checkout session");
            console.error("Error creating checkout session:", error);
          },
        }
      );
    } catch (error: any) {
      setError(error.message || "Failed to create checkout session");
      console.error("Error creating checkout session:", error);
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
                <p>Price: ${item.price * item.quantity}</p>
                <div className="flex items-center space-x-4">
                  <p>Quantity:</p>
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
        <div className="space-y-4 pb-4">
          {!isAuthenticated && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
              <p className="text-sm text-yellow-800">
                Please <Link href="/login" className="underline font-semibold">login</Link> to proceed with checkout.
              </p>
            </div>
          )}
          
          {showCheckout && isAuthenticated && (
            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="font-semibold">Shipping Information</h3>
              {error && (
                <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
                  {error}
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="shipping-address">Shipping Address</Label>
                <Input
                  id="shipping-address"
                  type="text"
                  placeholder="123 Main St, City, State, ZIP"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  required
                />
              </div>
            </div>
          )}
          
          <div className="flex justify-start space-x-4">
            <Button onClick={handleClearCart} variant="destructive">
              Clear Cart
            </Button>
            <Button 
              onClick={handleProceedToCheckout} 
              variant="outline"
              disabled={isLoading}
            >
              {isLoading 
                ? "Processing..." 
                : showCheckout && isAuthenticated 
                  ? "Complete Checkout" 
                  : "Proceed to checkout"
              }
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
