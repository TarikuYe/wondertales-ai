import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Sparkles, Image as ImageIcon, Headphones, Zap, DollarSign, Clock, TrendingUp, CircleAlert as AlertCircle } from "lucide-react";

export const Route = createFileRoute("/admin/ai-usage")({
  head: () => ({ meta: [{ title: "AI Usage — TeretVerse Admin" }] }),
  component: AIUsagePage,
});

const dailyUsage = [
  { day: "Aug 1", gemini: 420, image: 180, voice: 95 },
  { day: "Aug 2", gemini: 510, image: 220, voice: 110 },
  { day: "Aug 3", gemini: 680, image: 310, voice: 150 },
  { day: "Aug 4", gemini: 590, image: 260, voice: 130 },
  { day: "Aug 5", gemini: 720, image: 340, voice: 170 },
  { day: "Aug 6", gemini: 890, image: 420, voice: 210 },
  { day: "Aug 7", gemini: 810, image: 380, voice: 190 },
];

const latencyData = [
  { day: "Aug 1", gemini: 1.2, image: 8.5, voice: 3.2 },
  { day: "Aug 2", gemini: 1.1, image: 9.1, voice: 3.5 },
  { day: "Aug 3", gemini: 1.4, image: 7.8, voice: 2.9 },
  { day: "Aug 4", gemini: 1.0, image: 8.2, voice: 3.1 },
  { day: "Aug 5", gemini: 1.3, image: 9.5, voice: 3.8 },
  { day: "Aug 6", gemini: 1.5, image: 10.2, voice: 4.1 },
  { day: "Aug 7", gemini: 1.2, image: 8.9, voice: 3.4 },
];

const modelStats = [
  { provider: "Gemini 1.5 Flash", requests: 4620, avgTokens: 850, successRate: 98.5, avgCost: 0.0008, status: "active" },
  { provider: "Pollinations (Image)", requests: 2110, avgTokens: 0, successRate: 95.2, avgCost: 0, status: "active" },
  { provider: "Web Speech API (Voice)", requests: 1055, avgTokens: 0, successRate: 99.1, avgCost: 0, status: "active" },
];

function StatBox({ icon: Icon, label, value, sub, color }: any) {
  return (
    <Card className="border-slate-200 dark:border-slate-800">
      <CardContent className="flex items-center gap-3 p-4">
        <div className={`flex size-10 items-center justify-center rounded-xl ${color}`}>
          <Icon className="size-5" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
          <p className="text-xl font-extrabold text-slate-900 dark:text-white">{value}</p>
          {sub && <p className="text-xs text-slate-400">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

function AIUsagePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">
          AI Usage Monitoring
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Track AI generation requests, costs, latency, and failures
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatBox icon={Sparkles} label="Total Requests (7d)" value="7,785" sub="+12.3%" color="bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400" />
        <StatBox icon={TrendingUp} label="Success Rate" value="97.6%" sub="↑ 0.4%" color="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" />
        <StatBox icon={Clock} label="Avg Latency" value="4.2s" sub="↓ 0.3s" color="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" />
        <StatBox icon={DollarSign} label="Est. Cost (7d)" value="$3.70" sub="Gemini only" color="bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader><CardTitle className="text-base">Daily API Requests</CardTitle><CardDescription>By AI service type</CardDescription></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={dailyUsage}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} /><stop offset="95%" stopColor="#f59e0b" stopOpacity={0} /></linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} /><stop offset="95%" stopColor="#a855f7" stopOpacity={0} /></linearGradient>
                  <linearGradient id="g3" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} /><stop offset="95%" stopColor="#3b82f6" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip /><Legend />
                <Area type="monotone" dataKey="gemini" name="Gemini (Text)" stroke="#f59e0b" fill="url(#g1)" strokeWidth={2} />
                <Area type="monotone" dataKey="image" name="Image Gen" stroke="#a855f7" fill="url(#g2)" strokeWidth={2} />
                <Area type="monotone" dataKey="voice" name="Voice (TTS)" stroke="#3b82f6" fill="url(#g3)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader><CardTitle className="text-base">Latency (seconds)</CardTitle><CardDescription>Response time by service</CardDescription></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={latencyData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip /><Legend />
                <Bar dataKey="gemini" name="Gemini" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="image" name="Image" fill="#a855f7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="voice" name="Voice" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Model breakdown table */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader><CardTitle className="text-base">Model Performance</CardTitle><CardDescription>Per-model request statistics</CardDescription></CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left dark:border-slate-800 dark:bg-slate-800/50">
                  <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">Provider</th>
                  <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">Requests (7d)</th>
                  <th className="hidden px-4 py-3 font-semibold text-slate-600 dark:text-slate-400 sm:table-cell">Avg Tokens</th>
                  <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">Success Rate</th>
                  <th className="hidden px-4 py-3 font-semibold text-slate-600 dark:text-slate-400 sm:table-cell">Avg Cost</th>
                  <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {modelStats.map((m) => (
                  <tr key={m.provider} className="border-b border-slate-100 dark:border-slate-800/50">
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{m.provider}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{m.requests.toLocaleString()}</td>
                    <td className="hidden px-4 py-3 text-slate-600 sm:table-cell dark:text-slate-400">{m.avgTokens || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`font-semibold ${m.successRate > 97 ? "text-emerald-600" : "text-amber-600"}`}>
                        {m.successRate}%
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 text-slate-600 sm:table-cell dark:text-slate-400">
                      {m.avgCost > 0 ? `$${m.avgCost.toFixed(4)}` : "Free"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                        {m.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900/30 dark:bg-amber-900/10">
        <CardContent className="flex items-start gap-3 p-5">
          <AlertCircle className="mt-0.5 size-5 shrink-0 text-amber-500" />
          <div>
            <p className="font-semibold text-amber-800 dark:text-amber-400">Usage Notice</p>
            <p className="text-sm text-amber-700 dark:text-amber-500/80">
              Image generation latency spiked on Aug 6 (10.2s avg). Consider enabling request caching
              or switching to a faster provider for peak hours.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
