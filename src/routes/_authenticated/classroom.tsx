import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

export const Route = createFileRoute("/_authenticated/classroom")({
  head: () => ({
    meta: [
      { title: "Classroom — TeretVerse for Teachers" },
      {
        name: "description",
        content: "Teacher-only classroom tools: rosters, reading assignments, and class progress in TeretVerse.",
      },
      { property: "og:title", content: "TeretVerse Classroom" },
      {
        property: "og:description",
        content: "Teacher-only classroom tools: rosters, reading assignments, and class progress in TeretVerse.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  beforeLoad: async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw redirect({ to: "/auth" });
    const { data: isTeacher } = await supabase.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "teacher",
    });
    if (!isTeacher) throw redirect({ to: "/dashboard" });
  },
  component: Classroom,
});

function Classroom() {
  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-2xl">
            <GraduationCap className="size-6 text-accent" aria-hidden /> Classroom
          </CardTitle>
          <CardDescription>
            Only teacher accounts can reach this page. Rosters and class reports land here next.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="soft" asChild>
            <Link to="/dashboard">Back to dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}