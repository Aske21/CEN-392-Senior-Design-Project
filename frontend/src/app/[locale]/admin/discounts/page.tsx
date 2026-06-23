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
import { useTranslations } from "next-intl";

export default function AdminDiscountsPage() {
  const t = useTranslations("Admin.discounts");
  const tc = useTranslations("Admin.common");
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
        title: t("toastCreated"),
        description: t("toastCreatedDescription"),
      });
    },
    onError: (error) => {
      toast({
        title: tc("createFailed"),
        description: error.message,
      });
    },
  });

  const deleteDiscountMutation = useDeleteDiscount({
    onSuccess: (_, variables) => {
      setDeleteDialogOpen(false);
      setDiscountToDelete(null);
      toast({
        title: t("toastDeleted"),
        description: t("toastDeletedDescription", { id: variables }),
      });
    },
    onError: (error) => {
      toast({
        title: tc("deleteFailed"),
        description: error.message,
      });
    },
  });

  const handleCreateDiscount = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !code.trim() || !discountPercentage.trim()) {
      toast({
        title: t("toastMissingFields"),
        description: t("toastMissingFieldsDescription"),
      });
      return;
    }

    const percentage = parseFloat(discountPercentage);
    if (Number.isNaN(percentage) || percentage <= 0 || percentage > 100) {
      toast({
        title: t("toastInvalidPercentage"),
        description: t("toastInvalidPercentageDescription"),
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
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        {tc("loadingDiscounts")}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        {tc("errorLoadingDiscounts")} {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Button onClick={() => setSheetOpen(true)}>{t("addButton")}</Button>
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
                  <TableHead>{t("tableCode")}</TableHead>
                  <TableHead className="hidden md:table-cell">
                    {tc("name")}
                  </TableHead>
                  <TableHead>{t("tableDiscount")}</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    {t("tableActive")}
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    {t("tableUses")}
                  </TableHead>
                  <TableHead>{tc("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(discounts || []).map((discount: any) => (
                  <TableRow key={discount.id}>
                    <TableCell>{discount.code}</TableCell>
                    <TableCell className="hidden max-w-xs truncate md:table-cell">
                      {discount.name}
                    </TableCell>
                    <TableCell>{discount.discount_percentage}%</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {discount.active ? tc("yes") : tc("no")}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {discount.current_total_uses ?? 0}
                    </TableCell>
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
                            className="text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                          >
                            <FiMoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onSelect={() => handleOpenDelete(discount)}
                          >
                            {t("deleteMenu")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableScrollContainer>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          {t("footerCount", { count: discounts?.length ?? 0 })}
        </CardFooter>
      </Card>

      <Sheet open={sheetOpen} onOpenChange={(open) => setSheetOpen(open)}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>{t("newTitle")}</SheetTitle>
            <SheetDescription>{t("newDescription")}</SheetDescription>
          </SheetHeader>
          <form className="space-y-4 py-4" onSubmit={handleCreateDiscount}>
            <div className="grid gap-2">
              <Label htmlFor="discount-name">{tc("name")}</Label>
              <Input
                id="discount-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="discount-code">{t("code")}</Label>
              <Input
                id="discount-code"
                value={code}
                onChange={(event) => setCode(event.target.value.toUpperCase())}
                maxLength={20}
                pattern="[A-Z0-9_-]+"
                title={t("codeTitle")}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="discount-percentage">
                {t("discountPercentage")}
              </Label>
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
              <Label htmlFor="discount-start">{t("startDate")}</Label>
              <Input
                id="discount-start"
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="discount-end">{t("endDate")}</Label>
              <Input
                id="discount-end"
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="discount-max-user">{t("maxUsesPerUser")}</Label>
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
              <Label htmlFor="discount-max-total">{t("maxTotalUses")}</Label>
              <Input
                id="discount-max-total"
                type="number"
                min={1}
                value={maxTotalUses}
                onChange={(event) => setMaxTotalUses(event.target.value)}
                placeholder={t("unlimitedPlaceholder")}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                id="discount-new-users"
                type="checkbox"
                className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                checked={forNewUsersOnly}
                onChange={(event) => setForNewUsersOnly(event.target.checked)}
              />
              <Label htmlFor="discount-new-users">{t("newUsersOnly")}</Label>
            </div>
            <SheetFooter>
              <Button type="submit" disabled={createDiscountMutation.isLoading}>
                {t("saveButton")}
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
            <DialogTitle>{t("deleteTitle")}</DialogTitle>
            <DialogDescription>
              {t("deleteDescription", { code: discountToDelete?.code ?? "" })}{" "}
              {tc("deleteConfirmGeneric")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              {tc("cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteDiscountMutation.isLoading}
            >
              {t("deleteButton")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
