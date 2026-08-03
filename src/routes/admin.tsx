import { createFileRoute, Outlet, redirect, Link, useNavigate, useLocation } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { auth, db } from "@/integrations/firebase/client";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, BookOpen, ShieldAlert, ChartBar as BarChart3, Settings, ScrollText, Activity, Headphones, CreditCard, Bell, LifeBuoy, Sparkles, Image, Circle as HelpCircle, Languages, Database, Wrench, Menu, X, ChevronDown, Search, LogOut, Loader as Loader2, ShieldCheck } from "lucide-react";
import mascot from "@/assets/mascot-wisp.png";

export const Route = createFileRoute("/admin")({
  ssr: false,
  beforeLoad: async () => {
    if (typeof window === "undefined") return { user: null, role: null };
    const user = await new Promise<any>((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (u) => {
        unsubscribe();
        resolve(u);
      });
    });
    if (!user) throw redirect({ to: "/admin-login" });

    let role: string | null = null;
    try {
      const roleDoc = await getDoc(doc(db, "user_roles", user.uid));
      if (roleDoc.exists()) role = roleDoc.data()?.role as string;
    } catch {}

    const ADMIN_ROLES = ['admin', 'super_admin', 'platform_admin', 'content_moderator', 'customer_support', 'finance_manager', 'developer'];
    if (!role || !ADMIN_ROLES.includes(role)) {
      throw redirect({ to: "/admin-login" });
    }

    return { user, role };
  },
  component: AdminLayout,
});

interface NavItem {
  label: string;
  icon: typeof LayoutDashboard;
  to: string;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, to: "/admin" },
    ],
  },
  {
    title: "Users",
    items: [
      { label: "All Users", icon: Users, to: "/admin/users" },
      { label: "Children", icon: Users, to: "/admin/children" },
      { label: "Teachers", icon: Users, to: "/admin/teachers" },
    ],
  },
  {
    title: "Content",
    items: [
      { label: "Stories", icon: BookOpen, to: "/admin/stories" },
      { label: "Illustrations", icon: Image, to: "/admin/illustrations" },
      { label: "Audio Library", icon: Headphones, to: "/admin/audio" },
      { label: "Vocabulary", icon: Languages, to: "/admin/vocabulary" },
      { label: "Quizzes", icon: HelpCircle, to: "/admin/quizzes" },
    ],
  },
  {
    title: "Moderation",
    items: [
      { label: "Content Moderation", icon: ShieldAlert, to: "/admin/moderation" },
      { label: "Reports", icon: ShieldAlert, to: "/admin/reports" },
    ],
  },
  {
    title: "Business",
    items: [
      { label: "Subscriptions", icon: CreditCard, to: "/admin/subscriptions" },
      { label: "Payments", icon: CreditCard, to: "/admin/payments" },
      { label: "Notifications", icon: Bell, to: "/admin/notifications" },
    ],
  },
  {
    title: "Insights",
    items: [
      { label: "Analytics", icon: BarChart3, to: "/admin/analytics" },
      { label: "AI Usage", icon: Sparkles, to: "/admin/ai-usage" },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Support Center", icon: LifeBuoy, to: "/admin/support" },
      { label: "Audit Logs", icon: ScrollText, to: "/admin/audit-logs" },
      { label: "System Health", icon: Activity, to: "/admin/system-health" },
      { label: "Developer Tools", icon: Wrench, to: "/admin/developer" },
      { label: "Database", icon: Database, to: "/admin/database" },
      { label: "Settings", icon: Settings, to: "/admin/settings" },
    ],
  },
];

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserEmail(user.email ?? "");
        try {
          const roleDoc = await getDoc(doc(db, "user_roles", user.uid));
          if (roleDoc.exists()) setUserRole(roleDoc.data()?.role as string);
        } catch {}
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  async function handleSignOut() {
    await signOut(auth);
    navigate({ to: "/admin-login", replace: true });
  }

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-slate-950">
        <Loader2 className="size-8 animate-spin text-amber-400" />
      </div>
    );
  }

  const isActive = (to: string) => {
    if (to === "/admin") return location.pathname === "/admin" || location.pathname === "/admin/";
    return location.pathname.startsWith(to);
  };

  return (
    <div className="flex min-h-dvh bg-slate-50 dark:bg-slate-950">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r border-slate-200 bg-white transition-transform duration-300 dark:border-slate-800 dark:bg-slate-900 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-slate-200 px-6 dark:border-slate-800">
            <Link to="/admin" className="flex items-center gap-2.5">
              <img src={mascot} alt="" className="h-8 w-8" />
              <div>
                <span className="font-display text-lg font-extrabold text-slate-900 dark:text-white">
                  TeretVerse
                </span>
                <span className="ml-1.5 rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                  Admin
                </span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto px-3 py-4">
            {NAV_SECTIONS.map((section) => (
              <div key={section.title} className="mb-6">
                <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  {section.title}
                </p>
                <ul className="space-y-0.5">
                  {section.items.map((item) => {
                    const active = isActive(item.to);
                    return (
                      <li key={item.to}>
                        <Link
                          to={item.to}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                            active
                              ? "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                          }`}
                        >
                          <item.icon className="size-4 shrink-0" />
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          {/* User card */}
          <div className="border-t border-slate-200 p-3 dark:border-slate-800">
            <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
              <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-sm font-bold text-white">
                {userEmail.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                  {userEmail}
                </p>
                <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                  <ShieldCheck className="size-3" />
                  {userRole || "admin"}
                </p>
              </div>
              <button
                onClick={handleSignOut}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700"
                title="Sign out"
              >
                <LogOut className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:pl-72">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <Menu className="size-5" />
            </button>
            {/* Global search */}
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search users, stories, payments…"
                className="h-9 w-64 rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none transition-colors focus:border-amber-400 focus:ring-1 focus:ring-amber-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
              <Bell className="size-5" />
              <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-rose-500" />
            </button>
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-sm font-bold text-white">
                {userEmail.charAt(0).toUpperCase()}
              </div>
              <ChevronDown className="size-4 text-slate-400" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
