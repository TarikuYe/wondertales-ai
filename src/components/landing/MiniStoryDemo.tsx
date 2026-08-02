import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";

export function MiniStoryDemo() {
  const { t } = useTranslation();

  const ANIMALS_KEYS = ["Elephant", "Fox", "Dolphin", "Owl"] as const;
  const THEMES_KEYS = ["Kindness", "Curiosity", "Bravery"] as const;

  const [name, setName] = useState("");
  const [animalKey, setAnimalKey] = useState<string>(ANIMALS_KEYS[0]);
  const [themeKey, setThemeKey] = useState<string>(THEMES_KEYS[0]);
  const [pages, setPages] = useState<string[] | null>(null);

  function buildStory(name: string, animal: string, theme: string) {
    const hero = name.trim() || "Amara";
    const animalLabel = t(`miniDemo.animals.${animal}`);
    const themeLabel = t(`miniDemo.themes.${theme}`);
    return [
      `Page 1 — On the night the lanterns floated, ${hero} heard a small knock at the window. It was a starlit ${animalLabel.toLowerCase()} with a map made of moonlight.`,
      `Page 2 — "The Sky Library is losing its stories," whispered the ${animalLabel.toLowerCase()}. "Only someone with real ${themeLabel.toLowerCase()} can bring them home."`,
      `Page 3 — Together they sailed over paper mountains, and ${hero} learned that ${themeLabel.toLowerCase()} is simply doing the good, small thing — even when nobody is watching.`,
    ];
  }

  return (
    <div className="grid gap-8 rounded-4xl border border-border bg-card p-6 shadow-lift sm:p-10 lg:grid-cols-2">
      <div>
        <h3 className="text-2xl font-bold">{t('miniDemo.title')}</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {t('miniDemo.desc')}
        </p>

        <div className="mt-6 space-y-5">
          <div>
            <label htmlFor="hero-name" className="text-sm font-semibold">
              {t('miniDemo.childName')}
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
            <legend className="text-sm font-semibold">{t('miniDemo.favoriteAnimal')}</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {ANIMALS_KEYS.map((a) => (
                <button
                  key={a}
                  type="button"
                  aria-pressed={animalKey === a}
                  onClick={() => setAnimalKey(a)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                    animalKey === a
                      ? "border-transparent bg-accent text-accent-foreground"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  {t(`miniDemo.animals.${a}`)}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-semibold">{t('miniDemo.lesson')}</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {THEMES_KEYS.map((th) => (
                <button
                  key={th}
                  type="button"
                  aria-pressed={themeKey === th}
                  onClick={() => setThemeKey(th)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                    themeKey === th
                      ? "border-transparent bg-berry text-berry-foreground"
                      : "border-border bg-background hover:bg-muted"
                  }`}
                >
                  {t(`miniDemo.themes.${th}`)}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="flex flex-wrap gap-3">
            <Button variant="hero" size="pill" onClick={() => setPages(buildStory(name, animalKey, themeKey))}>
              <Sparkles aria-hidden /> {t('miniDemo.weave')}
            </Button>
            {pages && (
              <Button variant="soft" size="pill" onClick={() => setPages(null)}>
                <RotateCcw aria-hidden /> {t('miniDemo.startOver')}
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
              {t('miniDemo.placeholder')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}