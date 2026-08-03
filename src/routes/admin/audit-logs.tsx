import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getAuditLogs } from "@/lib/admin";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollText, Loader as Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export const Route = createFileRoute("/admin/audit-logs")({
  head: () => ({ meta: [{ title: "Audit Logs — TeretVerse Admin" }] }),
  component: AuditLogsPage,
});

const ACTION_COLORS: Record<string, string> = {
  user_suspended: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  user_banned: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  user_reinstated: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  story_deleted: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  story_status_changed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  login: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  logout: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

function AuditLogsPage() {
  const [search, setSearch] = useState("");
  const { data: logs = [], isLoading } = useQuery({
    queryKey: ["audit-logs"],
    queryFn: () => getAuditLogs({ data: { limit: 100 } }),
  });

  const filtered = logs.filter((l: any) =>
    !search ||
    l.action?.toLowerCase().includes(search.toLowerCase()) ||
    l.actorEmail?.toLowerCase().includes(search.toLowerCase()) ||
    l.targetId?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">Audit Logs</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Every admin action is tracked and logged</p>
      </div>

      <Card className="border-slate-200 dark:border-slate-800">
        <CardContent className="p-0">
          <div className="border-b border-slate-200 p-4 dark:border-slate-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input placeholder="Search by action, actor, or target…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
          </div>

          {isLoading ? (
            <div className="flex h-64 items-center justify-center"><Loader2 className="size-8 animate-spin text-amber-500" /></div>
          ) : filtered.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-center">
              <ScrollText className="mb-3 size-12 text-slate-300 dark:text-slate-700" />
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">No audit logs found</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {filtered.map((log: any) => (
                <div key={log.id} className="flex items-start gap-4 p-4">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                    <ScrollText className="size-4 text-slate-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`inline-block rounded-md px-2 py-0.5 text-xs font-bold ${ACTION_COLORS[log.action] || "bg-slate-100 text-slate-600"}`}>
                        {log.action}
                      </span>
                      <span className="text-xs text-slate-500">{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{log.details}</p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      By <span className="font-mono">{log.actorEmail || log.actorId}</span>
                      {log.targetId && <> · Target: <span className="font-mono">{log.targetId}</span></>}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
