import { createFileRoute } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { MiniStoryDemo } from "@/components/landing/MiniStoryDemo";
import { Starfield } from "@/components/landing/Starfield";
import heroImage from "@/assets/hero-wondertales.jpg";
import mascot from "@/assets/mascot-wisp.png";
import {
  BookOpen,
  Check,
  Headphones,
  Palette,
  ShieldCheck,
  Sparkles,
  Star,
  Wand2,
} from "lucide-react";

const DESCRIPTION =
  "WonderTales AI turns your child into the hero of illustrated, narrated stories that build reading skills — safe, ad-free, and made for ages 3–12.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WonderTales AI — Personalized Story Adventures for Kids" },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: "WonderTales AI — Where Every Child Becomes the Hero" },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const CATEGORIES = [
  { name: "Bedtime", emoji: "🌙" },
  { name: "Adventure", emoji: "🧭" },
  { name: "Animals", emoji: "🦊" },
  { name: "Space", emoji: "🚀" },
  { name: "Ocean", emoji: "🐳" },
  { name: "Dinosaurs", emoji: "🦕" },
  { name: "World Folktales", emoji: "🌍" },
  { name: "STEM", emoji: "🔬" },
  { name: "Kindness", emoji: "💛" },
  { name: "Big Feelings", emoji: "🫧" },
  { name: "Friendship", emoji: "🤝" },
  { name: "Healthy Habits", emoji: "🥕" },
];

const STEPS = [
  {
    icon: Wand2,
    title: "Tell us about your child",
    body: "Name, age, favorite animal, reading level and the lesson you want tonight's story to carry.",
  },
  {
    icon: Palette,
    title: "We illustrate every page",
    body: "One locked character design keeps your hero looking the same from page 1 to page 40.",
  },
  {
    icon: Headphones,
    title: "Press play and read along",
    body: "Expressive narration highlights each word — or use your own recorded voice.",
  },
];

const BENEFITS = [
  { stat: "3×", label: "more words learned when children read a story they star in" },
  { stat: "12–40", label: "age-scaled pages per story, with quizzes and vocabulary" },
  { stat: "0", label: "ads, trackers, or child-to-child chat. Ever." },
];

const STYLES = [
  "Storybook",
  "Watercolor",
  "Soft Cartoon",
  "Paper Cut",
  "3D Cartoon",
  "Fantasy",
  "Animal World",
  "Nature",
];

const VOICES = [
  "Grandmother",
  "Friendly Dad",
  "Young Girl",
  "Wizard",
  "Pirate",
  "Robot",
  "Your own voice",
];

const TESTIMONIALS = [
  {
    quote:
      "My son asks for “the one where I ride the cloud whale” every single night. He's reading words he couldn't touch two months ago.",
    name: "Marta B.",
    role: "Parent of a 6-year-old",
  },
  {
    quote:
      "I assign a story per reading level and get vocabulary reports on Monday morning. It replaced three worksheets.",
    name: "Mr. Okonkwo",
    role: "Grade 2 teacher",
  },
  {
    quote:
      "The narration in my own voice meant bedtime still happened while I was away on tour. That's worth the subscription alone.",
    name: "Daniel R.",
    role: "Parent of twins, age 4",
  },
];

const PLANS = [
  {
    name: "Free",
    price: "$0",
    note: "forever",
    features: ["5 stories a month", "Standard narration", "2 illustration styles", "1 child profile"],
    cta: "Start free",
    variant: "soft" as const,
  },
  {
    name: "Family Premium",
    price: "$12",
    note: "/month",
    features: [
      "Unlimited stories & audiobooks",
      "All premium voices + voice cloning",
      "Offline mode & printable activities",
      "Up to 6 child profiles",
    ],
    cta: "Try 14 days free",
    variant: "hero" as const,
    featured: true,
  },
  {
    name: "Teacher & School",
    price: "Custom",
    note: "per classroom",
    features: [
      "Classrooms & bulk assignment",
      "Curriculum-standard mapping",
      "Progress & vocabulary reports",
      "Classroom-safe mode",
    ],
    cta: "Talk to us",
    variant: "soft" as const,
  },
];

