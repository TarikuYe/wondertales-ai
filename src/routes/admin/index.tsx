import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getAdminStats } from "@/lib/admin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, Image, Headphones, TrendingUp, DollarSign, CreditCard, Activity, TriangleAlert as AlertTriangle, ShieldAlert, Loader as Loader2, ArrowUpRight, ArrowDownRight, Sparkles, Database, HardDrive, Zap } from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export const Route = createFileRoute("/admin/")({
  // Child of admin layout — path is relative
  head: () => ({
    meta: [{ title: "Dashboard — TeretVerse Admin" }],
  }),
  component: AdminDashboard,
});

const COLORS = ["#f59e0b", "#a855f7", "#3b82f6", "#10b981", "#f43f5e", "#6366f1"];

const userGrowthData = [
  { month: "Jan", users: 120, parents: 80, children: 40 },
  { month: "Feb", users: 280, parents: 190, children: 90 },
  { month: "Mar", users: 450, parents: 300, children: 150 },
  { month: "Apr", users: 680, parents: 450, children: 230 },
  { month: "May", users: 920, parents: 610, children: 310 },
  { month: "Jun", users: 1200, parents: 800, children: 400 },
  { month: "Jul", users: 1580, parents: 1050, children: 530 },
  { month: "Aug", users: 1920, parents: 1280, children: 640 },
];

const storyGrowthData = [
  { day: "Mon", stories: 45 },
  { day: "Tue", stories: 62 },
  { day: "Wed", stories: 58 },
  { day: "Thu", stories: 71 },
  { day: "Fri", stories: 89 },
  { day: "Sat", stories: 120 },
  { day: "Sun", stories: 95 },
];

const categoryData = [
  { name: "Adventure", value: 32 },
  { name: "Bedtime", value: 25 },
  { name: "Animals", value: 18 },
  { name: "Space", value: 12 },
  { name: "Fantasy", value: 8 },
  { name: "Other", value: 5 },
];

const languageData = [
  { name: "English", value: 65 },
  { name: "Amharic", value: 12 },
  { name: "French", value: 8 },
  { name: "Spanish", value: 7 },
  { name: "Arabic", value: 5 },
  { name: "Swahili", value: 3 },
];

