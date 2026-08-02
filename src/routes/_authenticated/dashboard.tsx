import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { auth, db } from "@/integrations/firebase/client";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRoles, useSession } from "@/hooks/use-auth";
import { getStories } from "@/lib/stories";
import type { Story } from "@/types/story";
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

  const { data: stories, isLoading: isLoadingStories } = useQuery({
    queryKey: ["stories", user?.uid],
    queryFn: () => getStories(),
    enabled: !!user,
  });

  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, "profiles", user.uid)).then((docSnap) => {
      if (docSnap.exists()) {
        setFullName(docSnap.data().full_name ?? null);
      }
    });
  }, [user]);

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await signOut(auth);
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

        {/* Parent Analytics Summary */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border shadow-soft bg-indigo-50/50">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs uppercase font-bold tracking-wider text-indigo-800">Total Books Created</CardDescription>
              <CardTitle className="text-3xl font-extrabold flex items-center gap-2 text-indigo-950">
                <BookOpen className="size-7 text-indigo-600" />
                {stories?.length || 0}
              </CardTitle>
            </CardHeader>
          </Card>
          
          <Card className="border-border shadow-soft bg-emerald-50/50">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs uppercase font-bold tracking-wider text-emerald-800">Vocab Words Unlocked</CardDescription>
              <CardTitle className="text-3xl font-extrabold flex items-center gap-2 text-emerald-950">
                <GraduationCap className="size-7 text-emerald-600" />
                {stories?.reduce((acc, story) => acc + (story.vocabularyWords?.length || 0), 0) || 0}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display">
                <Users className="size-5 text-accent" aria-hidden /> Child profiles
              </CardTitle>
              <CardDescription>Set ages, reading levels, and languages for each child.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="soft" size="sm" asChild>
                <Link to="/children">Manage child profiles</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display">
                <BookOpen className="size-5 text-accent" aria-hidden /> Vocabulary Vault
              </CardTitle>
              <CardDescription>View all magic words unlocked across generated stories.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="soft" size="sm" asChild>
                <Link to="/vocabulary">Open Vocab Vault</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 font-display">
                  <BookOpen className="size-5 text-accent" aria-hidden /> Story library
                </CardTitle>
                <CardDescription>Every story you create, saved and re-readable.</CardDescription>
              </div>
              <Button variant="hero" size="sm" asChild>
                <Link to="/create-story">
                  <BookOpen className="mr-2 size-4" aria-hidden /> Create
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {isLoadingStories ? (
                <div className="flex justify-center py-4 text-muted-foreground"><Loader2 className="animate-spin size-6" /></div>
              ) : stories && stories.length > 0 ? (
                <ul className="space-y-3 mt-2">
                  {stories.map((story: Story) => (
                    <li key={story.id} className="flex justify-between items-center rounded-lg border bg-card p-3 shadow-sm">
                      <div>
                        <h4 className="font-bold">{story.title}</h4>
                        <p className="text-xs text-muted-foreground">For child ID: {story.childId} • {new Date(story.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-secondary text-secondary-foreground uppercase">
                        {story.status}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-sm text-muted-foreground text-center py-8 bg-secondary/20 rounded-xl mt-2">
                  No stories yet. Create your first magic adventure!
                </div>
              )}
            </CardContent>
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