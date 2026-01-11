"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaCheckCircle, FaShoppingBag, FaHome } from "react-icons/fa";
import { useAppDispatch } from "@/lib/hooks";
import { clearCart } from "@/lib/features/cart/cartSlice";
import NextLink from "next/link";
import { useLocale } from "next-intl";
import useGetOrderByPaymentId from "@/hooks/order/useGetOrderByPaymentId";
import ProductImage from "@/components/product-image";

const OrderSuccessPage = () => {
  const t = useTranslations("OrderSuccess");
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const locale = useLocale();
  const sessionId = searchParams.get("session_id");

  const { data: order, isLoading, error } = useGetOrderByPaymentId(sessionId);

  useEffect(() => {
    // Clear cart when order is successful
    dispatch(clearCart());
  }, [dispatch]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const calculateSubtotal = () => {
    if (!order?.orderDetails) return 0;
    return order.orderDetails.reduce(
      (sum, detail) => sum + detail.product.price * detail.quantity,
      0
    );
  };

  if (isLoading) {
    return (
      <div className="py-12 md:py-16 lg:py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-4">
              <FaCheckCircle className="h-16 w-16 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {t("title")}
          </h1>
          <p className="text-muted-foreground">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="py-12 md:py-16 lg:py-20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-4">
                <FaCheckCircle className="h-16 w-16 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {t("title")}
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              {t("subtitle")}
            </p>
          </div>
          <Card>
            <CardContent className="pt-6">
              <p className="text-destructive mb-4">{t("error")}</p>
              <p className="text-sm text-muted-foreground mb-4">
                {t("errorNote")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <NextLink href="/products" locale={locale}>
                    <FaShoppingBag className="mr-2 h-4 w-4" />
                    {t("actions.continueShopping")}
                  </NextLink>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                  <NextLink href="/" locale={locale}>
                    <FaHome className="mr-2 h-4 w-4" />
                    {t("actions.backToHome")}
                  </NextLink>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const subtotal = calculateSubtotal();
  const discount = order.discountAmount || 0;
  const total = order.totalAmount;

  return (
    <div className="py-12 md:py-16 lg:py-20">
      <div className="max-w-3xl mx-auto">
        {/* Success Icon and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-4">
              <FaCheckCircle className="h-16 w-16 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {t("title")}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        {/* Order Details Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FaShoppingBag className="h-5 w-5" />
              {t("orderDetails.title")}
            </CardTitle>
            <CardDescription>
              {t("orderDetails.orderNumber")}: #{order.id}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Order Items */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">{t("orderDetails.items")}</h3>
              {order.orderDetails && order.orderDetails.length > 0 ? (
                <div className="space-y-4">
                  {order.orderDetails.map((detail) => (
                    <div
                      key={detail.id}
                      className="flex gap-4 pb-4 border-b last:border-0"
                    >
                      {detail.product.images && detail.product.images.length > 0 && (
                        <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border">
                          <ProductImage
                            src={detail.product.images[0]}
                            alt={detail.product.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium">{detail.product.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {t("orderDetails.quantity")}: {detail.quantity}
                        </p>
                        <p className="text-sm font-medium mt-1">
                          {formatPrice(detail.product.price)} × {detail.quantity} ={" "}
                          {formatPrice(detail.product.price * detail.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">{t("orderDetails.noItems")}</p>
              )}
            </div>

            {/* Order Summary */}
            <div className="pt-4 border-t space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("orderDetails.subtotal")}</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span>{t("orderDetails.discount")}</span>
                  <span className="font-medium">-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>{t("orderDetails.total")}</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-2">{t("orderDetails.shippingAddress")}</h3>
              <p className="text-sm text-muted-foreground">{order.shippingAddress}</p>
            </div>

            {/* Receipt Note */}
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                {t("orderDetails.receiptNote")}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <NextLink href="/products" locale={locale}>
              <FaShoppingBag className="mr-2 h-4 w-4" />
              {t("actions.continueShopping")}
            </NextLink>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
            <NextLink href="/" locale={locale}>
              <FaHome className="mr-2 h-4 w-4" />
              {t("actions.backToHome")}
            </NextLink>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
