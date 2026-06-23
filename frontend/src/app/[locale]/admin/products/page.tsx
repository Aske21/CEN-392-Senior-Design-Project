"use client";

import React, { useState } from "react";
import useGetAdminProducts from "@/hooks/admin/useGetAdminProducts";
import useGetCategories from "@/hooks/category/useGetCategories";
import useCreateAdminProduct from "@/hooks/admin/useCreateAdminProduct";
import useUpdateAdminProduct from "@/hooks/admin/useUpdateAdminProduct";
import useDeleteAdminProduct from "@/hooks/admin/useDeleteAdminProduct";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Textarea } from "@/components/ui/textarea";
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

export default function AdminProductsPage() {
  const t = useTranslations("Admin.products");
  const tc = useTranslations("Admin.common");
  const { data, error, isLoading } = useGetAdminProducts({
    page: 1,
    limit: 50,
  });
  const { data: categories, isLoading: categoriesLoading } = useGetCategories();
  const { toast } = useToast();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<any>(null);
  const [openMenuProductId, setOpenMenuProductId] = useState<number | null>(
    null,
  );
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");

  const createProductMutation = useCreateAdminProduct({
    onSuccess: () => {
      setSheetOpen(false);
      setSelectedProduct(null);
      setName("");
      setPrice("");
      setCategoryId("");
      setImageUrl("");
      setDescription("");
      toast({
        title: t("toastAdded"),
        description: t("toastAddedDescription"),
      });
    },
    onError: (error) => {
      toast({
        title: tc("createFailed"),
        description: error.message,
      });
    },
  });

  const updateProductMutation = useUpdateAdminProduct({
    onSuccess: (_, variables) => {
      setSheetOpen(false);
      setSelectedProduct(null);
      toast({
        title: t("toastUpdated"),
        description: t("toastUpdatedDescription", { id: variables.id }),
      });
    },
    onError: (error) => {
      toast({
        title: tc("updateFailed"),
        description: error.message,
      });
    },
  });

  const deleteProductMutation = useDeleteAdminProduct({
    onSuccess: (_, variables) => {
      setConfirmDeleteOpen(false);
      setProductToDelete(null);
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

  const resetForm = () => {
    setName("");
    setPrice("");
    setCategoryId("");
    setImageUrl("");
    setDescription("");
  };

  const openCreateSheet = () => {
    setSelectedProduct(null);
    resetForm();
    setSheetOpen(true);
  };

  const openEditSheet = (product: any) => {
    setSelectedProduct(product);
    setName(product.name || "");
    setPrice(product.price?.toString() ?? "");
    setCategoryId(product.category?.id?.toString() ?? "");
    setImageUrl(product.images?.[0] ?? "");
    setDescription(product.description || "");
    setSheetOpen(true);
  };

  const openDeleteDialog = (product: any) => {
    setProductToDelete(product);
    setConfirmDeleteOpen(true);
  };

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!categoryId) return;

    const payload = {
      name,
      description,
      price: parseFloat(price),
      images: imageUrl ? [imageUrl] : [],
      category: { id: Number(categoryId) },
      attributes: {},
    };

    if (selectedProduct) {
      updateProductMutation.mutate({ id: selectedProduct.id, data: payload });
    } else {
      createProductMutation.mutate(payload);
    }
  };

  const handleDelete = () => {
    if (!productToDelete) return;
    deleteProductMutation.mutate(productToDelete.id);
  };

  const handleCloseSheet = (open: boolean) => {
    if (!open) {
      setSheetOpen(false);
      setSelectedProduct(null);
      resetForm();
    }
  };

  if (isLoading || categoriesLoading) {
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

  const products = data?.products || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Button onClick={openCreateSheet}>{t("addButton")}</Button>
      </div>

      <Sheet open={sheetOpen} onOpenChange={handleCloseSheet}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>
              {selectedProduct ? t("editTitle") : t("newTitle")}
            </SheetTitle>
            <SheetDescription>
              {selectedProduct ? t("editDescription") : t("newDescription")}
            </SheetDescription>
          </SheetHeader>
          <form className="space-y-4 py-4" onSubmit={handleSave}>
            <div className="grid gap-2">
              <Label htmlFor="product-name">{tc("name")}</Label>
              <Input
                id="product-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="product-price">{t("price")}</Label>
              <Input
                id="product-price"
                type="number"
                step="0.01"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="product-category">{t("category")}</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger id="product-category" className="w-full">
                  <SelectValue placeholder={t("selectCategory")} />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="product-image">{tc("imageUrl")}</Label>
              <Input
                id="product-image"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                placeholder={tc("imageUrlPlaceholder")}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="product-description">{tc("description")}</Label>
              <Textarea
                id="product-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={4}
              />
            </div>
            <SheetFooter>
              <Button
                type="submit"
                disabled={
                  createProductMutation.isLoading ||
                  updateProductMutation.isLoading
                }
              >
                {selectedProduct ? t("saveChanges") : t("saveProduct")}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      <Card>
        <CardHeader>
          <CardTitle>{t("catalogTitle")}</CardTitle>
          <CardDescription>{t("catalogDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <TableScrollContainer>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{tc("name")}</TableHead>
                  <TableHead>{t("tableCategory")}</TableHead>
                  <TableHead>{t("tablePrice")}</TableHead>
                  <TableHead className="hidden md:table-cell">
                    {tc("description")}
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    {tc("created")}
                  </TableHead>
                  <TableHead>{tc("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product: any) => (
                  <TableRow key={product.id}>
                    <TableCell className="max-w-[120px] truncate sm:max-w-none">
                      {product.name}
                    </TableCell>
                    <TableCell>
                      {product.category?.name ?? t("uncategorized")}
                    </TableCell>
                    <TableCell>
                      ${product.price?.toFixed?.(2) ?? product.price}
                    </TableCell>
                    <TableCell className="hidden max-w-xs truncate md:table-cell">
                      {product.description}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {new Date(
                        product.created_at ?? product.createdAt,
                      ).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu
                        open={openMenuProductId === product.id}
                        onOpenChange={(value) =>
                          setOpenMenuProductId(value ? product.id : null)
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
                            onSelect={() => {
                              setOpenMenuProductId(null);
                              openEditSheet(product);
                            }}
                          >
                            {t("editMenu")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => {
                              setOpenMenuProductId(null);
                              openDeleteDialog(product);
                            }}
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
          {t("footerCount", { count: products.length })}
        </CardFooter>
      </Card>

      <Dialog
        open={confirmDeleteOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) setConfirmDeleteOpen(false);
          setConfirmDeleteOpen(isOpen);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("deleteTitle")}</DialogTitle>
            <DialogDescription>
              {t("deleteDescription", { name: productToDelete?.name ?? "" })}{" "}
              {tc("deleteConfirmGeneric")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDeleteOpen(false)}
            >
              {tc("cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteProductMutation.isLoading}
            >
              {t("deleteButton")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
