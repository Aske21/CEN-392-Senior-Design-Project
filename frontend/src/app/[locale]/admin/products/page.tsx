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

export default function AdminProductsPage() {
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
        title: "Product added",
        description: "The product has been added to the catalog.",
      });
    },
    onError: (error) => {
      toast({
        title: "Create failed",
        description: error.message,
      });
    },
  });

  const updateProductMutation = useUpdateAdminProduct({
    onSuccess: (_, variables) => {
      setSheetOpen(false);
      setSelectedProduct(null);
      toast({
        title: "Product updated",
        description: `Product ${variables.id} has been saved.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: error.message,
      });
    },
  });

  const deleteProductMutation = useDeleteAdminProduct({
    onSuccess: (_, variables) => {
      setConfirmDeleteOpen(false);
      setProductToDelete(null);
      toast({
        title: "Product deleted",
        description: `Product #${variables} has been removed.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Delete failed",
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
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        Error loading products: {error.message}
      </div>
    );
  }

  const products = data?.products || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="text-sm text-slate-600">
            Review and add new products to the store.
          </p>
        </div>
        <Button onClick={openCreateSheet}>Add product</Button>
      </div>

      <Sheet open={sheetOpen} onOpenChange={handleCloseSheet}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>
              {selectedProduct ? "Edit product" : "New product"}
            </SheetTitle>
            <SheetDescription>
              {selectedProduct
                ? "Make updates and save them."
                : "Fill out the product details to add it to inventory."}
            </SheetDescription>
          </SheetHeader>
          <form className="space-y-4 py-4" onSubmit={handleSave}>
            <div className="grid gap-2">
              <Label htmlFor="product-name">Name</Label>
              <Input
                id="product-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="product-price">Price</Label>
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
              <Label htmlFor="product-category">Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger id="product-category" className="w-full">
                  <SelectValue placeholder="Select category" />
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
              <Label htmlFor="product-image">Image URL</Label>
              <Input
                id="product-image"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="product-description">Description</Label>
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
                {selectedProduct ? "Save changes" : "Save product"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      <Card>
        <CardHeader>
          <CardTitle>Product catalog</CardTitle>
          <CardDescription>
            Latest products currently available in inventory.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0"></div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product: any) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>
                    {product.category?.name ?? "Uncategorized"}
                  </TableCell>
                  <TableCell>
                    ${product.price?.toFixed?.(2) ?? product.price}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {product.description}
                  </TableCell>
                  <TableCell>
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
                          className="text-slate-600 hover:bg-slate-100"
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
                          Edit product
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => {
                            setOpenMenuProductId(null);
                            openDeleteDialog(product);
                          }}
                        >
                          Delete product
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="text-sm text-slate-500">
          {products.length} products shown.
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
            <DialogTitle>Delete product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong>{productToDelete?.name}</strong>? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteProductMutation.isLoading}
            >
              Delete product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
