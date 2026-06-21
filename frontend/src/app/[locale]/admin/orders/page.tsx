"use client";

import useGetAdminOrders from "@/hooks/admin/useGetAdminOrders";
import useUpdateAdminOrderStatus from "@/hooks/admin/useUpdateAdminOrderStatus";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const orderStatuses = ["pending", "paid", "processing", "shipped", "delivered"];

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
  const { data, error, isLoading } = useGetAdminOrders(1, 50);
  const { toast } = useToast();
  const [openMenuOrderId, setOpenMenuOrderId] = useState<number | null>(null);

  const updateStatusMutation = useUpdateAdminOrderStatus({
    onSuccess: (_, variables) => {
      toast({
        title: "Order updated",
        description: `Order #${variables.id} status changed to ${variables.status}.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: error.message,
      });
    },
  });

  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        Loading orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        Error loading orders: {error.message}
      </div>
    );
  }

  const orders = data?.orders || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Orders</h1>
          <p className="text-sm text-slate-600">
            Manage order status and review recent purchases.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="font-medium">Total</span>
          <span className="rounded-full bg-slate-100 px-3 py-1">
            {data?.total || 0}
          </span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order list</CardTitle>
          <CardDescription>
            Update statuses and keep track of recent orders.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order: any) => (
                  <TableRow key={order.id}>
                    <TableCell>#{order.id}</TableCell>
                    <TableCell>{order.user?.email ?? "Unknown"}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(order.status ?? "pending")}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      $
                      {order.totalAmount?.toFixed?.(2) ??
                        order.totalAmount ??
                        "0.00"}
                    </TableCell>
                    <TableCell>
                      {new Date(
                        order.orderDate || order.created_at,
                      ).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
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
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            {orderStatuses.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                              className="text-slate-600 hover:bg-slate-100"
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
                                Mark {status}
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
          </div>
        </CardContent>
        <CardFooter className="text-sm text-slate-500">
          {orders.length} orders shown.
        </CardFooter>
      </Card>
    </div>
  );
}
