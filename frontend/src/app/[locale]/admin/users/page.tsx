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

const roleVariant = (role: string) =>
  role === "admin" ? "success" : "secondary";

type UserAction = "delete" | "role";

type PendingAction = {
  type: UserAction;
  user: any;
  newRole?: string;
} | null;

export default function AdminUsersPage() {
  const { data, error, isLoading } = useGetAdminUsers(1, 50);
  const { toast } = useToast();

  const updateRoleMutation = useUpdateAdminUserRole({
    onSuccess: (_, variables) => {
      toast({
        title: "Role updated",
        description: `User ${variables.id} is now ${variables.role}.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: error.message,
      });
    },
  });

  const deleteUserMutation = useDeleteAdminUser({
    onSuccess: (_, variables) => {
      toast({
        title: "User removed",
        description: `User #${variables} has been deleted.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Delete failed",
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
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        Loading users...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        Error loading users: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Users</h1>
          <p className="text-sm text-slate-600">
            Review accounts, confirm role changes, and remove unwanted users
            safely.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="rounded-full bg-slate-100 px-3 py-1">
            {data?.total || users.length} users
          </span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User insights</CardTitle>
          <CardDescription>
            Quick account metrics and role breakdowns.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">
                Total registered accounts
              </p>
              <div className="mt-2 text-3xl font-semibold text-slate-900">
                {data?.total || users.length}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">
                Admins and customers count
              </p>
              <div className="mt-2 text-xl font-semibold text-slate-900">
                <Badge variant="success">
                  Admins:{" "}
                  {
                    users.filter((user: any) => user.user_type === "admin")
                      .length
                  }{" "}
                </Badge>{" "}
                <Badge variant="secondary">
                  Customers:{" "}
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
          <CardTitle>User list</CardTitle>
          <CardDescription>
            Manage users, change roles, and delete accounts safely.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0"></div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell>#{user.id}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={roleVariant(user.user_type)}>
                      {user.user_type}
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
                          className="text-slate-600 hover:bg-slate-100"
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
                          Change role
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => {
                            setOpenMenuUserId(null);
                            handleOpenDelete(user);
                          }}
                        >
                          Delete user
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
          {users.length} users shown.
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
                ? "Confirm deletion"
                : "Confirm role change"}
            </DialogTitle>
            <DialogDescription>
              {pendingAction?.type === "delete" ? (
                <>
                  This action will permanently remove{" "}
                  <strong>{pendingAction.user.email}</strong>. This cannot be
                  undone.
                </>
              ) : (
                <>
                  Update <strong>{pendingAction?.user.email}</strong> to the
                  selected role.
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {pendingAction?.type === "role" && (
            <div className="mt-4 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">
                  Current role: {pendingAction.user.user_type}
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
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer">customer</SelectItem>
                      <SelectItem value="admin">admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              Cancel
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
              {pendingAction?.type === "delete" ? "Delete user" : "Save role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
