"use client";

import React, { useState } from "react";
import useGetCategories from "@/hooks/category/useGetCategories";
import useCreateCategory from "@/hooks/category/useCreateCategory";
import useDeleteCategory from "@/hooks/category/useDeleteCategory";
import useUpdateCategory from "@/hooks/category/useUpdateCategory";
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

export default function AdminCategoriesPage() {
  const { data: categories, isLoading, error } = useGetCategories();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [deletingCategory, setDeletingCategory] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [openMenuCategoryId, setOpenMenuCategoryId] = useState<number | null>(
    null,
  );
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const createCategoryMutation = useCreateCategory({
    onSuccess: () => {
      setOpen(false);
      setName("");
      setDescription("");
      setImage("");
      toast({
        title: "Category added",
        description: "The category has been added successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Create failed",
        description: error.message,
      });
    },
  });

  const updateCategoryMutation = useUpdateCategory({
    onSuccess: (_, variables) => {
      setOpen(false);
      setEditingCategory(null);
      toast({
        title: "Category updated",
        description: `Category ${variables.id} has been updated.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: error.message,
      });
    },
  });

  const deleteCategoryMutation = useDeleteCategory({
    onSuccess: (_, variables) => {
      setDialogOpen(false);
      setDeletingCategory(null);
      toast({
        title: "Category deleted",
        description: `Category #${variables} has been removed.`,
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
    setDescription("");
    setImage("");
  };

  const openCreateSheet = () => {
    setEditingCategory(null);
    resetForm();
    setOpen(true);
  };

  const openEditSheet = (category: any) => {
    setEditingCategory(category);
    setName(category.name || "");
    setDescription(category.description || "");
    setImage(category.image || "");
    setOpen(true);
  };

  const openDeleteDialog = (category: any) => {
    setDeletingCategory(category);
    setDialogOpen(true);
  };

  const handleSaveCategory = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = { name, description, image };

    if (editingCategory) {
      updateCategoryMutation.mutate({ id: editingCategory.id, data: payload });
      return;
    }

    createCategoryMutation.mutate(payload);
  };

  const handleDelete = () => {
    if (!deletingCategory) return;
    deleteCategoryMutation.mutate(deletingCategory.id);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDeletingCategory(null);
  };

  const handleCloseSheet = () => {
    setOpen(false);
    setEditingCategory(null);
    resetForm();
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        Loading categories...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        Error loading categories: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Categories</h1>
          <p className="text-sm text-slate-600">
            Create, review, and remove product categories.
          </p>
        </div>
        <Button onClick={openCreateSheet}>Create category</Button>
      </div>

      <Sheet
        open={open}
        onOpenChange={(value) => {
          if (!value) handleCloseSheet();
          setOpen(value);
        }}
      >
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>
              {editingCategory ? "Edit category" : "New category"}
            </SheetTitle>
            <SheetDescription>
              {editingCategory
                ? "Update the category details."
                : "Enter category details and save."}
            </SheetDescription>
          </SheetHeader>
          <form className="space-y-4 py-4" onSubmit={handleSaveCategory}>
            <div className="grid gap-2">
              <Label htmlFor="category-name">Name</Label>
              <Input
                id="category-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category-description">Description</Label>
              <Textarea
                id="category-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category-image">Image URL</Label>
              <Input
                id="category-image"
                value={image}
                onChange={(event) => setImage(event.target.value)}
                placeholder="https://..."
              />
            </div>
            <SheetFooter>
              <Button
                type="submit"
                disabled={
                  createCategoryMutation.isLoading ||
                  updateCategoryMutation.isLoading
                }
              >
                {editingCategory ? "Update category" : "Save category"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      <Card>
        <CardHeader>
          <CardTitle>Category list</CardTitle>
          <CardDescription>
            All available categories loaded from the API.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories?.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.description}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {category.image || "—"}
                    </TableCell>
                    <TableCell>
                      {new Date(category.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu
                        open={openMenuCategoryId === category.id}
                        onOpenChange={(value) =>
                          setOpenMenuCategoryId(value ? category.id : null)
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
                              setOpenMenuCategoryId(null);
                              openEditSheet(category);
                            }}
                          >
                            Edit category
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => {
                              setOpenMenuCategoryId(null);
                              openDeleteDialog(category);
                            }}
                          >
                            Delete category
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
          {categories?.length ?? 0} categories available.
        </CardFooter>
      </Card>

      <Dialog
        open={dialogOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) handleCloseDialog();
          setDialogOpen(isOpen);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong>{deletingCategory?.name}</strong>? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteCategoryMutation.isLoading}
            >
              Delete category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
