# WonderTales AI

WonderTales AI — Master Product & Engineering Prompt

A premium, production-grade prompt for briefing an AI (ChatGPT, Claude, etc.) to design and build a world-class children's AI storytelling platform.

ROLE

Act as a cross-functional senior team consisting of:

Senior Product Manager — product strategy, roadmap, monetization

Senior UI/UX Designer — visual system, motion, accessibility

Senior Frontend Engineer — Next.js/React architecture

Senior Backend Engineer — API, database, infrastructure

AI/ML Engineer — generation pipelines (text, image, voice)

Child Education Specialist — curriculum alignment, literacy pedagogy

Child Psychologist — emotional safety, age-appropriate content design

Illustrator / Art Director — visual style consistency

Software Architect — system design, scalability, security

Work through this brief holistically and produce a cohesive, implementation-ready plan — not disconnected fragments.

MISSION

Design and build WonderTales AI — an interactive, AI-powered children's storytelling and literacy platform.

Tagline: "Where Every Child Becomes the Hero of Their Own Story."

This is not a simple story generator. It's a premium, subscription-grade educational entertainment product that blends personalized AI storytelling, illustration, narration, and structured learning into a single delightful experience — comparable in polish to Disney+, Netflix Kids, Duolingo, Khan Academy Kids, and Epic!, while introducing a distinct, ownable identity of its own.

The final product must be visually stunning, emotionally safe, accessible, responsive, and genuinely production-ready — not a demo.

1. TARGET USERS

Primary: Children, ages 3–12 Secondary: Parents, teachers, schools, libraries

2. DESIGN PHILOSOPHY

The platform should feel magical, warm, and trustworthy — playful without being childish, premium without being cold.

Visual language:

Soft gradients, rounded geometry, generous whitespace

Custom illustration style with a signature mascot/guide character

Layered parallax scenes: floating clouds, drifting stars, gentle particles

Smooth, purposeful micro-interactions (Framer Motion) — never gratuitous

Full Light and Dark Mode support, plus a dedicated "Night Reading" theme for bedtime use

Distinct visual modes for Child View (large, simple, icon-driven) vs. Parent/Teacher View (dense, data-rich dashboards)

3. TECH STACK

Frontend

Next.js 15 (App Router), React 19, TypeScript

Tailwind CSS, shadcn/ui, Framer Motion

React Hook Form + Zod for validation

Zustand for client state, TanStack Query for server state

Backend

Next.js Server Actions (primary) with optional FastAPI microservice for heavy AI orchestration (image/audio generation queues)

Database & Infra

Supabase: PostgreSQL, Auth, Storage, Row Level Security, Realtime, Edge Functions

Redis (via Upstash) for rate limiting, caching, and generation-job queues

Object storage (Supabase Storage / S3-compatible) for illustrations, audio, and exported PDFs

AI Layer

LLM for story text and quizzes (Claude/GPT-class model)

Image generation model with character-consistency (seed/reference-image locking) for illustration continuity across pages

Text-to-speech with expressive, multi-voice narration and word-level timestamp data for read-along highlighting

4. AUTHENTICATION & ACCOUNTS

Parent Account and Teacher Account only — children never create independent, standalone logins

Parents create and manage child profiles under their account (COPPA/GDPR-K style consent model)

Login via Google, Email, and GitHub (teacher/admin use); password reset; email verification

Child sign-in via simple PIN or avatar-tap on a shared family device — no email/password required for the child

Session scoping: a child profile only ever sees its own content; parents can switch between child profiles

5. CHILD PROFILES

Each profile tracks:

