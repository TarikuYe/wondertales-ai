import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, RotateCcw } from "lucide-react";

const ANIMALS = ["Elephant", "Fox", "Dolphin", "Owl"] as const;
const THEMES = ["Kindness", "Curiosity", "Bravery"] as const;

function buildStory(name: string, animal: string, theme: string) {
  const hero = name.trim() || "Amara";
  return [
    `Page 1 — On the night the lanterns floated, ${hero} heard a small knock at the window. It was a starlit ${animal.toLowerCase()} with a map made of moonlight.`,
    `Page 2 — "The Sky Library is losing its stories," whispered the ${animal.toLowerCase()}. "Only someone with real ${theme.toLowerCase()} can bring them home."`,
    `Page 3 — Together they sailed over paper mountains, and ${hero} learned that ${theme.toLowerCase()} is simply doing the good, small thing — even when nobody is watching.`,
  ];
}

export function MiniStoryDemo() {
  const [name, setName] = useState("");
  const [animal, setAnimal] = useState<string>(ANIMALS[0]);
  const [theme, setTheme] = useState<string>(THEMES[0]);
  const [pages, setPages] = useState<string[] | null>(null);

  return (
    <div className="grid gap-8 rounded-4xl border border-border bg-card p-6 shadow-lift sm:p-10 lg:grid-cols-2">
      <div>
        <h3 className="text-2xl font-bold">Try a mini-story — no signup</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Three little choices, one instant tale. The full platform writes 12–40 illustrated,
          narrated pages.
        </p>

        <div className="mt-6 space-y-5">
          <div>
            <label htmlFor="hero-name" className="text-sm font-semibold">
              Child&apos;s first name
            </label>
            <input
              id="hero-name"
              value={name}
              maxLength={24}
              onChange={(e) => setName(e.target.value)}
              placeholder="Amara"
              className="mt-2 h-12 w-full rounded-2xl border border-input bg-background px-4 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <fieldset>
            <legend className="text-sm font-semibold">Favorite animal</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {ANIMALS.map((a) => (
                <button
                  key={a}
                  type="button"
                  aria-pressed={animal === a}
                  onClick={() => setAnimal(a)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                    animal === a
                      ? "border-transparent bg-accent text-accent-foreground"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-semibold">Lesson</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {THEMES.map((t) => (
                <button
                  key={t}
                  type="button"
                  aria-pressed={theme === t}
                  onClick={() => setTheme(t)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                    theme === t
                      ? "border-transparent bg-berry text-berry-foreground"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="flex flex-wrap gap-3">
            <Button variant="hero" size="pill" onClick={() => setPages(buildStory(name, animal, theme))}>
              <Sparkles aria-hidden /> Weave my story
            </Button>
            {pages && (
              <Button variant="soft" size="pill" onClick={() => setPages(null)}>
                <RotateCcw aria-hidden /> Start over
              </Button>
            )}
          </div>
        </div>
      </div>

      <div
        aria-live="polite"
        className="rounded-3xl bg-gradient-sky p-6 ring-1 ring-border sm:p-8"
      >
        {pages ? (
          <ol className="space-y-4">
            {pages.map((p, i) => (
              <li
                key={i}
                className="animate-rise rounded-2xl bg-card p-4 text-sm leading-relaxed shadow-soft"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                {p}
              </li>
            ))}
          </ol>
        ) : (
          <div className="flex h-full min-h-56 flex-col items-center justify-center text-center">
            <span className="text-5xl animate-float" aria-hidden>
              📖
            </span>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Your story appears here — safe, age-tuned, and ready to be read aloud.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}