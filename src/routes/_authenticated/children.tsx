import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, Pencil, Plus, Trash2, Users } from "lucide-react";

export const Route = createFileRoute("/_authenticated/children")({
  head: () => ({
    meta: [
      { title: "Child profiles — TeretVerse" },
      {
        name: "description",
        content:
          "Add each child's name, age or grade, reading level, language, and interests so TeretVerse tailors every story.",
      },
      { property: "og:title", content: "Child profiles — TeretVerse" },
      {
        property: "og:description",
        content:
          "Add each child's name, age or grade, reading level, language, and interests so TeretVerse tailors every story.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Children,
});

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "am", label: "Amharic" },
  { value: "fr", label: "French" },
  { value: "ar", label: "Arabic" },
  { value: "es", label: "Spanish" },
  { value: "sw", label: "Swahili" },
];

const READING_LEVELS = [
  { value: "pre-reader", label: "Pre-reader (listens along)" },
  { value: "emerging", label: "Emerging reader" },
  { value: "developing", label: "Developing reader" },
  { value: "confident", label: "Confident reader" },
  { value: "advanced", label: "Advanced reader" },
];

const GRADES = [
  "Pre-K",
  "Kindergarten",
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
];

type ChildRow = {
  id: string;
  name: string;
  birth_year: number | null;
  grade_level: string | null;
  reading_level: string;
  preferred_language: string;
  interests: string[];
  notes: string | null;
};

type FormState = {
  name: string;
  age: string;
  grade_level: string;
  reading_level: string;
  preferred_language: string;
  interests: string;
  notes: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  age: "",
  grade_level: "",
  reading_level: "emerging",
  preferred_language: "en",
  interests: "",
  notes: "",
};

const CURRENT_YEAR = new Date().getFullYear();

function ageOf(birthYear: number | null) {
  if (!birthYear) return null;
  return CURRENT_YEAR - birthYear;
}

function languageLabel(code: string) {
  return LANGUAGES.find((l) => l.value === code)?.label ?? code;
}

function readingLabel(value: string) {
  return READING_LEVELS.find((l) => l.value === value)?.label ?? value;
}

function Children() {
  const { user } = useSession();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ChildRow | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const childrenQuery = useQuery({
    queryKey: ["child-profiles", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("child_profiles")
        .select("id,name,birth_year,grade_level,reading_level,preferred_language,interests,notes")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as ChildRow[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("You need to be signed in.");
      const name = form.name.trim();
      if (!name) throw new Error("Please enter the child's name.");
      if (name.length > 60) throw new Error("Name must be under 60 characters.");

      let birth_year: number | null = null;
      if (form.age.trim()) {
        const age = Number(form.age);
        if (!Number.isInteger(age) || age < 2 || age > 17) {
          throw new Error("Age must be a whole number between 2 and 17.");
        }
        birth_year = CURRENT_YEAR - age;
      }

      const payload = {
        name,
        birth_year,
        grade_level: form.grade_level || null,
        reading_level: form.reading_level,
        preferred_language: form.preferred_language,
        interests: form.interests
          .split(",")
          .map((i) => i.trim())
          .filter(Boolean)
          .slice(0, 12),
        notes: form.notes.trim().slice(0, 500) || null,
      };

      if (editing) {
        const { error } = await supabase
          .from("child_profiles")
          .update(payload)
          .eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("child_profiles")
          .insert({ ...payload, owner_id: user.id });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editing ? "Profile updated" : "Child profile added");
      setOpen(false);
      setEditing(null);
      setForm(EMPTY_FORM);
      queryClient.invalidateQueries({ queryKey: ["child-profiles"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("child_profiles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Profile removed");
      queryClient.invalidateQueries({ queryKey: ["child-profiles"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setOpen(true);
  }

  function openEdit(child: ChildRow) {
    setEditing(child);
    setForm({
      name: child.name,
      age: ageOf(child.birth_year)?.toString() ?? "",
      grade_level: child.grade_level ?? "",
      reading_level: child.reading_level,
      preferred_language: child.preferred_language,
      interests: (child.interests ?? []).join(", "),
      notes: child.notes ?? "",
    });
    setOpen(true);
  }

  const rows = childrenQuery.data ?? [];

  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 font-display text-3xl font-extrabold sm:text-4xl">
            <Users className="size-7 text-accent" aria-hidden /> Child profiles
          </h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Each profile shapes story length, vocabulary, language, and themes. Profiles are private
            to your account.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="soft" asChild>
            <Link to="/dashboard">Back</Link>
          </Button>
          <Button variant="hero" size="pill" onClick={openCreate}>
            <Plus className="size-4" aria-hidden /> Add child
          </Button>
        </div>
      </div>

      <div className="mt-8">
        {childrenQuery.isLoading ? (
          <p className="inline-flex items-center gap-2 text-muted-foreground">
            <Loader2 className="size-4 animate-spin" aria-hidden /> Loading profiles…
          </p>
        ) : rows.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="font-display">No children yet</CardTitle>
              <CardDescription>
                Add your first child to start generating stories tuned to their age and reading
                level.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="hero" size="pill" onClick={openCreate}>
                <Plus className="size-4" aria-hidden /> Add child
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            {rows.map((child) => {
              const age = ageOf(child.birth_year);
              return (
                <Card key={child.id}>
                  <CardHeader>
                    <CardTitle className="font-display text-xl">{child.name}</CardTitle>
                    <CardDescription>
                      {[age ? `${age} years old` : null, child.grade_level]
                        .filter(Boolean)
                        .join(" · ") || "Age not set"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{readingLabel(child.reading_level)}</Badge>
                      <Badge variant="outline">{languageLabel(child.preferred_language)}</Badge>
                    </div>
                    {child.interests?.length > 0 && (
                      <p className="text-sm text-muted-foreground">
                        Loves: {child.interests.join(", ")}
                      </p>
                    )}
                    {child.notes && (
                      <p className="text-sm text-muted-foreground">{child.notes}</p>
                    )}
                    <div className="flex gap-2 pt-1">
                      <Button variant="soft" size="sm" onClick={() => openEdit(child)}>
                        <Pencil className="size-4" aria-hidden /> Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm(`Remove ${child.name}'s profile?`)) {
                            deleteMutation.mutate(child.id);
                          }
                        }}
                      >
                        <Trash2 className="size-4" aria-hidden /> Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editing ? `Edit ${editing.name}` : "Add a child"}
            </DialogTitle>
            <DialogDescription>
              Only what you need for better stories — no more than that.
            </DialogDescription>
          </DialogHeader>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              saveMutation.mutate();
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="child-name">First name or nickname</Label>
              <Input
                id="child-name"
                value={form.name}
                maxLength={60}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Lily"
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="child-age">Age</Label>
                <Input
                  id="child-age"
                  type="number"
                  min={2}
                  max={17}
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  placeholder="7"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="child-grade">Grade</Label>
                <Select
                  value={form.grade_level || "none"}
                  onValueChange={(v) => setForm({ ...form, grade_level: v === "none" ? "" : v })}
                >
                  <SelectTrigger id="child-grade">
                    <SelectValue placeholder="Not set" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Not set</SelectItem>
                    {GRADES.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="child-reading">Reading level</Label>
                <Select
                  value={form.reading_level}
                  onValueChange={(v) => setForm({ ...form, reading_level: v })}
                >
                  <SelectTrigger id="child-reading">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {READING_LEVELS.map((l) => (
                      <SelectItem key={l.value} value={l.value}>
                        {l.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="child-language">Story language</Label>
                <Select
                  value={form.preferred_language}
                  onValueChange={(v) => setForm({ ...form, preferred_language: v })}
                >
                  <SelectTrigger id="child-language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((l) => (
                      <SelectItem key={l.value} value={l.value}>
                        {l.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="child-interests">Interests</Label>
              <Input
                id="child-interests"
                value={form.interests}
                maxLength={200}
                onChange={(e) => setForm({ ...form, interests: e.target.value })}
                placeholder="dinosaurs, space, football"
              />
              <p className="text-xs text-muted-foreground">Separate with commas.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="child-notes">Learning notes (optional)</Label>
              <Textarea
                id="child-notes"
                value={form.notes}
                maxLength={500}
                rows={3}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Working on rhyming words; prefers short chapters."
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="hero" disabled={saveMutation.isPending}>
                {saveMutation.isPending && (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                )}
                {editing ? "Save changes" : "Add child"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}