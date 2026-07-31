import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Home, Loader2, ShieldCheck } from "lucide-react";
import mascot from "@/assets/mascot-wisp.png";

const DESCRIPTION =
  "Create a TeretVerse parent or teacher account to build safe, personalized story adventures for the children in your care.";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in or sign up — TeretVerse for Parents & Teachers" },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: "TeretVerse — Parent & Teacher Accounts" },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

type Role = "parent" | "teacher";

function RoleToggle({ value, onChange }: { value: Role; onChange: (r: Role) => void }) {
  const options: { role: Role; label: string; hint: string; icon: typeof Home }[] = [
    { role: "parent", label: "Parent", hint: "For my family", icon: Home },
    { role: "teacher", label: "Teacher", hint: "For my classroom", icon: GraduationCap },
  ];
  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((o) => {
        const Icon = o.icon;
        const active = value === o.role;
        return (
          <button
            key={o.role}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.role)}
            className={`rounded-2xl border-2 p-4 text-left transition ${
              active
                ? "border-accent bg-accent/10 shadow-lift"
                : "border-border bg-card hover:border-accent/50"
            }`}
          >
            <Icon className="mb-2 size-5 text-accent" aria-hidden />
            <span className="block font-display text-base font-bold">{o.label}</span>
            <span className="block text-xs text-muted-foreground">{o.hint}</span>
          </button>
        );
      })}
    </div>
  );
}

function AuthPage() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [busy, setBusy] = useState(false);
  const [role, setRole] = useState<Role>("parent");
  const [fullName, setFullName] = useState("");
  const [organization, setOrganization] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pendingConfirm, setPendingConfirm] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate({ to: "/dashboard", replace: true });
      } else {
        setChecking(false);
      }
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate({ to: "/dashboard", replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: {
          role,
          full_name: fullName,
          organization: role === "teacher" ? organization : "",
        },
      },
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (!data.session) {
      setPendingConfirm(true);
      toast.success("Check your email to confirm your account.");
    }
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) toast.error(error.message);
  }

  async function handleGoogle() {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setBusy(false);
      toast.error("Google sign-in failed. Please try again.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/dashboard", replace: true });
  }

  if (checking) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-gradient-sky">
        <Loader2 className="size-6 animate-spin text-accent" aria-label="Loading" />
      </div>
    );
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-gradient-sky px-5 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2 font-display text-xl font-extrabold">
          <img src={mascot} alt="" width={40} height={40} className="h-10 w-10" />
          TeretVerse
        </Link>

        <Card className="shadow-lift">
          <CardHeader>
            <CardTitle className="font-display text-2xl">Grown-ups only</CardTitle>
            <CardDescription>
              Parents and teachers create the account — children read inside it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingConfirm ? (
              <div className="space-y-4 text-sm">
                <p className="font-semibold">Almost there!</p>
                <p className="text-muted-foreground">
                  We sent a confirmation link to <strong>{email}</strong>. Click it to activate your{" "}
                  {role} account, then come back and sign in.
                </p>
                <Button variant="soft" onClick={() => setPendingConfirm(false)}>
                  Back to sign in
                </Button>
              </div>
            ) : (
              <Tabs defaultValue="signup">
                <TabsList className="mb-5 grid w-full grid-cols-2">
                  <TabsTrigger value="signup">Sign up</TabsTrigger>
                  <TabsTrigger value="signin">Sign in</TabsTrigger>
                </TabsList>

                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label>I am a…</Label>
                      <RoleToggle value={role} onChange={setRole} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Full name</Label>
                      <Input
                        id="name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Amina Bekele"
                        required
                      />
                    </div>
                    {role === "teacher" && (
                      <div className="space-y-2">
                        <Label htmlFor="org">School or organization</Label>
                        <Input
                          id="org"
                          value={organization}
                          onChange={(e) => setOrganization(e.target.value)}
                          placeholder="Sunrise Primary School"
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        autoComplete="new-password"
                        minLength={8}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" variant="hero" className="w-full" disabled={busy}>
                      {busy ? "Creating account…" : `Create ${role} account`}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signin">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-in">Email</Label>
                      <Input
                        id="email-in"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-in">Password</Label>
                      <Input
                        id="password-in"
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" variant="hero" className="w-full" disabled={busy}>
                      {busy ? "Signing in…" : "Sign in"}
                    </Button>
                  </form>
                </TabsContent>

                <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground">
                  <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
                </div>
                <Button variant="soft" className="w-full" onClick={handleGoogle} disabled={busy}>
                  Continue with Google
                </Button>
                <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-meadow" aria-hidden />
                  Adult accounts only. We never collect data directly from children — COPPA & GDPR-K by design.
                </p>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}