"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppSelector } from "@/lib/hooks";
import { selectAuthUser } from "@/lib/features/auth/authSelectors";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { selectIsAuthenticated } from "@/lib/features/auth/authSelectors";
import useGetUserOrders from "@/hooks/order/useGetUserOrders";
import ProductImage from "@/components/product-image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FaUser,
  FaShoppingBag,
  FaCalendar,
  FaMapMarkerAlt,
  FaDollarSign,
} from "react-icons/fa";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const ProfilePage = () => {
  const t = useTranslations("Profile");
  const user = useAppSelector(selectAuthUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  const { data: ordersData, isLoading: ordersLoading } = useGetUserOrders(
    currentPage,
    ordersPerPage
  );

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="py-12 md:py-16 lg:py-20">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">{t("title")}</h1>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">{t("tabs.profile")}</TabsTrigger>
            <TabsTrigger value="orders">{t("tabs.orders")}</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FaUser className="h-5 w-5" />
                  {t("profileInfo.title")}
                </CardTitle>
                <CardDescription>
                  {t("profileInfo.description")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    {t("profileInfo.username")}
                  </label>
                  <p className="text-lg font-semibold">
                    {user.username || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    {t("profileInfo.email")}
                  </label>
                  <p className="text-lg">{user.email || "N/A"}</p>
                </div>
                {user.first_name && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      {t("profileInfo.firstName")}
                    </label>
                    <p className="text-lg">{user.first_name}</p>
                  </div>
                )}
                {user.last_name && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      {t("profileInfo.lastName")}
                    </label>
                    <p className="text-lg">{user.last_name}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FaShoppingBag className="h-5 w-5" />
                  {t("orders.title")}
                </CardTitle>
                <CardDescription>{t("orders.description")}</CardDescription>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-32 w-full" />
                    ))}
                  </div>
                ) : !ordersData ||
                  !ordersData.orders ||
                  ordersData.orders.length === 0 ? (
                  <div className="text-center py-12">
                    <FaShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {t("orders.noOrders")}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="mb-4 text-sm text-muted-foreground">
                      {t("orders.showing", {
                        count: ordersData.orders.length,
                        total: ordersData.total,
                      })}
                    </div>
                    <div className="space-y-6">
                      {ordersData.orders.map((order) => (
                        <Card
                          key={order.id}
                          className="border-l-4 border-l-primary"
                        >
                          <CardHeader>
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                              <div>
                                <CardTitle className="text-lg">
                                  {t("orders.orderNumber")} #{order.id}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-2 mt-1">
                                  <FaCalendar className="h-3 w-3" />
                                  {formatDate(order.orderDate)}
                                </CardDescription>
                              </div>
                              <div className="flex flex-col items-start md:items-end gap-1">
                                <span className="text-lg font-bold text-primary">
                                  {formatPrice(order.totalAmount)}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {t("orders.status")}: {order.status}
                                </span>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {/* Order Items */}
                            <div className="space-y-3">
                              {order.orderDetails &&
                              order.orderDetails.length > 0 ? (
                                order.orderDetails.map((detail) => (
                                  <div
                                    key={detail.id}
                                    className="flex gap-4 p-3 bg-muted/50 rounded-lg"
                                  >
                                    {detail.product.images &&
                                      detail.product.images.length > 0 && (
                                        <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border">
                                          <ProductImage
                                            src={detail.product.images[0]}
                                            alt={detail.product.name}
                                            width={64}
                                            height={64}
                                            className="w-full h-full object-cover"
                                          />
                                        </div>
                                      )}
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-medium truncate">
                                        {detail.product.name}
                                      </h4>
                                      <p className="text-sm text-muted-foreground">
                                        {t("orders.quantity")}:{" "}
                                        {detail.quantity} ×{" "}
                                        {formatPrice(detail.product.price)} ={" "}
                                        {formatPrice(
                                          detail.product.price * detail.quantity
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm text-muted-foreground">
                                  {t("orders.noItems")}
                                </p>
                              )}
                            </div>

                            {/* Order Summary */}
                            <div className="pt-4 border-t space-y-2">
                              {order.discountAmount &&
                                order.discountAmount > 0 && (
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                      {t("orders.subtotal")}
                                    </span>
                                    <span>
                                      {formatPrice(
                                        order.totalAmount + order.discountAmount
                                      )}
                                    </span>
                                  </div>
                                )}
                              {order.discountAmount &&
                                order.discountAmount > 0 && (
                                  <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                                    <span>
                                      {t("orders.discount")}
                                      {order.discountCode &&
                                        ` (${order.discountCode})`}
                                    </span>
                                    <span>
                                      -{formatPrice(order.discountAmount)}
                                    </span>
                                  </div>
                                )}
                              <div className="flex justify-between font-semibold pt-2 border-t">
                                <span>{t("orders.total")}</span>
                                <span>{formatPrice(order.totalAmount)}</span>
                              </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="pt-4 border-t">
                              <div className="flex items-start gap-2 text-sm">
                                <FaMapMarkerAlt className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <div>
                                  <span className="font-medium">
                                    {t("orders.shippingAddress")}:
                                  </span>
                                  <p className="text-muted-foreground">
                                    {order.shippingAddress}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Pagination Controls */}
                    {ordersData.totalPages > 1 && (
                      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
                        <div className="text-sm text-muted-foreground">
                          {t("orders.pageOfTotal", {
                            page: ordersData.page,
                            total: ordersData.totalPages,
                          })}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setCurrentPage((prev) => Math.max(1, prev - 1))
                            }
                            disabled={currentPage === 1 || ordersLoading}
                          >
                            {t("orders.previous")}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setCurrentPage((prev) =>
                                Math.min(ordersData.totalPages, prev + 1)
                              )
                            }
                            disabled={
                              currentPage === ordersData.totalPages ||
                              ordersLoading
                            }
                          >
                            {t("orders.next")}
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;
