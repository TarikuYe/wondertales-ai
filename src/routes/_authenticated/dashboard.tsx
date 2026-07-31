import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useRoles, useSession } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, GraduationCap, Home, Loader2, Users } from "lucide-react";
import mascot from "@/assets/mascot-wisp.png";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Your dashboard — TeretVerse" },
      {
        name: "description",
        content: "Manage child profiles, reading progress, and story settings in your TeretVerse account.",
      },
      { property: "og:title", content: "Your TeretVerse dashboard" },
      {
        property: "og:description",
        content: "Manage child profiles, reading progress, and story settings in your TeretVerse account.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useSession();
  const { roles, loading, hasRole } = useRoles(user);
  const [fullName, setFullName] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => setFullName(data?.full_name ?? null));
  }, [user]);

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const isTeacher = hasRole("teacher");

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-3 sm:px-8">
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-extrabold">
            <img src={mascot} alt="" width={32} height={32} className="h-8 w-8" />
            TeretVerse
          </Link>
          <Button variant="soft" size="sm" onClick={handleSignOut}>
            Sign out
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8">
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl">
          Welcome{fullName ? `, ${fullName}` : ""}!
        </h1>
        <p className="mt-2 text-muted-foreground">
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" aria-hidden /> Loading your account…
            </span>
          ) : (
            <>
              Signed in as <strong>{user?.email}</strong> ·{" "}
              <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-0.5 text-xs font-bold uppercase tracking-wide text-accent">
                {isTeacher ? <GraduationCap className="size-3.5" aria-hidden /> : <Home className="size-3.5" aria-hidden />}
                {roles[0] ?? "parent"}
              </span>
            </>
          )}
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display">
                <Users className="size-5 text-accent" aria-hidden /> Child profiles
              </CardTitle>
              <CardDescription>Set ages, reading levels, and languages for each child.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">Coming next.</CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display">
                <BookOpen className="size-5 text-accent" aria-hidden /> Story library
              </CardTitle>
              <CardDescription>Every story you create, saved and re-readable.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">Coming next.</CardContent>
          </Card>

          {isTeacher && (
            <Card className="sm:col-span-2 border-accent/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-display">
                  <GraduationCap className="size-5 text-accent" aria-hidden /> Teacher tools
                </CardTitle>
                <CardDescription>
                  Classroom rosters, group assignments, and progress reports — visible to teacher accounts only.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="hero" size="pill" asChild>
                  <Link to="/classroom">Open classroom</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}