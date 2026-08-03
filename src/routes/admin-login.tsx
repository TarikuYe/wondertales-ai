import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { auth, db } from "@/integrations/firebase/client";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Loader as Loader2, Lock, Mail } from "lucide-react";
import mascot from "@/assets/mascot-wisp.png";

export const Route = createFileRoute("/admin-login")({
  head: () => ({
    meta: [
      { title: "Admin Login — TeretVerse" },
      { name: "description", content: "Administrator access portal for TeretVerse." },
    ],
  }),
  component: AdminLoginPage,
});

const ADMIN_ROLES = ['admin', 'super_admin', 'platform_admin', 'content_moderator', 'customer_support', 'finance_manager', 'developer'];

function AdminLoginPage() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show2fa, setShow2fa] = useState(false);
  const [code, setCode] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const roleDoc = await getDoc(doc(db, "user_roles", user.uid));
          if (roleDoc.exists()) {
            const role = roleDoc.data()?.role as string;
            if (ADMIN_ROLES.includes(role)) {
              navigate({ to: "/admin", replace: true });
              return;
            }
          }
          setChecking(false);
        } catch {
          setChecking(false);
        }
      } else {
        setChecking(false);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const roleDoc = await getDoc(doc(db, "user_roles", userCredential.user.uid));
      if (!roleDoc.exists() || !ADMIN_ROLES.includes(roleDoc.data()?.role as string)) {
        toast.error("This account does not have admin access.");
        await auth.signOut();
        setBusy(false);
        return;
      }
      toast.success("Welcome back, Administrator!");
      navigate({ to: "/admin", replace: true });
    } catch (error: any) {
      toast.error(error.message || "Sign in failed");
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setBusy(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const roleDoc = await getDoc(doc(db, "user_roles", result.user.uid));
      if (!roleDoc.exists() || !ADMIN_ROLES.includes(roleDoc.data()?.role as string)) {
        toast.error("This Google account does not have admin access.");
        await auth.signOut();
        setBusy(false);
        return;
      }
      toast.success("Welcome back, Administrator!");
      navigate({ to: "/admin", replace: true });
    } catch (error: any) {
      toast.error("Google sign-in failed.");
      setBusy(false);
    }
  }

  if (checking) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-slate-950">
        <Loader2 className="size-6 animate-spin text-amber-400" />
      </div>
    );
  }

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-slate-950 px-5 py-12">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,191,36,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.06),transparent_50%)]" />

      <div className="relative w-full max-w-md">
        <Link to="/admin" className="mb-6 flex items-center justify-center gap-2.5">
          <img src={mascot} alt="" className="h-10 w-10" />
          <span className="font-display text-xl font-extrabold text-white">TeretVerse</span>
          <span className="rounded-md bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold uppercase text-amber-400">
            Admin
          </span>
        </Link>

        <Card className="border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur">
          <CardHeader className="text-center">
            <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-amber-500/10 ring-1 ring-amber-500/30">
              <ShieldCheck className="size-6 text-amber-400" />
            </div>
            <CardTitle className="font-display text-2xl text-white">Administrator Portal</CardTitle>
            <CardDescription className="text-slate-400">
              Authorized personnel only. All access is logged and monitored.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-slate-700 bg-slate-800/50 pl-9 text-white placeholder:text-slate-500"
                    placeholder="admin@teretverse.com"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-slate-700 bg-slate-800/50 pl-9 text-white placeholder:text-slate-500"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {show2fa && (
                <div className="space-y-2">
                  <Label htmlFor="2fa" className="text-slate-300">Verification Code</Label>
                  <Input
                    id="2fa"
                    type="text"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    className="border-slate-700 bg-slate-800/50 text-center text-lg tracking-widest text-white"
                    placeholder="000000"
                  />
                  <p className="text-xs text-slate-500">Enter the 6-digit code from your authenticator app.</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-bold hover:from-amber-300 hover:to-orange-400"
                disabled={busy}
              >
                {busy ? "Signing in…" : "Sign in to Admin Portal"}
              </Button>
            </form>

            <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wide text-slate-600">
              <span className="h-px flex-1 bg-slate-800" /> or <span className="h-px flex-1 bg-slate-800" />
            </div>
            <Button
              variant="outline"
              className="w-full border-slate-700 bg-slate-800/50 text-white hover:bg-slate-800"
              type="button"
              onClick={handleGoogle}
              disabled={busy}
            >
              Continue with Google
            </Button>

            <div className="mt-6 flex items-start gap-2 rounded-lg bg-slate-800/50 p-3 text-xs text-slate-400">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-amber-400" />
              <p>
                This portal is protected by role-based access control. Unauthorized access attempts
                are logged and may be prosecuted. Session timeout: 30 minutes.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
