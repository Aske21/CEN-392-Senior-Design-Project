"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { TableScrollContainer } from "@/components/admin/TableScrollContainer";
import { useTranslations } from "next-intl";

const orderStatuses = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
] as const;

type OrderStatus = (typeof orderStatuses)[number];

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
  const t = useTranslations("Admin.dashboard");
  const tc = useTranslations("Admin.common");
  const tStatus = useTranslations("OrderStatus");

  const translateStatus = (status: string) =>
    orderStatuses.includes(status as OrderStatus)
      ? tStatus(status as OrderStatus)
      : status;

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
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {t("title")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("usersTitle")}</CardTitle>
            <CardDescription>{t("usersDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {loading ? "—" : usersCount}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("ordersTitle")}</CardTitle>
            <CardDescription>{t("ordersDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {loading ? "—" : ordersCount}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("productsTitle")}</CardTitle>
            <CardDescription>{t("productsDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {loading ? "—" : productsCount}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("categoriesTitle")}</CardTitle>
            <CardDescription>{t("categoriesDescription")}</CardDescription>
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
            <CardTitle>{t("latestOrders")}</CardTitle>
            <CardDescription>{t("latestOrdersDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                {tc("loadingOrders")}
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                {t("noOrders")}
              </div>
            ) : (
              <TableScrollContainer>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("tableId")}</TableHead>
                      <TableHead>{t("tableCustomer")}</TableHead>
                      <TableHead>{t("tableStatus")}</TableHead>
                      <TableHead>{t("tableTotal")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.slice(0, 5).map((order: any) => (
                      <TableRow key={order.id}>
                        <TableCell>#{order.id}</TableCell>
                        <TableCell className="max-w-[140px] truncate sm:max-w-none">
                          {order.user?.email ?? tc("unknown")}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={statusBadge(order.status ?? "pending")}
                          >
                            {translateStatus(order.status ?? "pending")}
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
              </TableScrollContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
