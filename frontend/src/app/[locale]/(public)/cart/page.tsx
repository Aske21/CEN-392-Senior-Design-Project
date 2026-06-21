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
import ProductImage from "@/components/product-image";
import useValidateDiscount from "@/hooks/discount/useValidateDiscount";
import { Input } from "@/components/ui/input";
import { FiTag, FiX } from "react-icons/fi";

const CartPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectAuthUser);
  const totalCartItems = useSelector(selectCartTotalItems);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [error, setError] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string;
    amount: number;
  } | null>(null);
  const [discountError, setDiscountError] = useState("");

  const { mutate: validateDiscount, isLoading: isValidatingDiscount } = useValidateDiscount();

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

    setError("");

    try {
      await mutate(
        { items: cartItems, discountCode: appliedDiscount?.code || null },
        {
          onSuccess: (checkoutSessionUrl) => {
            if (!checkoutSessionUrl) {
              setError("No checkout URL received from server");
              return;
            }
            
            if (typeof checkoutSessionUrl !== "string") {
              setError(`Invalid URL type: ${typeof checkoutSessionUrl}`);
              return;
            }
            
            if (checkoutSessionUrl.trim() === "") {
              setError("Empty checkout URL received");
              return;
            }
            
            try {
              const url = new URL(checkoutSessionUrl);
              
              if (url.protocol !== "http:" && url.protocol !== "https:") {
                setError(`Invalid URL protocol: ${url.protocol}`);
                return;
              }
              
              window.location.assign(checkoutSessionUrl);
            } catch (urlError: any) {
              setError(`Invalid checkout URL: ${checkoutSessionUrl}`);
            }
          },
          onError: (error: any) => {
            setError(error.message || "Failed to create checkout session");
          },
        }
      );
    } catch (error: any) {
      setError(error.message || "Failed to create checkout session");
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = appliedDiscount?.amount || 0;
    return Math.max(0, subtotal - discount);
  };

  const handleApplyDiscount = () => {
    if (!discountCode.trim()) {
      setDiscountError("Please enter a discount code");
      return;
    }

    if (!isAuthenticated) {
      setDiscountError("Please login to apply discount codes");
      return;
    }

    setDiscountError("");
    const subtotal = calculateSubtotal();

    validateDiscount(
      { code: discountCode.trim(), totalAmount: subtotal },
      {
        onSuccess: (data) => {
          if (data.valid && data.discountAmount) {
            setAppliedDiscount({
              code: data.discount!.code,
              amount: data.discountAmount,
            });
            setDiscountCode("");
            setDiscountError("");
          } else {
            setDiscountError(data.error || "Invalid discount code");
          }
        },
        onError: (error: any) => {
          setDiscountError(error.message || "Failed to validate discount code");
        },
      }
    );
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    setDiscountCode("");
    setDiscountError("");
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          {totalCartItems === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">Your cart is empty.</p>
              <Link href="/products">
                <Button>Browse products</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems?.map((item: any) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden">
                        <ProductImage
                          src={item.imageSrc || ""}
                          alt={item.title}
                          className="w-full h-full object-cover rounded-lg"
                          width={128}
                          height={128}
                        />
                      </div>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg md:text-xl font-semibold mb-2">{item.title}</h3>
                        {item.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          ${item.price.toFixed(2)} each
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                          <label className="text-sm font-medium">Quantity:</label>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              handleUpdateQuantity(item.id, parseInt(e.target.value) || 1)
                            }
                            className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 w-20 text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          />
                        </div>
                        <Button
                          onClick={() => handleRemoveItem(item.id)}
                          variant="destructive"
                          size="sm"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {totalCartItems !== 0 && (
          <div className="lg:w-80">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
                </div>

                {appliedDiscount && (
                  <>
                    <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                      <div className="flex items-center gap-2">
                        <FiTag className="w-4 h-4" />
                        <span>Discount ({appliedDiscount.code})</span>
                        <button
                          onClick={handleRemoveDiscount}
                          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                          aria-label="Remove discount"
                        >
                          <FiX className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="font-medium">-${appliedDiscount.amount.toFixed(2)}</span>
                    </div>
                    <Separator />
                  </>
                )}

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              {isAuthenticated && !appliedDiscount && (
                <div className="mb-6">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Enter discount code"
                      value={discountCode}
                      onChange={(e) => {
                        setDiscountCode(e.target.value.toUpperCase());
                        setDiscountError("");
                      }}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleApplyDiscount();
                        }
                      }}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleApplyDiscount}
                      disabled={isValidatingDiscount || !discountCode.trim()}
                      variant="outline"
                    >
                      Apply
                    </Button>
                  </div>
                  {discountError && (
                    <p className="text-sm text-red-500 mt-2">{discountError}</p>
                  )}
                </div>
              )}

              {!isAuthenticated && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Please <Link href="/login" className="underline font-semibold">login</Link> to proceed with checkout.
                  </p>
                </div>
              )}
              
              {error && (
                <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 dark:text-red-400 p-3 rounded-lg mb-4">
                  {error}
                </div>
              )}
              
              <div className="space-y-3">
                <Button 
                  onClick={handleProceedToCheckout} 
                  className="w-full"
                  disabled={isLoading || !isAuthenticated}
                >
                  {isLoading ? "Processing..." : "Proceed to checkout"}
                </Button>
                <Button 
                  onClick={handleClearCart} 
                  variant="outline"
                  className="w-full"
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
