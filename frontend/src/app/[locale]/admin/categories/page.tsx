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

export default function AdminCategoriesPage() {
  const t = useTranslations("Admin.categories");
  const tc = useTranslations("Admin.common");
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

  const updateCategoryMutation = useUpdateCategory({
    onSuccess: (_, variables) => {
      setOpen(false);
      setEditingCategory(null);
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

  const deleteCategoryMutation = useDeleteCategory({
    onSuccess: (_, variables) => {
      setDialogOpen(false);
      setDeletingCategory(null);
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
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        {tc("loadingCategories")}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        {tc("errorLoadingCategories")} {error.message}
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
        <Button onClick={openCreateSheet}>{t("createButton")}</Button>
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
              {editingCategory ? t("editTitle") : t("newTitle")}
            </SheetTitle>
            <SheetDescription>
              {editingCategory ? t("editDescription") : t("newDescription")}
            </SheetDescription>
          </SheetHeader>
          <form className="space-y-4 py-4" onSubmit={handleSaveCategory}>
            <div className="grid gap-2">
              <Label htmlFor="category-name">{tc("name")}</Label>
              <Input
                id="category-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category-description">{tc("description")}</Label>
              <Textarea
                id="category-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category-image">{tc("imageUrl")}</Label>
              <Input
                id="category-image"
                value={image}
                onChange={(event) => setImage(event.target.value)}
                placeholder={tc("imageUrlPlaceholder")}
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
                {editingCategory ? t("updateButton") : t("saveButton")}
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
                  <TableHead className="hidden md:table-cell">
                    {tc("description")}
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    {t("tableImage")}
                  </TableHead>
                  <TableHead className="hidden sm:table-cell">
                    {tc("created")}
                  </TableHead>
                  <TableHead>{tc("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories?.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="max-w-[120px] truncate sm:max-w-none">
                      {category.name}
                    </TableCell>
                    <TableCell className="hidden max-w-xs truncate md:table-cell">
                      {category.description}
                    </TableCell>
                    <TableCell className="hidden max-w-xs truncate lg:table-cell">
                      {category.image || "—"}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
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
                            className="text-muted-foreground hover:bg-accent hover:text-accent-foreground"
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
                            {t("editMenu")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => {
                              setOpenMenuCategoryId(null);
                              openDeleteDialog(category);
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
          {t("footerCount", { count: categories?.length ?? 0 })}
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
            <DialogTitle>{t("deleteTitle")}</DialogTitle>
            <DialogDescription>
              {t("deleteDescription", { name: deletingCategory?.name ?? "" })}{" "}
              {tc("deleteConfirmCannotUndo")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              {tc("cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteCategoryMutation.isLoading}
            >
              {t("deleteButton")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