Name · Age · Avatar · Favorite Color · Favorite Animal · Favorite Character · Reading Level · Preferred Language · Learning Goals · Completed Stories · Achievements · Reading Time · Current Streak · Content Sensitivity Settings (e.g., avoid scary themes) · Curriculum Tags (if linked to a teacher's class)

6. HOME PAGE

A landing page designed to convert and delight, with sections for:

Hero · Story Categories · Interactive Demo (try a mini-story free, no signup) · How It Works · Personalized Stories Showcase · Illustration Style Gallery · Audio Narration Sample Player · Learning Benefits (backed by literacy research) · Parent/Teacher Testimonials · Pricing · FAQ · Trust & Safety Badges (COPPA/GDPR-K compliance, no-ads guarantee) · Footer

All sections animated on scroll with restrained, purposeful motion.

7. STORY GENERATOR

Parent/Teacher configures: Age · Story Length · Genre · Lesson/Moral · Characters · Theme · Language · Narration Voice · Illustration Style · Emotional Tone (calming vs. exciting) · Curriculum Standard (optional, for teachers)

AI generates: Title · Cover Art · 12–40 Pages (age-scaled length) · Full Illustrations with consistent characters · Narration Audio · Sound Effects & Ambient Music · Character Voices · Post-Story Learning Questions · Printable Coloring Pages · Vocabulary List · A short "Plot Twist" or "Choose What Happens Next" branch point for co-reading engagement

AI safety pipeline (critical): every generation passes through pre-generation prompt filtering, in-generation content moderation, and pre-publish human-reviewable moderation flags before a story reaches a child's device.

8. STORY CATEGORIES

Bedtime · Adventure · Animals · Fantasy · Science · History · Space · Ocean · Dinosaurs · Princesses & Heroes · Friendship · Family · Kindness · Respect · Responsibility · African Folktales · World Folktales & Mythology · Bible & Faith Stories (opt-in, filterable by parent) · STEM Stories · Environmental Stories · Healthy Habits · Emotional Literacy (managing big feelings, empathy) · Social Skills & Neurodiversity-Affirming Stories

9. PERSONALIZED "HERO" STORIES

Parents provide: Child Name · Favorite Animal · Favorite Color · Best Friend · Favorite Food · Dream Job · Favorite Toy · Optional photo-based avatar illustration (child appears as an illustrated character, not a photo-real image, for safety and consistency)

The AI weaves these into a fully personalized adventure starring the child.

10. ILLUSTRATION SYSTEM

Styles: Storybook · Watercolor · Soft Cartoon · Paper Cut · 3D Cartoon · Fantasy · Animal World · Nature

Requirement: strict character and setting consistency across all pages of a single story (locked visual seed/reference), with a QA pass to catch drift.

11. AUDIOBOOKS & NARRATION

Every page includes: Professional-grade narration · Distinct character voices · Background music · Ambient/nature sound layers · Word-level read-along highlighting · Adjustable playback speed · Offline/downloaded mode for travel and low-connectivity use

Voice roster: Grandmother · Grandfather · Friendly Mom · Friendly Dad · Young Girl · Young Boy · Princess · Wizard · Pirate · Robot · Animal Voices · (Premium) Parent Voice Cloning — a parent can record their own voice once and have it narrate any story, enabling bedtime stories even when traveling or working late

12. READING MODE

Read Aloud · Auto Page Turn · Highlight Spoken Words · Tap-Any-Word Lookup · Pronunciation Playback · Built-in Dictionary · Bookmarks · Night Mode · Sleep Timer (auto-pause/fade-out) · "Choose Your Own Adventure" branching navigation where supported

13. VOCABULARY BUILDER

Tapping any word surfaces: Meaning (age-appropriate definition) · Pronunciation audio · Illustrative picture · Example sentence · Simple synonyms · Auto-added to the child's personal Word Bank for spaced-repetition review

14. LEARNING ACTIVITIES

Generated per story: Quiz · Matching Game · Memory Game · Puzzle · Word Search · Coloring Book (printable) · Maze · Drawing Prompt · Story Retelling Activity (child narrates the story back, transcribed for parents to see comprehension)

15. ACHIEVEMENTS & GAMIFICATION

Reading Streaks · Explorer Badge · Vocabulary Master · Story Hero · Creative Thinker · Science Explorer · Animal Expert · Magic Reader · Kindness Collector · Curiosity Cabinet (a visual trophy shelf/collection screen, not a competitive leaderboard — avoids unhealthy comparison between children)

16. PARENT DASHBOARD

Reading Time · Favorite Stories · Words Learned · Quiz Scores · Reading Progress · Monthly Reports · Screen Time controls & limits · Personalized Recommendations · Downloadable Progress PDF · Content Controls (theme filters, scary-content toggle, language settings)

17. TEACHER DASHBOARD

Create Classes · Assign Stories (mapped to curriculum standards) · Track Progress per student · Reading Analytics · Export Reports · Vocabulary Reports · Student Achievements · Bulk-assign by reading level · Classroom-safe mode (no personalization fields requiring student photos/personal data)

18. SEARCH & DISCOVERY

Search across Stories · Topics · Animals · Characters · Lessons · Reading Level · "Surprise Me" randomizer for children · Continue-a-favorite series recommendations

19. AI FEATURE SET

Story Generator · Story Continuation · Character Generator · Lesson Generator · Vocabulary Generator · Quiz Generator · Coloring Book Generator · Illustration Generator · Story Translator · AI Reading Coach (listens to a child read aloud and gives gentle feedback) · AI Pronunciation Assistant · AI Story Summarizer (for parents short on time) · AI Content Moderator (safety layer, described in Section 7)

20. VISUAL MOTION LIBRARY

Floating Clouds · Flying Birds · Sparkles · Butterflies · Swaying Trees · Falling Leaves · Animated Stars · Interactive Button States · Page-Flip Transitions · Reduced-motion mode respecting prefers-reduced-motion

21. ACCESSIBILITY

Large touch targets and fonts · Color-blind-safe palettes · Full keyboard navigation · Screen reader support (ARIA-complete) · Closed captions on narration · Audio descriptions for illustrations · Dyslexia-friendly font toggle · Adjustable line spacing and text size

22. LOCALIZATION

English · Amharic · French · Arabic · Spanish · Swahili, with seamless in-app language switching and RTL support for Arabic.

23. SUBSCRIPTION TIERS

Free — 5 stories/month, basic narration, limited illustration styles Premium (Family) — unlimited stories & audiobooks, premium voices, offline mode, voice cloning, advanced quizzes Teacher/School — multiple classrooms, progress reporting, assignment tools, bulk licensing

24. ADMIN PANEL

Manage Users, Parents, Teachers, Stories, Illustrations, Audio, Subscriptions, Analytics, Reports, Content Moderation Queue, AI Usage & Cost Monitoring

25. CHILD SAFETY & SECURITY (non-negotiable)

No public chat or messaging between children

Zero advertising or third-party tracking in child-facing views

Parent approval required for any sensitive action (data export, external sharing, purchases)

Secure auth, rate limiting, input validation, Row Level Security on every table

Full audit logs of AI generations and moderation decisions

Design for COPPA (US) and GDPR-K (EU) compliance from day one

26. DATABASE SCHEMA (PostgreSQL / Supabase)

Design complete schemas (with UUIDs, indexes, foreign keys, and RLS policies) for:

users · parents · teachers · children · stories · story_pages · illustrations · audio · voices · quizzes · vocabulary · achievements · subscriptions · payments · progress · reading_sessions · favorites · bookmarks · notifications · activity_logs · analytics · settings · moderation_flags · classrooms · assignments

27. PERFORMANCE & SEO

Lazy loading · Image optimization (next/image + CDN) · Audio streaming (chunked/adaptive) · Infinite scroll for libraries · React Server Components by default · Aggressive caching strategy · CDN-ready static assets · SEO-optimized public pages (landing, category, blog)

28. DEPLOYMENT

Vercel (frontend) · Supabase (data/auth/storage) · Cloudflare (CDN/DNS/DDoS protection) — fully production-ready, with staging and production environments, CI/CD, and rollback strategy.

FINAL DELIVERABLE REQUIREMENTS

Treat this as a premium SaaS product, not a demo. Specifically produce:

Complete folder/project structure

Full database schema with RLS policies

Core UI component library (with states, variants, and accessibility notes)

API routes / server actions with input validation

Supabase integration plan (auth, storage, realtime)

Authentication flows (parent, teacher, child sign-in)

AI generation pipeline architecture (text → illustration → audio → moderation)

Testing strategy (unit, integration, E2E, and content-safety testing)

Deployment guide

Documentation (architecture decisions, coding standards, contribution guide)

The end result should be a world-class AI storytelling platform that parents trust, children love, and schools are excited to adopt.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/8deb0b70-2c5f-4657-84a0-65b844af7054).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
