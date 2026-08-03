import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, CircleCheck as CheckCircle2, TriangleAlert as AlertTriangle, Server, Database, HardDrive, Zap, Cloud, Shield } from "lucide-react";

export const Route = createFileRoute("/admin/system-health")({
  head: () => ({ meta: [{ title: "System Health — TeretVerse Admin" }] }),
  component: SystemHealthPage,
});

const services = [
  { name: "Firebase Authentication", status: "operational", icon: Shield, latency: "45ms" },
  { name: "Firestore Database", status: "operational", icon: Database, latency: "32ms" },
  { name: "Cloud Storage", status: "operational", icon: HardDrive, latency: "120ms" },
  { name: "Cloud Functions", status: "operational", icon: Zap, latency: "850ms" },
  { name: "Hosting", status: "operational", icon: Cloud, latency: "18ms" },
  { name: "App Check", status: "operational", icon: Shield, latency: "12ms" },
  { name: "Gemini API", status: "degraded", icon: Activity, latency: "2.4s" },
  { name: "Pollinations (Image)", status: "operational", icon: Server, latency: "8.2s" },
];

const STATUS_STYLES: Record<string, { badge: string; dot: string }> = {
  operational: { badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", dot: "bg-emerald-500" },
  degraded: { badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", dot: "bg-amber-500" },
  down: { badge: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400", dot: "bg-rose-500" },
};

function SystemHealthPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">System Health</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Real-time monitoring of all platform services</p>
      </div>

      {/* Overall status banner */}
      <Card className="border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/30 dark:bg-emerald-900/10">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="flex size-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
            <CheckCircle2 className="size-6 text-emerald-600" />
          </div>
          <div>
            <h2 className="font-bold text-emerald-800 dark:text-emerald-400">All Systems Operational</h2>
            <p className="text-sm text-emerald-700 dark:text-emerald-500/80">1 service experiencing degraded performance. Last checked: just now.</p>
          </div>
        </CardContent>
      </Card>

      {/* Service grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((svc) => {
          const style = STATUS_STYLES[svc.status];
          return (
            <Card key={svc.name} className="border-slate-200 dark:border-slate-800">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                    <svc.icon className="size-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-slate-900 dark:text-white">{svc.name}</p>
                    <p className="text-xs text-slate-500">Latency: {svc.latency}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`size-2.5 rounded-full ${style.dot} ${svc.status === "degraded" ? "animate-pulse" : ""}`} />
                  <Badge className={style.badge}>{svc.status}</Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Crash reports */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardContent className="p-5">
          <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <AlertTriangle className="size-5 text-amber-500" /> Recent Incidents
          </h3>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50/50 p-3 dark:border-amber-900/30 dark:bg-amber-900/10">
              <div>
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-400">Gemini API elevated latency</p>
                <p className="text-xs text-amber-600 dark:text-amber-500/70">Started 2 hours ago · Investigating</p>
              </div>
              <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Monitoring</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
