import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useSession } from "@/hooks/use-auth";
import { KidsLibrary } from "@/components/profile/KidsLibrary";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
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
  "TeretVerse turns your child into the hero of illustrated, narrated stories that build reading skills — safe, ad-free, and made for ages 3–12.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TeretVerse — Personalized Story Adventures for Kids" },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: "TeretVerse — Where Every Child Becomes the Hero" },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const CATEGORIES = [
  { name: "Bedtime", key: "Bedtime", emoji: "🌙" },
  { name: "Adventure", key: "Adventure", emoji: "🧭" },
  { name: "Animals", key: "Animals", emoji: "🦊" },
  { name: "Space", key: "Space", emoji: "🚀" },
  { name: "Ocean", key: "Ocean", emoji: "🐳" },
  { name: "Dinosaurs", key: "Dinosaurs", emoji: "🦕" },
  { name: "World Folktales", key: "WorldFolktales", emoji: "🌍" },
  { name: "STEM", key: "STEM", emoji: "🔬" },
  { name: "Kindness", key: "Kindness", emoji: "💛" },
  { name: "Big Feelings", key: "BigFeelings", emoji: "🫧" },
  { name: "Friendship", key: "Friendship", emoji: "🤝" },
  { name: "Healthy Habits", key: "HealthyHabits", emoji: "🥕" },
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
  const { session, loading } = useSession();
  const signedIn = !loading && !!session;
  const [activeChildId, setActiveChildId] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    setActiveChildId(localStorage.getItem('activeChildId'));
  }, []);

  if (activeChildId) {
    return <KidsLibrary activeChildId={activeChildId} />;
  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur">
        <nav
          aria-label="Main"
          className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-3 sm:px-8"
        >
          <a href="#top" className="flex items-center gap-2 font-display text-lg font-extrabold">
            <img src={mascot} alt="" width={36} height={36} className="h-9 w-9" />
            TeretVerse
          </a>
          <div className="hidden items-center gap-7 text-sm font-semibold md:flex">
            <a href="#how" className="hover:text-accent">{t('landing.howItWorks')}</a>
            <a href="#library" className="hover:text-accent">{t('landing.library')}</a>
            <a href="#pricing" className="hover:text-accent">{t('landing.pricing')}</a>
            <a href="#faq" className="hover:text-accent">{t('landing.faq')}</a>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            {signedIn ? (
              <Button variant="hero" size="pill" asChild>
                <Link to="/dashboard">My dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="soft" size="pill" asChild className="hidden sm:inline-flex">
                  <Link to="/auth">{t('landing.signIn')}</Link>
                </Button>
                <Button variant="hero" size="pill" asChild>
                  <Link to="/auth">{t('landing.startFree')}</Link>
                </Button>
              </>
            )}
          </div>
        </nav>
      </header>

      <main id="top">
        {/* Hero */}
        <div className="relative overflow-hidden bg-gradient-sky">
          <Starfield />
          <Section className="relative grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
            <div className="animate-rise">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                <ShieldCheck className="size-4 text-meadow" aria-hidden /> {t('landing.coppaBadge')}
              </span>
              <h1 className="mt-5 text-5xl font-extrabold leading-[1.05] sm:text-6xl">
                {t('landing.heroTitle')}
              </h1>
              <p className="mt-5 max-w-xl text-lg text-muted-foreground">
                {t('landing.heroDesc')}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button variant="hero" size="xl" asChild>
                  <Link to="/auth">
                    <Sparkles aria-hidden /> {t('landing.createFirst')}
                  </Link>
                </Button>
                <Button variant="soft" size="xl" asChild>
                  <a href="#demo">
                    <BookOpen aria-hidden /> {t('landing.demoBtn')}
                  </a>
                </Button>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                {t('landing.noCardNote')}
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
            {[
              { stat: "3×", label: t('landing.benefits.b1') },
              { stat: "12–40", label: t('landing.benefits.b2') },
              { stat: "0", label: t('landing.benefits.b3') },
            ].map((b, idx) => (
              <div
                key={idx}
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
          <h2 className="text-center text-4xl font-extrabold">{t('landing.howSection.title')}</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { icon: Wand2, title: t('landing.howSection.s1Title'), body: t('landing.howSection.s1Body') },
              { icon: Palette, title: t('landing.howSection.s2Title'), body: t('landing.howSection.s2Body') },
              { icon: Headphones, title: t('landing.howSection.s3Title'), body: t('landing.howSection.s3Body') },
            ].map((s, i) => (
              <div
                key={i}
                className="rounded-3xl border border-border bg-card p-7 shadow-soft transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-magic text-primary-foreground">
                  <s.icon aria-hidden />
                </div>
                <p className="mt-5 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  {t('landing.howSection.step')} {i + 1}
                </p>
                <h3 className="mt-1 text-xl font-bold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Categories */}
        <Section id="library">
          <h2 className="text-4xl font-extrabold">{t('landing.librarySection.title')}</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            {t('landing.librarySection.desc')}
          </p>
          <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {CATEGORIES.map((c) => (
              <li key={c.name}>
                <button className="w-full rounded-3xl border border-border bg-card p-5 text-left shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-accent">
                  <span className="text-3xl" aria-hidden>
                    {c.emoji}
                  </span>
                  <span className="mt-3 block font-bold">{t(`categories.${c.key}`, { defaultValue: c.name })}</span>
                </button>
              </li>
            ))}
          </ul>
        </Section>

        {/* Styles + voices */}
        <Section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-4xl border border-border bg-card p-8 shadow-soft">
            <Palette className="text-berry" aria-hidden />
            <h2 className="mt-4 text-2xl font-bold">{t('landing.stylesSection.title')}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {t('landing.stylesSection.desc')}
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
            <h2 className="mt-4 text-2xl font-bold">{t('landing.voicesSection.title')}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {t('landing.voicesSection.desc')}
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
          <h2 className="text-4xl font-extrabold">{t('landing.testimonialsSection.title')}</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {(['t1','t2','t3'] as const).map((tk) => (
              <figure key={tk} className="rounded-3xl border border-border bg-card p-7 shadow-soft">
                <div className="flex gap-1 text-primary" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-current" aria-hidden />
                  ))}
                </div>
                <blockquote className="mt-4 text-sm leading-relaxed">{t(`testimonials.${tk}q`)}</blockquote>
                <figcaption className="mt-5 text-sm font-bold">
                  {t(`testimonials.${tk}name`)}
                  <span className="block font-normal text-muted-foreground">{t(`testimonials.${tk}role`)}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>

        {/* Pricing */}
        <Section id="pricing">
          <h2 className="text-center text-4xl font-extrabold">{t('landing.pricingSection.title')}</h2>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {[
              { key: 'free', price: '$0', variant: 'soft' as const },
              { key: 'premium', price: '$12', variant: 'hero' as const, featured: true },
              { key: 'teacher', price: 'Custom', variant: 'soft' as const },
            ].map((p) => (
              <div
                key={p.key}
                className={`rounded-4xl border bg-card p-8 ${
                  p.featured
                    ? "border-accent shadow-lift lg:-translate-y-3"
                    : "border-border shadow-soft"
                }`}
              >
                {p.featured && (
                  <span className="rounded-full bg-gradient-magic px-3 py-1 text-xs font-bold text-primary-foreground">
                    {t(`plans.${p.key}.badge`)}
                  </span>
                )}
                <h3 className="mt-3 text-xl font-bold">{t(`plans.${p.key}.name`)}</h3>
                <p className="mt-3">
                  <span className="text-4xl font-extrabold">{p.price}</span>{" "}
                  <span className="text-sm text-muted-foreground">{t(`plans.${p.key}.note`)}</span>
                </p>
                <ul className="mt-6 space-y-3 text-sm">
                  {['f1','f2','f3','f4'].map((fk) => (
                    <li key={fk} className="flex gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-meadow" aria-hidden />
                      {t(`plans.${p.key}.${fk}`)}
                    </li>
                  ))}
                </ul>
                <Button variant={p.variant} size="pill" className="mt-8 w-full">
                  {t(`plans.${p.key}.cta`)}
                </Button>
              </div>
            ))}
          </div>
        </Section>

        {/* Safety */}
        <Section>
          <div className="rounded-4xl bg-gradient-magic p-10 text-primary-foreground shadow-lift">
            <h2 className="text-3xl font-extrabold">{t('landing.safetySection.title')}</h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                t('landing.safetySection.item1'),
                t('landing.safetySection.item2'),
                t('landing.safetySection.item3'),
                t('landing.safetySection.item4'),
              ].map((item, idx) => (
                <li key={idx} className="flex gap-2 text-sm font-semibold">
                  <ShieldCheck className="mt-0.5 size-5 shrink-0" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Section>

        {/* FAQ */}
        <Section id="faq" className="max-w-3xl">
          <h2 className="text-4xl font-extrabold">{t('landing.faqSection.title')}</h2>
          <Accordion type="single" collapsible className="mt-8">
            {(['1','2','3','4','5'] as const).map((n) => (
              <AccordionItem key={n} value={n}>
                <AccordionTrigger className="text-left text-base font-bold">{t(`faqs.q${n}`)}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{t(`faqs.a${n}`)}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Section>
      </main>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex items-center gap-2 font-display font-extrabold">
            <img src={mascot} alt="" width={32} height={32} loading="lazy" className="h-8 w-8" />
            TeretVerse
          </div>
          <p className="text-sm text-muted-foreground">
            {t('landing.footer.tagline')}
          </p>
        </div>
      </footer>
    </div>
  );
}
