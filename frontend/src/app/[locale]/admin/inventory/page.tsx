"use client";

import React, { useMemo, useState } from "react";
import useGetAdminProducts from "@/hooks/admin/useGetAdminProducts";
import useUpdateAdminProduct from "@/hooks/admin/useUpdateAdminProduct";
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
import { Badge } from "@/components/ui/badge";
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
import { useToast } from "@/components/ui/use-toast";
import { useTranslations } from "next-intl";
import {
  LOW_STOCK_THRESHOLD,
  getStockQuantity,
  getStockStatus,
  stockBadgeVariant,
} from "@/lib/inventory";

export default function AdminInventoryPage() {
  const t = useTranslations("Admin.inventory");
  const tc = useTranslations("Admin.common");
  const tp = useTranslations("Admin.products");
  const { data, error, isLoading } = useGetAdminProducts({
    page: 1,
    limit: 100,
  });
  const { toast } = useToast();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [stock, setStock] = useState("");

  const products = useMemo(() => data?.products ?? [], [data]);

  const summary = useMemo(() => {
    let inStock = 0;
    let lowStock = 0;
    let outOfStock = 0;
    for (const product of products) {
      const status = getStockStatus(getStockQuantity(product));
      if (status === "in") inStock += 1;
      else if (status === "low") lowStock += 1;
      else outOfStock += 1;
    }
    return { inStock, lowStock, outOfStock };
  }, [products]);

  const updateStockMutation = useUpdateAdminProduct({
    onSuccess: () => {
      setSheetOpen(false);
      setSelectedProduct(null);
      toast({
        title: t("toastUpdated"),
        description: t("toastUpdatedDescription"),
      });
    },
    onError: (mutationError) => {
      toast({
        title: tc("updateFailed"),
        description: mutationError.message,
      });
    },
  });

  const openAdjustSheet = (product: any) => {
    setSelectedProduct(product);
    setStock(getStockQuantity(product).toString());
    setSheetOpen(true);
  };

  const handleCloseSheet = (open: boolean) => {
    if (!open) {
      setSheetOpen(false);
      setSelectedProduct(null);
      setStock("");
    }
  };

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedProduct) return;

    const parsedStock = parseInt(stock, 10);
    if (stock === "" || Number.isNaN(parsedStock) || parsedStock < 0) {
      toast({
        title: tc("validationFailed"),
        description: tp("validationStock"),
      });
      return;
    }

    updateStockMutation.mutate({
      id: selectedProduct.id,
      data: { stockQuantity: parsedStock },
    });
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        {tc("loadingProducts")}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        {tc("errorLoadingProducts")} {error.message}
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
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("inStockTitle")}</CardTitle>
            <CardDescription>{t("inStockDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-emerald-600 dark:text-emerald-400">
              {summary.inStock}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("lowStockTitle")}</CardTitle>
            <CardDescription>
              {t("lowStockDescription", { threshold: LOW_STOCK_THRESHOLD })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-amber-600 dark:text-amber-400">
              {summary.lowStock}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("outOfStockTitle")}</CardTitle>
            <CardDescription>{t("outOfStockDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-rose-600 dark:text-rose-400">
              {summary.outOfStock}
            </div>
          </CardContent>
        </Card>
      </div>

      <Sheet open={sheetOpen} onOpenChange={handleCloseSheet}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>{t("adjustTitle")}</SheetTitle>
            <SheetDescription>
              {t("adjustDescription", { name: selectedProduct?.name ?? "" })}
            </SheetDescription>
          </SheetHeader>
          <form className="space-y-4 py-4" onSubmit={handleSave}>
            <div className="grid gap-2">
              <Label htmlFor="inventory-stock">{t("stockLabel")}</Label>
              <Input
                id="inventory-stock"
                type="number"
                min="0"
                step="1"
                value={stock}
                onChange={(event) => setStock(event.target.value)}
                required
              />
            </div>
            <SheetFooter>
              <Button type="submit" disabled={updateStockMutation.isLoading}>
                {t("saveStock")}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

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
                  <TableHead>{tc("name")}</TableHead>
                  <TableHead>{t("tableStatus")}</TableHead>
                  <TableHead>{t("tableQuantity")}</TableHead>
                  <TableHead>{tc("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product: any) => {
                  const quantity = getStockQuantity(product);
                  const status = getStockStatus(quantity);
                  return (
                    <TableRow key={product.id}>
                      <TableCell className="max-w-[160px] truncate sm:max-w-none">
                        {product.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant={stockBadgeVariant(status)}>
                          {status === "out"
                            ? t("statusOut")
                            : status === "low"
                              ? t("statusLow")
                              : t("statusIn")}
                        </Badge>
                      </TableCell>
                      <TableCell>{quantity}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openAdjustSheet(product)}
                        >
                          {t("adjustButton")}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableScrollContainer>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          {t("footerCount", { count: products.length })}
        </CardFooter>
      </Card>
    </div>
  );
}