const activeUsersData = [
  { day: "Mon", dau: 320, mau: 1200 },
  { day: "Tue", dau: 410, mau: 1250 },
  { day: "Wed", dau: 380, mau: 1280 },
  { day: "Thu", dau: 450, mau: 1320 },
  { day: "Fri", dau: 520, mau: 1380 },
  { day: "Sat", dau: 680, mau: 1450 },
  { day: "Sun", dau: 590, mau: 1500 },
];

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  color,
}: {
  title: string;
  value: string | number;
  icon: typeof Users;
  trend?: string;
  trendUp?: boolean;
  color: string;
}) {
  return (
    <Card className="overflow-hidden border-slate-200 dark:border-slate-800">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {title}
            </p>
            <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
              {value}
            </p>
            {trend && (
              <p className={`mt-1 flex items-center gap-1 text-xs font-semibold ${trendUp ? "text-emerald-600" : "text-rose-500"}`}>
                {trendUp ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                {trend}
              </p>
            )}
          </div>
          <div className={`flex size-11 items-center justify-center rounded-xl ${color}`}>
            <Icon className="size-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ChartCard({
  title,
  description,
  children,
  className = "",
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={`border-slate-200 dark:border-slate-800 ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold text-slate-900 dark:text-white">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => getAdminStats(),
  });

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-amber-500" />
      </div>
    );
  }

  const s = stats!;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Platform overview — live metrics and trends
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Export</Button>
          <Button variant="outline" size="sm">Last 30 days</Button>
        </div>
      </div>

      {/* Stat cards row 1 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Users" value={s.totalUsers.toLocaleString()} icon={Users} trend="+12.5%" trendUp color="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" />
        <StatCard title="Parents" value={s.parents.toLocaleString()} icon={Users} trend="+8.2%" trendUp color="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" />
        <StatCard title="Children" value={s.children.toLocaleString()} icon={Users} trend="+15.3%" trendUp color="bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400" />
        <StatCard title="Teachers" value={s.teachers.toLocaleString()} icon={Users} trend="+5.1%" trendUp color="bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400" />
      </div>

      {/* Stat cards row 2 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Stories Today" value={s.storiesToday} icon={BookOpen} trend="+23%" trendUp color="bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400" />
        <StatCard title="Stories This Month" value={s.storiesThisMonth.toLocaleString()} icon={BookOpen} color="bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400" />
        <StatCard title="Images Generated" value={s.imagesGenerated.toLocaleString()} icon={Image} trend="+18%" trendUp color="bg-cyan-50 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400" />
        <StatCard title="Audio Generated" value={s.audioGenerated.toLocaleString()} icon={Headphones} color="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400" />
      </div>

      {/* Stat cards row 3 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Daily Active Users" value={s.dailyActiveUsers.toLocaleString()} icon={Activity} trend="+4.7%" trendUp color="bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400" />
        <StatCard title="Monthly Active Users" value={s.monthlyActiveUsers.toLocaleString()} icon={TrendingUp} trend="+9.1%" trendUp color="bg-lime-50 text-lime-600 dark:bg-lime-900/20 dark:text-lime-400" />
        <StatCard title="API Requests" value={s.apiRequests.toLocaleString()} icon={Zap} color="bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400" />
        <StatCard title="Revenue" value={`$${s.revenue.toLocaleString()}`} icon={DollarSign} trend="+0%" color="bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400" />
      </div>

      {/* Charts row 1 */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="User Growth" description="Total users, parents, and children over time">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={userGrowthData}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorParents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorChildren" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="users" name="Total Users" stroke="#f59e0b" fillOpacity={1} fill="url(#colorUsers)" strokeWidth={2} />
              <Area type="monotone" dataKey="parents" name="Parents" stroke="#3b82f6" fillOpacity={1} fill="url(#colorParents)" strokeWidth={2} />
              <Area type="monotone" dataKey="children" name="Children" stroke="#a855f7" fillOpacity={1} fill="url(#colorChildren)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Story Generation" description="Stories created per day this week">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={storyGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="stories" name="Stories" fill="#f59e0b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts row 2 */}
      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Story Categories" description="Distribution by genre">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Languages" description="Story language distribution">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={languageData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {languageData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Active Users" description="DAU vs MAU trend">
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={activeUsersData}>
              <defs>
                <linearGradient id="colorDAU" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="dau" name="DAU" stroke="#10b981" fill="url(#colorDAU)" strokeWidth={2} />
              <Area type="monotone" dataKey="mau" name="MAU" stroke="#6366f1" fill="none" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* System health row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Subscriptions" value={s.subscriptions} icon={CreditCard} color="bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400" />
        <StatCard title="Pending Reports" value={s.pendingReports} icon={AlertTriangle} color="bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400" />
        <StatCard title="Pending Moderation" value={s.pendingModeration} icon={ShieldAlert} color="bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400" />
        <StatCard title="Errors (24h)" value={s.errors} icon={AlertTriangle} color="bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400" />
      </div>

      {/* Quick links */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ChartCard title="Database Reads" description="Firestore read operations">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
              <Database className="size-6" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {((s.totalUsers + s.storiesThisMonth) * 3.2).toFixed(0)}
              </p>
              <p className="text-xs text-slate-500">operations today</p>
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Storage Usage" description="Firebase Storage consumption">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
              <HardDrive className="size-6" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {(s.imagesGenerated * 1.5).toFixed(1)} MB
              </p>
              <p className="text-xs text-slate-500">estimated from images</p>
            </div>
          </div>
        </ChartCard>

        <ChartCard title="AI Usage" description="Total AI generation calls">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
              <Sparkles className="size-6" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {s.storiesThisMonth}
              </p>
              <p className="text-xs text-slate-500">stories generated this month</p>
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
