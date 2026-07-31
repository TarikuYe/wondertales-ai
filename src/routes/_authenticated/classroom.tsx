import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { auth, db } from "@/integrations/firebase/client";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
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
    const user = await new Promise<any>((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (u) => {
        unsubscribe();
        resolve(u);
      });
    });
    
    if (!user) throw redirect({ to: "/auth" });
    
    const rolesQuery = query(collection(db, "user_roles"), where("user_id", "==", user.uid), where("role", "==", "teacher"));
    const rolesSnapshot = await getDocs(rolesQuery);
    const isTeacher = !rolesSnapshot.empty;
    
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