"use client";

import React, { useState } from "react";
import useGetDiscounts from "@/hooks/discount/useGetDiscounts";
import useCreateDiscount from "@/hooks/discount/useCreateDiscount";
import useDeleteDiscount from "@/hooks/discount/useDeleteDiscount";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { FiMoreVertical } from "react-icons/fi";

export default function AdminDiscountsPage() {
  const { data: discounts, isLoading, error } = useGetDiscounts();
  const { toast } = useToast();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [discountToDelete, setDiscountToDelete] = useState<any>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [maxUsesPerUser, setMaxUsesPerUser] = useState("1");
  const [maxTotalUses, setMaxTotalUses] = useState("");
  const [forNewUsersOnly, setForNewUsersOnly] = useState(false);

  const createDiscountMutation = useCreateDiscount({
    onSuccess: () => {
      setSheetOpen(false);
      setName("");
      setCode("");
      setDiscountPercentage("");
      setStartDate("");
      setEndDate("");
      setMaxUsesPerUser("1");
      setMaxTotalUses("");
      setForNewUsersOnly(false);
      toast({
        title: "Discount created",
        description: "The discount code is now available.",
      });
    },
    onError: (error) => {
      toast({
        title: "Create failed",
        description: error.message,
      });
    },
  });

  const deleteDiscountMutation = useDeleteDiscount({
    onSuccess: (_, variables) => {
      setDeleteDialogOpen(false);
      setDiscountToDelete(null);
      toast({
        title: "Discount deleted",
        description: `Discount #${variables} has been removed.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Delete failed",
        description: error.message,
      });
    },
  });

  const handleCreateDiscount = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !code.trim() || !discountPercentage.trim()) {
      toast({
        title: "Missing fields",
        description: "Please fill in name, code, and discount percentage.",
      });
      return;
    }

    const percentage = parseFloat(discountPercentage);
    if (Number.isNaN(percentage) || percentage <= 0 || percentage > 100) {
      toast({
        title: "Invalid percentage",
        description: "Enter a valid discount percentage between 1 and 100.",
      });
      return;
    }

    createDiscountMutation.mutate({
      name: name.trim(),
      code: code.trim().toUpperCase(),
      discount_percentage: percentage,
      start_date: startDate || undefined,
      end_date: endDate || undefined,
      for_new_users_only: forNewUsersOnly,
      max_uses_per_user: Number(maxUsesPerUser) || 1,
      max_total_uses: maxTotalUses ? Number(maxTotalUses) : null,
    });
  };

  const handleOpenDelete = (discount: any) => {
    setDiscountToDelete(discount);
    setDeleteDialogOpen(true);
    setOpenMenuId(null);
  };

  const handleDelete = () => {
    if (discountToDelete) {
      deleteDiscountMutation.mutate(discountToDelete.id);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        Loading discount codes...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        Error loading discount codes: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Discount codes</h1>
          <p className="text-sm text-slate-600">
            Create and manage site-wide discount codes.
          </p>
        </div>
        <Button onClick={() => setSheetOpen(true)}>Add discount</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active discount codes</CardTitle>
          <CardDescription>
            Manage code availability and expiration for campaigns.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead>Uses</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(discounts || []).map((discount: any) => (
                  <TableRow key={discount.id}>
                    <TableCell>{discount.code}</TableCell>
                    <TableCell>{discount.name}</TableCell>
                    <TableCell>{discount.discount_percentage}%</TableCell>
                    <TableCell>{discount.active ? "Yes" : "No"}</TableCell>
                    <TableCell>{discount.current_total_uses ?? 0}</TableCell>
                    <TableCell>
                      <DropdownMenu
                        open={openMenuId === discount.id}
                        onOpenChange={(value) =>
                          setOpenMenuId(value ? discount.id : null)
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
                          <DropdownMenuItem
                            onSelect={() => handleOpenDelete(discount)}
                          >
                            Delete discount
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="text-sm text-slate-500">
          {discounts?.length ?? 0} discount codes
        </CardFooter>
      </Card>

      <Sheet open={sheetOpen} onOpenChange={(open) => setSheetOpen(open)}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>New discount code</SheetTitle>
            <SheetDescription>
              Set up your code and optional limits.
            </SheetDescription>
          </SheetHeader>
          <form className="space-y-4 py-4" onSubmit={handleCreateDiscount}>
            <div className="grid gap-2">
              <Label htmlFor="discount-name">Name</Label>
              <Input
                id="discount-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="discount-code">Code</Label>
              <Input
                id="discount-code"
                value={code}
                onChange={(event) => setCode(event.target.value.toUpperCase())}
                maxLength={20}
                pattern="[A-Z0-9_-]+"
                title="Uppercase letters, numbers, dashes, and underscores only"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="discount-percentage">Discount percentage</Label>
              <Input
                id="discount-percentage"
                type="number"
                min={1}
                max={100}
                step={1}
                value={discountPercentage}
                onChange={(event) => setDiscountPercentage(event.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="discount-start">Start date</Label>
              <Input
                id="discount-start"
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="discount-end">End date</Label>
              <Input
                id="discount-end"
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="discount-max-user">Max uses per user</Label>
              <Input
                id="discount-max-user"
                type="number"
                min={1}
                value={maxUsesPerUser}
                onChange={(event) => setMaxUsesPerUser(event.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="discount-max-total">Max total uses</Label>
              <Input
                id="discount-max-total"
                type="number"
                min={1}
                value={maxTotalUses}
                onChange={(event) => setMaxTotalUses(event.target.value)}
                placeholder="Leave blank for unlimited"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                id="discount-new-users"
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                checked={forNewUsersOnly}
                onChange={(event) => setForNewUsersOnly(event.target.checked)}
              />
              <Label htmlFor="discount-new-users">New users only</Label>
            </div>
            <SheetFooter>
              <Button type="submit" disabled={createDiscountMutation.isLoading}>
                Save discount
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      <Dialog
        open={deleteDialogOpen}
        onOpenChange={(open) => setDeleteDialogOpen(open)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete discount</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong>{discountToDelete?.code}</strong>? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteDiscountMutation.isLoading}
            >
              Delete discount
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
