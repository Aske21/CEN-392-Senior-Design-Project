"use client";

import useGetAdminOrders from "@/hooks/admin/useGetAdminOrders";
import useUpdateAdminOrderStatus from "@/hooks/admin/useUpdateAdminOrderStatus";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableScrollContainer } from "@/components/admin/TableScrollContainer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { FiMoreVertical } from "react-icons/fi";
import { useState } from "react";
import { useTranslations } from "next-intl";

const orderStatuses = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
] as const;

type OrderStatus = (typeof orderStatuses)[number];

const statusVariant = (status: string) => {
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

export default function AdminOrdersPage() {
  const t = useTranslations("Admin.orders");
  const tc = useTranslations("Admin.common");
  const tStatus = useTranslations("OrderStatus");
  const { data, error, isLoading } = useGetAdminOrders(1, 50);
  const { toast } = useToast();
  const [openMenuOrderId, setOpenMenuOrderId] = useState<number | null>(null);

  const translateStatus = (status: string) =>
    orderStatuses.includes(status as OrderStatus)
      ? tStatus(status as OrderStatus)
      : status;

  const updateStatusMutation = useUpdateAdminOrderStatus({
    onSuccess: (_, variables) => {
      toast({
        title: t("toastUpdated"),
        description: t("toastUpdatedDescription", {
          id: variables.id,
          status: translateStatus(variables.status),
        }),
      });
    },
    onError: (error) => {
      toast({
        title: tc("updateFailed"),
        description: error.message,
      });
    },
  });

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        {tc("loadingOrders")}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        {tc("errorLoadingOrders")} {error.message}
      </div>
    );
  }

  const orders = data?.orders || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium">{tc("total")}</span>
          <span className="rounded-full bg-muted px-3 py-1">
            {data?.total || 0}
          </span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("listTitle")}</CardTitle>
          <CardDescription>{t("listDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <TableScrollContainer>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("tableOrder")}</TableHead>
                  <TableHead>{t("tableUser")}</TableHead>
                  <TableHead>{t("tableStatus")}</TableHead>
                  <TableHead>{tc("total")}</TableHead>
                  <TableHead className="hidden md:table-cell">
                    {tc("created")}
                  </TableHead>
                  <TableHead>{tc("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order: any) => (
                  <TableRow key={order.id}>
                    <TableCell>#{order.id}</TableCell>
                    <TableCell className="max-w-[140px] truncate sm:max-w-xs">
                      {order.user?.email ?? tc("unknown")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={statusVariant(order.status ?? "pending")}
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
                    <TableCell className="hidden md:table-cell">
                      {new Date(
                        order.orderDate || order.created_at,
                      ).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="hidden md:block">
                          <Select
                            defaultValue={order.status}
                            onValueChange={(value) =>
                              updateStatusMutation.mutate({
                                id: order.id,
                                status: value,
                              })
                            }
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue placeholder={t("statusPlaceholder")} />
                            </SelectTrigger>
                            <SelectContent>
                              {orderStatuses.map((status) => (
                                <SelectItem key={status} value={status}>
                                  {translateStatus(status)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <DropdownMenu
                          open={openMenuOrderId === order.id}
                          onOpenChange={(value) =>
                            setOpenMenuOrderId(value ? order.id : null)
                          }
                        >
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            >
                              <FiMoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {orderStatuses.map((status) => (
                              <DropdownMenuItem
                                key={status}
                                onSelect={() => {
                                  setOpenMenuOrderId(null);
                                  updateStatusMutation.mutate({
                                    id: order.id,
                                    status,
                                  });
                                }}
                              >
                                {tc("markStatus", {
                                  status: translateStatus(status),
                                })}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableScrollContainer>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          {t("footerCount", { count: orders.length })}
        </CardFooter>
      </Card>
    </div>
  );
}