const FAQS = [
  {
    q: "Is it safe for my child?",
    a: "Every story passes a three-stage safety pipeline: prompt filtering before generation, moderation during generation, and a reviewable flag queue before anything reaches a child's device. There is no chat, no advertising, and no third-party tracking in child-facing views.",
  },
  {
    q: "Do children get their own logins?",
    a: "No. Parents and teachers hold the account; children sign in with a PIN or by tapping their avatar on a shared device. Each profile only ever sees its own content.",
  },
  {
    q: "Can my child appear as a character?",
    a: "Yes — as an illustrated character built from the details you provide. We never produce photo-real images of a child.",
  },
  {
    q: "Which languages are supported?",
    a: "English, Amharic, French, Arabic (with full right-to-left support), Spanish and Swahili, switchable in-app at any time.",
  },
  {
    q: "What about accessibility?",
    a: "Dyslexia-friendly font toggle, adjustable text size and line spacing, color-blind-safe palettes, captions on narration, full keyboard navigation, and reduced-motion support.",
  },
];

function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 ${className}`}>
      {children}
    </section>
  );
}

function Index() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur">
        <nav
          aria-label="Main"
          className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-3 sm:px-8"
        >
          <a href="#top" className="flex items-center gap-2 font-display text-lg font-extrabold">
            <img src={mascot} alt="" width={36} height={36} className="h-9 w-9" />
            WonderTales<span className="text-gradient-magic">AI</span>
          </a>
          <div className="hidden items-center gap-7 text-sm font-semibold md:flex">
            <a href="#how" className="hover:text-accent">How it works</a>
            <a href="#library" className="hover:text-accent">Library</a>
            <a href="#pricing" className="hover:text-accent">Pricing</a>
            <a href="#faq" className="hover:text-accent">FAQ</a>
          </div>
          <Button variant="hero" size="pill">Start free</Button>
        </nav>
      </header>

      <main id="top">
        {/* Hero */}
        <div className="relative overflow-hidden bg-gradient-sky">
          <Starfield />
          <Section className="relative grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
            <div className="animate-rise">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                <ShieldCheck className="size-4 text-meadow" aria-hidden /> COPPA & GDPR-K by design
              </span>
              <h1 className="mt-5 text-5xl font-extrabold leading-[1.05] sm:text-6xl">
                Where every child becomes the{" "}
                <span className="text-gradient-magic">hero of their own story</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg text-muted-foreground">
                Personalized, illustrated, narrated adventures for ages 3–12 — with vocabulary,
                quizzes and read-along highlighting woven into every page.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button variant="hero" size="xl">
                  <Sparkles aria-hidden /> Create your first story
                </Button>
                <Button variant="soft" size="xl" asChild>
                  <a href="#demo">
                    <BookOpen aria-hidden /> Try the free demo
                  </a>
                </Button>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                No card required · No ads · Parent-controlled from day one
              </p>
            </div>

            <div className="relative">
              <img
                src={heroImage}
                alt="A child riding a glowing cloud whale through a starry twilight sky"
                width={1920}
                height={1200}
                className="w-full rounded-4xl shadow-lift"
              />
              <img
                src={mascot}
                alt=""
                width={1024}
                height={1024}
                loading="lazy"
                className="absolute -bottom-8 -left-6 hidden h-32 w-32 animate-float sm:block"
              />
            </div>
          </Section>
        </div>

        {/* Benefits strip */}
        <Section className="!py-12">
          <dl className="grid gap-6 sm:grid-cols-3">
            {BENEFITS.map((b) => (
              <div
                key={b.label}
                className="rounded-3xl border border-border bg-card p-6 shadow-soft"
              >
                <dt className="text-4xl font-extrabold text-gradient-magic">{b.stat}</dt>
                <dd className="mt-2 text-sm text-muted-foreground">{b.label}</dd>
              </div>
            ))}
          </dl>
        </Section>

        {/* Demo */}
        <Section id="demo">
          <MiniStoryDemo />
        </Section>

        {/* How it works */}
        <Section id="how">
          <h2 className="text-center text-4xl font-extrabold">Three taps to a bedtime story</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <div
                key={s.title}
                className="rounded-3xl border border-border bg-card p-7 shadow-soft transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-magic text-primary-foreground">
                  <s.icon aria-hidden />
                </div>
                <p className="mt-5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Step {i + 1}
                </p>
                <h3 className="mt-1 text-xl font-bold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Categories */}
        <Section id="library">
          <h2 className="text-4xl font-extrabold">A library that grows with them</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Twenty-plus worlds, from dinosaurs to emotional literacy. Faith and folktale collections
            are opt-in and filterable by parents.
          </p>
          <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {CATEGORIES.map((c) => (
              <li key={c.name}>
                <button className="w-full rounded-3xl border border-border bg-card p-5 text-left shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-accent">
                  <span className="text-3xl" aria-hidden>
                    {c.emoji}
                  </span>
                  <span className="mt-3 block font-bold">{c.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </Section>

        {/* Styles + voices */}
        <Section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-4xl border border-border bg-card p-8 shadow-soft">
            <Palette className="text-berry" aria-hidden />
            <h2 className="mt-4 text-2xl font-bold">Eight illustration styles, one consistent hero</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              A locked visual seed keeps characters and settings identical across every page, with a
              QA pass that catches drift before publishing.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {STYLES.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-4xl border border-border bg-card p-8 shadow-soft">
            <Headphones className="text-lagoon" aria-hidden />
            <h2 className="mt-4 text-2xl font-bold">Narration worth falling asleep to</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Distinct character voices, ambient sound layers, adjustable speed, sleep timer — and
              word-level highlighting that follows along as your child reads.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {VOICES.map((v) => (
                <span
                  key={v}
                  className="rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground"
                >
                  {v}
                </span>
              ))}
            </div>
          </div>
        </Section>

        {/* Testimonials */}
        <Section>
          <h2 className="text-4xl font-extrabold">Loved by parents, trusted by teachers</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="rounded-3xl border border-border bg-card p-7 shadow-soft">
                <div className="flex gap-1 text-primary" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-current" aria-hidden />
                  ))}
                </div>
                <blockquote className="mt-4 text-sm leading-relaxed">{t.quote}</blockquote>
                <figcaption className="mt-5 text-sm font-bold">
                  {t.name}
                  <span className="block font-normal text-muted-foreground">{t.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>

        {/* Pricing */}
        <Section id="pricing">
          <h2 className="text-center text-4xl font-extrabold">Simple, family-sized pricing</h2>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {PLANS.map((p) => (
              <div
                key={p.name}
                className={`rounded-4xl border bg-card p-8 ${
                  p.featured
                    ? "border-accent shadow-lift lg:-translate-y-3"
                    : "border-border shadow-soft"
                }`}
              >
                {p.featured && (
                  <span className="rounded-full bg-gradient-magic px-3 py-1 text-xs font-bold text-primary-foreground">
                    Most loved
                  </span>
                )}
                <h3 className="mt-3 text-xl font-bold">{p.name}</h3>
                <p className="mt-3">
                  <span className="text-4xl font-extrabold">{p.price}</span>{" "}
                  <span className="text-sm text-muted-foreground">{p.note}</span>
                </p>
                <ul className="mt-6 space-y-3 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-meadow" aria-hidden />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button variant={p.variant} size="pill" className="mt-8 w-full">
                  {p.cta}
                </Button>
              </div>
            ))}
          </div>
        </Section>

        {/* Safety */}
        <Section>
          <div className="rounded-4xl bg-gradient-magic p-10 text-primary-foreground shadow-lift">
            <h2 className="text-3xl font-extrabold">Safety isn&apos;t a feature. It&apos;s the foundation.</h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                "No chat or messaging between children",
                "Zero ads and no third-party tracking",
                "Parent approval for exports, sharing and purchases",
                "Every AI generation logged and moderation-reviewable",
              ].map((item) => (
                <li key={item} className="flex gap-2 text-sm font-semibold">
                  <ShieldCheck className="mt-0.5 size-5 shrink-0" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Section>

        {/* FAQ */}
        <Section id="faq" className="max-w-3xl">
          <h2 className="text-4xl font-extrabold">Questions parents ask</h2>
          <Accordion type="single" collapsible className="mt-8">
            {FAQS.map((f) => (
              <AccordionItem key={f.q} value={f.q}>
                <AccordionTrigger className="text-left text-base font-bold">{f.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Section>
      </main>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex items-center gap-2 font-display font-extrabold">
            <img src={mascot} alt="" width={32} height={32} loading="lazy" className="h-8 w-8" />
            WonderTales AI
          </div>
          <p className="text-sm text-muted-foreground">
            Made with care for curious kids · COPPA & GDPR-K aligned · No ads, ever
          </p>
        </div>
      </footer>
    </div>
  );
}
