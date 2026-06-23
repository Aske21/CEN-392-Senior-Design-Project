"use client";

import React, { useState } from "react";
import useGetAdminUsers from "@/hooks/admin/useGetAdminUsers";
import useDeleteAdminUser from "@/hooks/admin/useDeleteAdminUser";
import useUpdateAdminUserRole from "@/hooks/admin/useUpdateAdminUserRole";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { FiMoreVertical } from "react-icons/fi";
import { useTranslations } from "next-intl";

const roles = ["customer", "admin"] as const;
type UserRole = (typeof roles)[number];

const roleVariant = (role: string) =>
  role === "admin" ? "success" : "secondary";

type UserAction = "delete" | "role";

type PendingAction = {
  type: UserAction;
  user: any;
  newRole?: string;
} | null;

export default function AdminUsersPage() {
  const t = useTranslations("Admin.users");
  const tc = useTranslations("Admin.common");
  const tRole = useTranslations("UserRole");
  const { data, error, isLoading } = useGetAdminUsers(1, 50);
  const { toast } = useToast();

  const translateRole = (role: string) =>
    roles.includes(role as UserRole) ? tRole(role as UserRole) : role;

  const updateRoleMutation = useUpdateAdminUserRole({
    onSuccess: (_, variables) => {
      toast({
        title: t("toastRoleUpdated"),
        description: t("toastRoleUpdatedDescription", {
          id: variables.id,
          role: translateRole(variables.role),
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

  const deleteUserMutation = useDeleteAdminUser({
    onSuccess: (_, variables) => {
      toast({
        title: t("toastUserRemoved"),
        description: t("toastUserRemovedDescription", { id: variables }),
      });
    },
    onError: (error) => {
      toast({
        title: tc("deleteFailed"),
        description: error.message,
      });
    },
  });

  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [openMenuUserId, setOpenMenuUserId] = useState<number | null>(null);

  const users = data?.users || [];

  const handleOpenDelete = (user: any) => {
    setPendingAction({ type: "delete", user });
    setDialogOpen(true);
  };

  const handleOpenRoleChange = (user: any) => {
    setPendingAction({ type: "role", user, newRole: user.user_type });
    setDialogOpen(true);
  };

  const handleConfirm = () => {
    if (!pendingAction) return;

    if (pendingAction.type === "delete") {
      deleteUserMutation.mutate(pendingAction.user.id);
    }

    if (pendingAction.type === "role" && pendingAction.newRole) {
      updateRoleMutation.mutate({
        id: pendingAction.user.id,
        role: pendingAction.newRole,
      });
    }

    setDialogOpen(false);
    setPendingAction(null);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setPendingAction(null);
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        {tc("loadingUsers")}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        {tc("errorLoadingUsers")} {error.message}
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
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="rounded-full bg-muted px-3 py-1">
            {t("totalBadge", { count: data?.total || users.length })}
          </span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("insightsTitle")}</CardTitle>
          <CardDescription>{t("insightsDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border bg-muted p-4">
              <p className="text-sm text-muted-foreground">
                {t("totalAccounts")}
              </p>
              <div className="mt-2 text-3xl font-semibold text-foreground">
                {data?.total || users.length}
              </div>
            </div>
            <div className="rounded-2xl border bg-muted p-4">
              <p className="text-sm text-muted-foreground">
                {t("roleBreakdown")}
              </p>
              <div className="mt-2 text-xl font-semibold text-foreground">
                <Badge variant="success">
                  {t("adminsCount")}{" "}
                  {
                    users.filter((user: any) => user.user_type === "admin")
                      .length
                  }{" "}
                </Badge>{" "}
                <Badge variant="secondary">
                  {t("customersCount")}{" "}
                  {
                    users.filter((user: any) => user.user_type !== "admin")
                      .length
                  }{" "}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
                  <TableHead className="hidden sm:table-cell">
                    {t("tableId")}
                  </TableHead>
                  <TableHead>{t("tableEmail")}</TableHead>
                  <TableHead>{t("tableRole")}</TableHead>
                  <TableHead>{tc("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user: any) => (
                  <TableRow key={user.id}>
                    <TableCell className="hidden sm:table-cell">
                      #{user.id}
                    </TableCell>
                    <TableCell className="max-w-[160px] truncate sm:max-w-xs">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <Badge variant={roleVariant(user.user_type)}>
                        {translateRole(user.user_type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu
                        open={openMenuUserId === user.id}
                        onOpenChange={(value) =>
                          setOpenMenuUserId(value ? user.id : null)
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
                              setOpenMenuUserId(null);
                              handleOpenRoleChange(user);
                            }}
                          >
                            {t("changeRoleMenu")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => {
                              setOpenMenuUserId(null);
                              handleOpenDelete(user);
                            }}
                          >
                            {t("deleteUserMenu")}
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
          {t("footerCount", { count: users.length })}
        </CardFooter>
      </Card>

      <Dialog
        open={dialogOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) handleClose();
          setDialogOpen(isOpen);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {pendingAction?.type === "delete"
                ? t("confirmDeletion")
                : t("confirmRoleChange")}
            </DialogTitle>
            <DialogDescription>
              {pendingAction?.type === "delete"
                ? t("deleteDescription", {
                    email: pendingAction.user.email,
                  })
                : t("roleChangeDescription", {
                    email: pendingAction?.user.email ?? "",
                  })}{" "}
              {pendingAction?.type === "delete" &&
                tc("deleteConfirmCannotUndo")}
            </DialogDescription>
          </DialogHeader>

          {pendingAction?.type === "role" && (
            <div className="mt-4 space-y-4">
              <div className="rounded-2xl border bg-muted p-4">
                <p className="text-sm text-muted-foreground">
                  {t("currentRole", {
                    role: translateRole(pendingAction.user.user_type),
                  })}
                </p>
                <div className="mt-3">
                  <Select
                    value={pendingAction.newRole}
                    onValueChange={(value) =>
                      setPendingAction((current) =>
                        current ? { ...current, newRole: value } : null,
                      )
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("selectRole")} />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {translateRole(role)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              {tc("cancel")}
            </Button>
            <Button
              variant={
                pendingAction?.type === "delete" ? "destructive" : "secondary"
              }
              onClick={handleConfirm}
              disabled={
                deleteUserMutation.isLoading || updateRoleMutation.isLoading
              }
            >
              {pendingAction?.type === "delete"
                ? t("deleteUser")
                : t("saveRole")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
