import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { getAdminUsers, suspendUser, banUser, reinstateUser } from "@/lib/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Users, Search, Loader as Loader2, Ban, Pause, Play, Trash2, Download, ChevronLeft, ChevronRight, Mail, Calendar, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "Users — TeretVerse Admin" }] }),
  component: UserManagement,
});

const ROLE_COLORS: Record<string, string> = {
  parent: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  teacher: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  admin: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  super_admin: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
};

function UserManagement() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [page, setPage] = useState(0);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const pageSize = 20;
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users", roleFilter],
    queryFn: () => getAdminUsers({ data: { limit: 200, role: roleFilter !== "all" ? roleFilter : undefined } }),
  });

  const suspendMutation = useMutation({
    mutationFn: (userId: string) => suspendUser({ data: { userId } }),
    onSuccess: () => {
      toast.success("User suspended");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setSelectedUser(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const banMutation = useMutation({
    mutationFn: (userId: string) => banUser({ data: { userId } }),
    onSuccess: () => {
      toast.success("User banned");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setSelectedUser(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const reinstateMutation = useMutation({
    mutationFn: (userId: string) => reinstateUser({ data: { userId } }),
    onSuccess: () => {
      toast.success("User reinstated");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setSelectedUser(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const filtered = users.filter((u: any) => {
    const matchesSearch =
      !search ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const paginated = filtered.slice(page * pageSize, (page + 1) * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  function exportCSV() {
    const headers = ["ID", "Email", "Name", "Role", "Organization", "Created", "Disabled"];
    const rows = filtered.map((u: any) => [
      u.id,
      u.email ?? "",
      u.full_name ?? "",
      u.role,
      u.organization ?? "",
      u.created_at ?? "",
      u.disabled ? "Yes" : "No",
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users-export.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">
            User Management
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {filtered.length} users · search, filter, suspend, or ban accounts
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={exportCSV}>
          <Download className="mr-2 size-4" /> Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search by name, email, or ID…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="pl-9"
            />
          </div>
          <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setPage(0); }}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="parent">Parents</SelectItem>
              <SelectItem value="teacher">Teachers</SelectItem>
              <SelectItem value="admin">Admins</SelectItem>
              <SelectItem value="super_admin">Super Admins</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="size-8 animate-spin text-amber-500" />
            </div>
          ) : paginated.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-center">
              <Users className="mb-3 size-12 text-slate-300 dark:text-slate-700" />
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">No users found</p>
              <p className="text-xs text-slate-400">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left dark:border-slate-800 dark:bg-slate-800/50">
                    <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">User</th>
                    <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">Role</th>
                    <th className="hidden px-4 py-3 font-semibold text-slate-600 dark:text-slate-400 lg:table-cell">Organization</th>
                    <th className="hidden px-4 py-3 font-semibold text-slate-600 dark:text-slate-400 xl:table-cell">Joined</th>
                    <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">Status</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-600 dark:text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((user: any) => (
                    <tr
                      key={user.id}
                      className="border-b border-slate-100 transition-colors hover:bg-slate-50 dark:border-slate-800/50 dark:hover:bg-slate-800/30"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-sm font-bold text-white">
                            {(user.full_name || user.email || "?").charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-900 dark:text-white">
                              {user.full_name || "Unnamed"}
                            </p>
                            <p className="truncate text-xs text-slate-500">{user.email || "No email"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-md px-2 py-0.5 text-xs font-bold ${ROLE_COLORS[user.role] || "bg-slate-100 text-slate-600"}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="hidden px-4 py-3 text-slate-600 lg:table-cell dark:text-slate-400">
                        {user.organization || "—"}
                      </td>
                      <td className="hidden px-4 py-3 text-xs text-slate-500 xl:table-cell">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-4 py-3">
                        {user.disabled ? (
                          <Badge variant="destructive">Suspended</Badge>
                        ) : (
                          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                            Active
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedUser(user)}
                        >
                          Manage
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 dark:border-slate-800">
            <p className="text-xs text-slate-500">
              Page {page + 1} of {totalPages} · {filtered.length} total
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 0}
                onClick={() => setPage(p => p - 1)}
              >
                <ChevronLeft className="size-4" /> Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages - 1}
                onClick={() => setPage(p => p + 1)}
              >
                Next <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* User detail dialog */}
      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent className="sm:max-w-lg">
          {selectedUser && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display">User Details</DialogTitle>
                <DialogDescription>Manage account status and view profile information.</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-2xl font-bold text-white">
                    {(selectedUser.full_name || selectedUser.email || "?").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{selectedUser.full_name || "Unnamed"}</h3>
                    <p className="text-sm text-slate-500">{selectedUser.email}</p>
                    <span className={`mt-1 inline-block rounded-md px-2 py-0.5 text-xs font-bold ${ROLE_COLORS[selectedUser.role] || "bg-slate-100"}`}>
                      {selectedUser.role}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 rounded-lg bg-slate-50 p-4 dark:bg-slate-800/50">
                  <div>
                    <Label className="text-xs text-slate-500">User ID</Label>
                    <p className="truncate text-xs font-mono text-slate-700 dark:text-slate-300">{selectedUser.id}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500">Joined</Label>
                    <p className="text-xs text-slate-700 dark:text-slate-300">
                      {selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleString() : "—"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500">Organization</Label>
                    <p className="text-xs text-slate-700 dark:text-slate-300">{selectedUser.organization || "—"}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500">Status</Label>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {selectedUser.disabled ? "Suspended" : "Active"}
                    </p>
                  </div>
                </div>

                <DialogFooter>
                  {selectedUser.disabled ? (
                    <Button
                      variant="hero"
                      onClick={() => reinstateMutation.mutate(selectedUser.id)}
                      disabled={reinstateMutation.isPending}
                    >
                      <Play className="mr-2 size-4" /> Reinstate
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => suspendMutation.mutate(selectedUser.id)}
                        disabled={suspendMutation.isPending}
                      >
                        <Pause className="mr-2 size-4" /> Suspend
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => banMutation.mutate(selectedUser.id)}
                        disabled={banMutation.isPending}
                      >
                        <Ban className="mr-2 size-4" /> Ban
                      </Button>
                    </>
                  )}
                </DialogFooter>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
