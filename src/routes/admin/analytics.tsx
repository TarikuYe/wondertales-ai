import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadialBarChart,
  RadialBar,
} from "recharts";
import { TrendingUp, BookOpen, Clock, Users, Sparkles, Headphones, Award, Globe } from "lucide-react";

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({ meta: [{ title: "Analytics — TeretVerse Admin" }] }),
  component: AnalyticsPage,
});

const COLORS = ["#f59e0b", "#a855f7", "#3b82f6", "#10b981", "#f43f5e", "#6366f1", "#ec4899"];

const storyPopularity = [
  { name: "Adventure", reads: 4200 },
  { name: "Bedtime", reads: 3800 },
  { name: "Animals", reads: 2900 },
  { name: "Space", reads: 1800 },
  { name: "Fantasy", reads: 1500 },
  { name: "Kindness", reads: 1200 },
  { name: "STEM", reads: 900 },
];

const readingTimeData = [
  { day: "Mon", minutes: 240 },
  { day: "Tue", minutes: 310 },
  { day: "Wed", minutes: 280 },
  { day: "Thu", minutes: 350 },
  { day: "Fri", minutes: 420 },
  { day: "Sat", minutes: 580 },
  { day: "Sun", minutes: 510 },
];

const completionData = [
  { name: "0-25%", value: 8 },
  { name: "25-50%", value: 15 },
  { name: "50-75%", value: 28 },
  { name: "75-100%", value: 49 },
];

const ageGroups = [
  { name: "3-5", value: 32 },
  { name: "6-8", value: 41 },
  { name: "9-10", value: 18 },
  { name: "11-12", value: 9 },
];

const voiceUsage = [
  { name: "Grandmother", value: 28 },
  { name: "Friendly Dad", value: 35 },
  { name: "Young Girl", value: 18 },
  { name: "Wizard", value: 12 },
  { name: "Pirate", value: 4 },
  { name: "Robot", value: 3 },
];

const illustrationStyles = [
  { name: "Storybook", value: 30 },
  { name: "Watercolor", value: 22 },
  { name: "Soft Cartoon", value: 18 },
  { name: "3D Cartoon", value: 12 },
  { name: "Fantasy", value: 10 },
  { name: "Other", value: 8 },
];

const quizScoreData = [
  { subject: "Comprehension", score: 78, fill: "#f59e0b" },
  { subject: "Vocabulary", score: 85, fill: "#a855f7" },
  { subject: "Recall", score: 72, fill: "#3b82f6" },
  { subject: "Inference", score: 68, fill: "#10b981" },
];

const topCountries = [
  { country: "United States", users: 5200, flag: "🇺🇸" },
  { country: "Ethiopia", users: 2100, flag: "🇪🇹" },
  { country: "Kenya", users: 1800, flag: "🇰🇪" },
  { country: "France", users: 1200, flag: "🇫🇷" },
  { country: "Spain", users: 900, flag: "🇪🇸" },
  { country: "Nigeria", users: 750, flag: "🇳🇬" },
];

function StatBox({ icon: Icon, label, value, color }: { icon: typeof TrendingUp; label: string; value: string; color: string }) {
  return (
    <Card className="border-slate-200 dark:border-slate-800">
      <CardContent className="flex items-center gap-3 p-4">
        <div className={`flex size-10 items-center justify-center rounded-xl ${color}`}>
          <Icon className="size-5" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
          <p className="text-xl font-extrabold text-slate-900 dark:text-white">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">
          Analytics
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Platform-wide learning and engagement insights
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatBox icon={BookOpen} label="Avg Completion Rate" value="73%" color="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" />
        <StatBox icon={Clock} label="Avg Reading Time" value="18 min" color="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" />
        <StatBox icon={Award} label="Avg Quiz Score" value="76%" color="bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400" />
        <StatBox icon={Users} label="Total Reading Hours" value="12.4K" color="bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400" />
      </div>

      {/* Charts row 1 */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader><CardTitle className="text-base">Story Popularity</CardTitle><CardDescription>Most read genres</CardDescription></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={storyPopularity} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={80} />
                <Tooltip />
                <Bar dataKey="reads" fill="#f59e0b" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader><CardTitle className="text-base">Reading Time</CardTitle><CardDescription>Minutes read per day this week</CardDescription></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={readingTimeData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="minutes" stroke="#3b82f6" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts row 2 */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader><CardTitle className="text-base">Completion Rate</CardTitle><CardDescription>How far children read</CardDescription></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={completionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {completionData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip /><Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader><CardTitle className="text-base">Age Groups</CardTitle><CardDescription>User distribution by age</CardDescription></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={ageGroups} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {ageGroups.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip /><Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader><CardTitle className="text-base">Quiz Scores</CardTitle><CardDescription>Average by category</CardDescription></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <RadialBarChart innerRadius="20%" outerRadius="90%" data={quizScoreData} startAngle={90} endAngle={-270}>
                <RadialBar dataKey="score" cornerRadius={6} />
                <Tooltip /><Legend />
              </RadialBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts row 3 */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader><CardTitle className="text-base">Voice Usage</CardTitle><CardDescription>Narration voice distribution</CardDescription></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={voiceUsage}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#a855f7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader><CardTitle className="text-base">Illustration Style Usage</CardTitle><CardDescription>Most chosen art styles</CardDescription></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={illustrationStyles} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {illustrationStyles.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip /><Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top countries */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Globe className="size-5 text-blue-500" /> Top Countries
          </CardTitle>
          <CardDescription>Users by geographic location</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topCountries.map((c, i) => (
              <div key={c.country} className="flex items-center gap-4">
                <span className="text-2xl">{c.flag}</span>
                <span className="w-32 font-semibold text-slate-700 dark:text-slate-300">{c.country}</span>
                <div className="h-6 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                    style={{ width: `${(c.users / topCountries[0].users) * 100}%` }}
                  />
                </div>
                <span className="w-16 text-right text-sm font-bold text-slate-700 dark:text-slate-300">{c.users.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
