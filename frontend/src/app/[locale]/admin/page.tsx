"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useGetAdminOrders from "@/hooks/admin/useGetAdminOrders";
import useGetAdminUsers from "@/hooks/admin/useGetAdminUsers";
import useGetAdminProducts from "@/hooks/admin/useGetAdminProducts";
import useGetCategories from "@/hooks/category/useGetCategories";

const statusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return "warning";
    case "paid":
      return "success";
    case "processing":
      return "secondary";
    case "shipped":
      return "default";
    case "delivered":
      return "success";
    default:
      return "default";
  }
};

export default function AdminDashboardPage() {
  const { data: usersData, isLoading: isUsersLoading } = useGetAdminUsers(1, 1);
  const { data: ordersData, isLoading: isOrdersLoading } = useGetAdminOrders(
    1,
    5,
  );
  const { data: productsData, isLoading: isProductsLoading } =
    useGetAdminProducts({ page: 1, limit: 1 });
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useGetCategories();

  const loading =
    isUsersLoading ||
    isOrdersLoading ||
    isProductsLoading ||
    isCategoriesLoading;
  const usersCount = usersData?.total || 0;
  const ordersCount = ordersData?.total || 0;
  const productsCount = productsData?.total || 0;
  const categoriesCount = categoriesData?.length || 0;
  const recentOrders = ordersData?.orders ?? [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Quick overview of orders, users, products, discounts, and
            categories.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Users</CardTitle>
            <CardDescription>Registered customers and admins</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {loading ? "—" : usersCount}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Orders</CardTitle>
            <CardDescription>Recent sales volume</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {loading ? "—" : ordersCount}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Products</CardTitle>
            <CardDescription>Catalog size</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {loading ? "—" : productsCount}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Categories</CardTitle>
            <CardDescription>Active product categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {loading ? "—" : categoriesCount}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid h-full ">
        <Card>
          <CardHeader>
            <CardTitle>Latest Orders</CardTitle>
            <CardDescription>Most recent orders in the system.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-6 text-center text-sm text-slate-500">
                Loading orders...
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="py-6 text-center text-sm text-slate-500">
                No orders found.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.slice(0, 5).map((order: any) => (
                    <TableRow key={order.id}>
                      <TableCell>#{order.id}</TableCell>
                      <TableCell>{order.user?.email ?? "Unknown"}</TableCell>
                      <TableCell>
                        <Badge variant={statusBadge(order.status ?? "pending")}>
                          {order.status ?? "pending"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        $
                        {order.totalAmount?.toFixed?.(2) ??
                          order.totalAmount ??
                          "0.00"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
