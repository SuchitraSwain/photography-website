# Phase 1 Photography Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a production-looking ATELIER photography portfolio (marketing pages + Sanity CMS gallery/events/about/services) that builds and deploys without requiring live API secrets on day one.

**Architecture:** Next.js App Router Server Components fetch content through a thin `lib/sanity` layer that falls back to typed mock data when Sanity env vars are missing. Embedded Sanity Studio lives at `/studio`. Editorial-noir UI uses Tailwind tokens + restyled shadcn, Framer Motion for gallery/lightbox, GSAP ScrollTrigger for scroll reveals. Booking/contact are form shells with Phase-2 field shapes; submit is disabled with honest copy.

**Tech Stack:** Next.js 15 (App Router), TypeScript strict, Tailwind CSS v4 or v3 (match `create-next-app` default), shadcn/ui, next-themes, Framer Motion, GSAP + ScrollTrigger, next-sanity, Sanity Studio v3, Vitest, Vercel.

## Global Constraints

- Brand placeholder: `ATELIER` (overridable via `siteSettings.brandName`)
- Visual: editorial noir — background `#0A0A0A`, text `#F2F0EB`, warm silver accent; light mode invert
- Fonts: Cormorant Garamond (display) + Geist Sans (UI/body)
- Categories: Weddings, Portraits, Events, Editorial
- No hardcoded API secrets; builds must succeed without Sanity credentials (mock fallback)
- Phase 1 out of scope: NextAuth, Google Calendar, Prisma, Resend, Cloudinary, admin booking workflow
- Respect `prefers-reduced-motion`; semantic HTML + alt text + keyboard lightbox
- Prefer smaller focused files; one responsibility per module
- Commit after each task

---

## File structure (create unless noted)

```
app/
  layout.tsx                          # Root layout: fonts, ThemeProvider, Header, Footer
  page.tsx                            # Home
  globals.css                         # CSS variables + base
  gallery/page.tsx
  events/page.tsx
  about/page.tsx
  services/page.tsx
  booking/page.tsx
  contact/page.tsx
  studio/[[...tool]]/page.tsx         # Sanity Studio
  sitemap.ts
  robots.ts
  api/revalidate/route.ts             # Optional Sanity webhook revalidation
components/
  layout/site-header.tsx
  layout/site-footer.tsx
  theme/theme-provider.tsx
  theme/theme-toggle.tsx
  home/hero.tsx
  home/intro-section.tsx
  home/featured-strip.tsx
  gallery/gallery-view.tsx            # Client: filters + masonry + lightbox state
  gallery/gallery-filters.tsx
  gallery/gallery-masonry.tsx
  gallery/lightbox.tsx
  events/event-card.tsx
  events/add-to-calendar-button.tsx
  about/about-view.tsx
  services/package-card.tsx
  booking/booking-form.tsx
  contact/contact-form.tsx
  motion/reveal-on-scroll.tsx
  seo/json-ld.tsx
  ui/…                                # shadcn primitives
lib/
  types/content.ts                    # Shared domain types
  mock/content.ts                     # Seed/mock content
  sanity/env.ts                       # Reads env; `isSanityConfigured()`
  sanity/client.ts
  sanity/image.ts                     # urlFor helper
  sanity/queries.ts                   # GROQ strings
  sanity/fetch.ts                     # Typed fetchers with mock fallback
  ics.ts                              # Build .ics file contents
  utils.ts                            # cn()
sanity/
  schemaTypes/
    index.ts
    siteSettings.ts
    category.ts
    galleryImage.ts
    event.ts
    servicePackage.ts
    pageAbout.ts
  structure.ts
  sanity.config.ts                    # imported by app/studio
tests/
  lib/sanity-fetch.test.ts
  lib/ics.test.ts
  lib/env.test.ts
.env.example
README.md
vitest.config.ts
```

---

### Task 1: Scaffold Next.js app + Vitest + base tooling

**Files:**
- Create: entire Next.js app via CLI (paths above become real)
- Create: `vitest.config.ts`, `tests/setup.ts`, `.env.example`, `README.md`
- Modify: `tsconfig.json` (`strict: true`), `package.json` scripts

**Interfaces:**
- Consumes: none
- Produces: runnable `npm run dev`, `npm test`, TypeScript strict project

- [ ] **Step 1: Scaffold the app**

Run from repo root (`photography-website`). If the directory is not empty (docs already exist), scaffold into a temp folder and move app files up, keeping `docs/` and `.git`.

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --turbopack --yes
```

If create-next-app refuses non-empty dir:

```bash
npx create-next-app@latest web-tmp --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --turbopack --yes
mv web-tmp/* web-tmp/.* . 2>/dev/null; rmdir web-tmp
```

- [ ] **Step 2: Enable strict TypeScript**

In `tsconfig.json`, ensure:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true
  }
}
```

- [ ] **Step 3: Add Vitest**

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
```

Create `tests/setup.ts`:

```ts
import { expect } from "vitest";
```

Add scripts to `package.json`:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

- [ ] **Step 4: Write `.env.example` and README stub**

`.env.example`:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01
SANITY_API_READ_TOKEN=
SANITY_REVALIDATE_SECRET=
```

`README.md` must state: without Sanity env vars the site uses mock content; create a Sanity project and paste IDs when ready.

- [ ] **Step 5: Verify scaffold**

Run: `npm test`  
Expected: PASS (0 tests or empty suite OK) or no failing tests

Run: `npx tsc --noEmit`  
Expected: exit 0

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js app with Vitest and env example"
```

---

### Task 2: Domain types + mock content + Sanity env helper

**Files:**
- Create: `lib/types/content.ts`, `lib/mock/content.ts`, `lib/sanity/env.ts`, `lib/utils.ts`
- Test: `tests/lib/env.test.ts`

**Interfaces:**
- Consumes: none
- Produces:
  - Types: `SiteSettings`, `Category`, `GalleryImage`, `EventItem`, `ServicePackage`, `PageAbout`, `SocialLink`, `PressItem`
  - `isSanityConfigured(): boolean`
  - `mockContent` object exporting all seed data
  - `cn(...inputs: ClassValue[]): string`

- [ ] **Step 1: Write failing env test**

Create `tests/lib/env.test.ts`:

```ts
import { afterEach, describe, expect, it } from "vitest";
import { isSanityConfigured } from "@/lib/sanity/env";

describe("isSanityConfigured", () => {
  const original = { ...process.env };

  afterEach(() => {
    process.env = { ...original };
  });

  it("returns false when project id is missing", () => {
    delete process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    process.env.NEXT_PUBLIC_SANITY_DATASET = "production";
    expect(isSanityConfigured()).toBe(false);
  });

  it("returns true when project id and dataset are set", () => {
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "abc123";
    process.env.NEXT_PUBLIC_SANITY_DATASET = "production";
    expect(isSanityConfigured()).toBe(true);
  });
});
```

- [ ] **Step 2: Run test — expect FAIL**

Run: `npm test -- tests/lib/env.test.ts`  
Expected: FAIL — cannot find module `@/lib/sanity/env`

- [ ] **Step 3: Implement types, utils, env, mock**

`lib/utils.ts`:

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

```bash
npm install clsx tailwind-merge
```

`lib/types/content.ts`:

```ts
export type SocialLink = {
  label: string;
  url: string;
};

export type SiteSettings = {
  brandName: string;
  tagline: string;
  heroImages: Array<{ src: string; alt: string; lqip?: string }>;
  socialLinks: SocialLink[];
  location: string;
  contactEmail: string;
  seo: {
    titleTemplate: string;
    description: string;
    ogImage?: string;
  };
};

export type Category = {
  _id: string;
  title: string;
  slug: string;
  order: number;
};

export type GalleryImage = {
  _id: string;
  title: string;
  alt: string;
  src: string;
  lqip?: string;
  width: number;
  height: number;
  categorySlug: string;
  featured: boolean;
  order: number;
};

export type EventItem = {
  _id: string;
  title: string;
  slug: string;
  start: string; // ISO
  end: string; // ISO
  location: string;
  description: string;
  imageSrc?: string;
  imageAlt?: string;
  addToCalendar: boolean;
};

export type ServicePackage = {
  _id: string;
  name: string;
  priceLabel: string;
  description: string;
  includes: string[];
  addOns: string[];
  featured: boolean;
  order: number;
};

export type PressItem = {
  title: string;
  outlet: string;
  url: string;
  year: string;
};

export type PageAbout = {
  headline: string;
  bio: string; // plain text for Phase 1; portable text can map to string in fetch layer
  philosophy: string;
  portraitSrc: string;
  portraitAlt: string;
  press: PressItem[];
};
```

`lib/sanity/env.ts`:

```ts
export function getSanityProjectId(): string | undefined {
  return process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || undefined;
}

export function getSanityDataset(): string {
  return process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
}

export function getSanityApiVersion(): string {
  return process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";
}

export function isSanityConfigured(): boolean {
  return Boolean(getSanityProjectId() && getSanityDataset());
}
```

`lib/mock/content.ts` — seed ATELIER with 4 categories, ≥12 gallery images using public Unsplash source URLs (fixed photo IDs), 3 events, 3 packages, about + settings. Example shape:

```ts
import type {
  Category,
  EventItem,
  GalleryImage,
  PageAbout,
  ServicePackage,
  SiteSettings,
} from "@/lib/types/content";

export const mockSiteSettings: SiteSettings = {
  brandName: "ATELIER",
  tagline: "Photography for moments that deserve stillness",
  heroImages: [
    {
      src: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=2400&q=80",
      alt: "Silhouette photographer against dusk sky",
    },
    {
      src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=2400&q=80",
      alt: "Wedding couple walking through soft light",
    },
  ],
  socialLinks: [
    { label: "Instagram", url: "https://instagram.com" },
    { label: "Email", url: "mailto:hello@atelier.example" },
  ],
  location: "Available worldwide",
  contactEmail: "hello@atelier.example",
  seo: {
    titleTemplate: "%s · ATELIER",
    description:
      "ATELIER is a photography studio specializing in weddings, portraits, events, and editorial work.",
  },
};

export const mockCategories: Category[] = [
  { _id: "cat-weddings", title: "Weddings", slug: "weddings", order: 1 },
  { _id: "cat-portraits", title: "Portraits", slug: "portraits", order: 2 },
  { _id: "cat-events", title: "Events", slug: "events", order: 3 },
  { _id: "cat-editorial", title: "Editorial", slug: "editorial", order: 4 },
];

// Continue: mockGalleryImages (12–16 items, mixed categorySlug, 4+ featured),
// mockEvents (2–3 future ISO dates), mockPackages (3), mockAbout.
// Export:
export const mockContent = {
  siteSettings: mockSiteSettings,
  categories: mockCategories,
  galleryImages: mockGalleryImages,
  events: mockEvents,
  packages: mockPackages,
  about: mockAbout,
};
```

Fill `mockGalleryImages`, `mockEvents`, `mockPackages`, `mockAbout` completely in the same file (no TODOs). Use varied `width`/`height` for masonry.

- [ ] **Step 4: Run test — expect PASS**

Run: `npm test -- tests/lib/env.test.ts`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib tests
git commit -m "feat: add content types, mock seed data, and Sanity env helper"
```

---

### Task 3: Design tokens, fonts, theme provider, shadcn base

**Files:**
- Modify: `app/globals.css`, `app/layout.tsx`, `tailwind.config.ts` (or CSS-first config)
- Create: `components/theme/theme-provider.tsx`, `components/theme/theme-toggle.tsx`
- Create: shadcn `components/ui/button.tsx`, `components/ui/dialog.tsx`, `components/ui/input.tsx`, `components/ui/label.tsx`, `components/ui/textarea.tsx`, `components/ui/switch.tsx`

**Interfaces:**
- Consumes: `cn` from `lib/utils.ts`
- Produces: CSS vars `--background`, `--foreground`, `--muted`, `--accent`; `ThemeProvider`; `ThemeToggle`

- [ ] **Step 1: Install theme + motion deps + init shadcn**

```bash
npm install next-themes framer-motion gsap
npx shadcn@latest init -y -d
npx shadcn@latest add button dialog input label textarea switch
```

- [ ] **Step 2: Define noir tokens in `app/globals.css`**

```css
@import "tailwindcss"; /* or existing @tailwind directives if v3 */

:root {
  --background: 0 0% 98%;
  --foreground: 0 0% 8%;
  --muted: 30 5% 45%;
  --accent: 36 20% 70%;
  --border: 30 5% 85%;
}

.dark {
  --background: 0 0% 4%; /* #0A0A0A */
  --foreground: 40 20% 95%; /* #F2F0EB */
  --muted: 30 5% 55%;
  --accent: 36 20% 70%;
  --border: 0 0% 16%;
}

html {
  color-scheme: dark;
}

body {
  background: hsl(var(--background));
  color: hsl(var(--foreground));
}
```

Map these into Tailwind theme colors (`background`, `foreground`, `muted`, `accent`, `border`).

- [ ] **Step 3: Fonts + ThemeProvider in root layout**

```tsx
// app/layout.tsx
import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "@/components/theme/theme-provider";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "ATELIER",
    template: "%s · ATELIER",
  },
  description:
    "ATELIER is a photography studio specializing in weddings, portraits, events, and editorial work.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${display.variable} ${GeistSans.variable} font-sans antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

```bash
npm install geist
```

`components/theme/theme-provider.tsx` — standard next-themes client wrapper.  
`components/theme/theme-toggle.tsx` — Switch or button toggling `light`/`dark` with `aria-label="Toggle color theme"`.

- [ ] **Step 4: Smoke-check**

Run: `npm run build`  
Expected: success

- [ ] **Step 5: Commit**

```bash
git commit -am "feat: add editorial noir theme, fonts, and shadcn primitives"
```

---

### Task 4: Site header + footer shell

**Files:**
- Create: `components/layout/site-header.tsx`, `components/layout/site-footer.tsx`
- Modify: `app/layout.tsx` to include them
- Create: `app/page.tsx` temporary placeholder if needed

**Interfaces:**
- Consumes: `SiteSettings` (brandName, socialLinks, location) — accept as props from layout fetch later; for this task hardcode `ATELIER` props from mock import
- Produces: accessible nav links to all public routes

- [ ] **Step 1: Implement header/footer**

Nav links (exact hrefs): `/`, `/gallery`, `/events`, `/about`, `/services`, `/booking`, `/contact`.

Header requirements:

- Logo text uses `font-[family-name:var(--font-display)]` and reads brand name
- Mobile: disclosure button with `aria-expanded`, `aria-controls="mobile-nav"`
- Include `<ThemeToggle />`

Footer: social links list, location, `© {year} {brandName}`.

- [ ] **Step 2: Wire into layout**

Import `mockSiteSettings` for now (Task 5 replaces with fetcher).

- [ ] **Step 3: Manual check**

Run: `npm run dev` — confirm nav + theme toggle work.

- [ ] **Step 4: Commit**

```bash
git add components/layout app/layout.tsx
git commit -m "feat: add site header and footer navigation"
```

---

### Task 5: Sanity schemas + Studio route + fetch layer with mock fallback

**Files:**
- Create: `sanity/schemaTypes/*`, `sanity/structure.ts`, `sanity.config.ts`, `app/studio/[[...tool]]/page.tsx`
- Create: `lib/sanity/client.ts`, `lib/sanity/image.ts`, `lib/sanity/queries.ts`, `lib/sanity/fetch.ts`
- Test: `tests/lib/sanity-fetch.test.ts`
- Modify: `next.config.ts` — allow `cdn.sanity.io` and `images.unsplash.com` in `images.remotePatterns`

**Interfaces:**
- Consumes: `isSanityConfigured`, `mockContent`, domain types
- Produces:
  - `getSiteSettings(): Promise<SiteSettings>`
  - `getCategories(): Promise<Category[]>`
  - `getGalleryImages(): Promise<GalleryImage[]>`
  - `getFeaturedGalleryImages(): Promise<GalleryImage[]>`
  - `getEvents(): Promise<EventItem[]>`
  - `getServicePackages(): Promise<ServicePackage[]>`
  - `getPageAbout(): Promise<PageAbout>`

- [ ] **Step 1: Write failing fetch tests**

```ts
import { afterEach, describe, expect, it, vi } from "vitest";

describe("getSiteSettings", () => {
  afterEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it("returns mock brand ATELIER when Sanity is not configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_SANITY_PROJECT_ID", "");
    const { getSiteSettings } = await import("@/lib/sanity/fetch");
    const settings = await getSiteSettings();
    expect(settings.brandName).toBe("ATELIER");
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

Run: `npm test -- tests/lib/sanity-fetch.test.ts`  
Expected: FAIL module not found

- [ ] **Step 3: Install Sanity packages**

```bash
npm install next-sanity sanity @sanity/image-url @sanity/vision styled-components
```

- [ ] **Step 4: Implement schema types**

Each document matches the design spec fields. `siteSettings` and `pageAbout` are singletons via `structure.ts`.

Example `sanity/schemaTypes/category.ts`:

```ts
import { defineField, defineType } from "sanity";

export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
  ],
});
```

Mirror for `galleryImage`, `event`, `servicePackage`, `siteSettings`, `pageAbout`. Export from `sanity/schemaTypes/index.ts`.

`sanity.config.ts`:

```ts
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemaTypes";
import { structure } from "./structure";
import { getSanityDataset, getSanityProjectId } from "./env";

const projectId = getSanityProjectId() || "placeholder";
const dataset = getSanityDataset();

export default defineConfig({
  name: "atelier",
  title: "ATELIER",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [structureTool({ structure }), visionTool()],
  schema: { types: schemaTypes },
});
```

Create `sanity/env.ts` re-exporting from `lib/sanity/env.ts` or duplicate browser-safe reads of `process.env.NEXT_PUBLIC_*` only.

Studio page:

```tsx
"use client";
import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
```

Place config at `sanity.config.ts` repo root OR `@/sanity/sanity.config.ts` — keep one path and import consistently.

- [ ] **Step 5: Implement client + queries + fetch**

`lib/sanity/fetch.ts` pattern:

```ts
import { mockContent } from "@/lib/mock/content";
import { isSanityConfigured } from "@/lib/sanity/env";
import type { SiteSettings } from "@/lib/types/content";

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isSanityConfigured()) {
    return mockContent.siteSettings;
  }
  try {
    const data = await sanityFetch<SiteSettings>(siteSettingsQuery);
    return data ?? mockContent.siteSettings;
  } catch {
    return mockContent.siteSettings;
  }
}
```

Implement remaining getters the same way. Map Sanity image objects through `@sanity/image-url` in `lib/sanity/image.ts` to `{ src, width, height, lqip }`.

- [ ] **Step 6: next.config remote images**

```ts
images: {
  remotePatterns: [
    { protocol: "https", hostname: "cdn.sanity.io" },
    { protocol: "https", hostname: "images.unsplash.com" },
  ],
},
```

- [ ] **Step 7: Run tests + build**

Run: `npm test -- tests/lib/sanity-fetch.test.ts`  
Expected: PASS

Run: `npm run build`  
Expected: success (Studio may warn on placeholder projectId — acceptable)

- [ ] **Step 8: Commit**

```bash
git add lib sanity app/studio sanity.config.ts next.config.ts tests
git commit -m "feat: add Sanity schemas, Studio, and mock-fallback fetchers"
```

---

### Task 6: Motion primitive + Home page (hero, intro, featured)

**Files:**
- Create: `components/motion/reveal-on-scroll.tsx`, `components/home/hero.tsx`, `components/home/intro-section.tsx`, `components/home/featured-strip.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `getSiteSettings`, `getFeaturedGalleryImages`
- Produces: Home RSC composing client hero + scroll reveals

- [ ] **Step 1: `RevealOnScroll` client component**

Use GSAP ScrollTrigger; if `window.matchMedia('(prefers-reduced-motion: reduce)').matches`, render children with no animation.

- [ ] **Step 2: `Hero` client component**

Props:

```ts
type HeroProps = {
  brandName: string;
  tagline: string;
  images: Array<{ src: string; alt: string }>;
};
```

Requirements:

- Full-bleed background image plane (`position: absolute inset-0`)
- Crossfade images every ~6s (skip interval when reduced motion — show first image only)
- Brand name as largest text; one short headline; one supporting sentence; CTA group linking to `/gallery` and `/booking`
- No cards, badges, or stats in the hero

- [ ] **Step 3: Intro + featured strip**

Intro: short copy from tagline/about blurb.  
Featured: horizontal or grid strip of `featured` images linking to `/gallery`.

- [ ] **Step 4: `app/page.tsx`**

```tsx
import { Hero } from "@/components/home/hero";
import { IntroSection } from "@/components/home/intro-section";
import { FeaturedStrip } from "@/components/home/featured-strip";
import { getFeaturedGalleryImages, getSiteSettings } from "@/lib/sanity/fetch";

export default async function HomePage() {
  const [settings, featured] = await Promise.all([
    getSiteSettings(),
    getFeaturedGalleryImages(),
  ]);

  return (
    <main>
      <Hero
        brandName={settings.brandName}
        tagline={settings.tagline}
        images={settings.heroImages}
      />
      <IntroSection tagline={settings.tagline} />
      <FeaturedStrip images={featured} />
    </main>
  );
}
```

- [ ] **Step 5: Verify**

Run: `npm run build`  
Expected: success

Manual: home shows brand-dominant hero with mock images.

- [ ] **Step 6: Commit**

```bash
git commit -am "feat: build home hero, intro, and featured work strip"
```

---

### Task 7: Gallery page — filters, masonry, lightbox

**Files:**
- Create: `components/gallery/gallery-view.tsx`, `gallery-filters.tsx`, `gallery-masonry.tsx`, `lightbox.tsx`
- Create: `app/gallery/page.tsx`

**Interfaces:**
- Consumes: `getCategories`, `getGalleryImages`
- Produces: filterable gallery with keyboard lightbox

- [ ] **Step 1: Server page loads data**

```tsx
export default async function GalleryPage() {
  const [categories, images] = await Promise.all([
    getCategories(),
    getGalleryImages(),
  ]);
  return (
    <main className="px-4 py-16 md:px-8">
      <h1 className="font-display text-4xl md:text-6xl">Gallery</h1>
      <GalleryView categories={categories} images={images} />
    </main>
  );
}
```

- [ ] **Step 2: `GalleryView` client state**

- Filter chips: `All` + each category slug; `aria-pressed` on active
- Masonry via CSS columns (`columns-1 sm:columns-2 lg:columns-3`) break-inside avoid
- Each item: `next/image` with `placeholder="blur"` when `lqip` present, else empty blur data URL optional; hover caption
- Click opens `Lightbox`

- [ ] **Step 3: `Lightbox`**

- Dialog with focus trap (shadcn Dialog)
- Keys: `Escape` close, `ArrowLeft`/`ArrowRight` navigate
- Swipe: pointer/touch delta > 50px changes index
- `aria-label` on controls: "Close", "Previous image", "Next image"
- Body scroll lock while open

- [ ] **Step 4: Verify**

Run: `npm run build`  
Manual: filter, open lightbox, arrow keys, Esc.

- [ ] **Step 5: Commit**

```bash
git commit -am "feat: add filterable gallery with accessible lightbox"
```

---

### Task 8: Events page + ICS helper

**Files:**
- Create: `lib/ics.ts`, `components/events/event-card.tsx`, `components/events/add-to-calendar-button.tsx`, `app/events/page.tsx`
- Test: `tests/lib/ics.test.ts`

**Interfaces:**
- Consumes: `getEvents`
- Produces: `buildIcsEvent({ title, description, location, start, end }): string`

- [ ] **Step 1: Failing ICS test**

```ts
import { describe, expect, it } from "vitest";
import { buildIcsEvent } from "@/lib/ics";

describe("buildIcsEvent", () => {
  it("includes SUMMARY and DTSTART", () => {
    const ics = buildIcsEvent({
      title: "Pop-up Portrait Night",
      description: "Walk-in portraits",
      location: "Berlin",
      start: "2026-11-01T17:00:00.000Z",
      end: "2026-11-01T20:00:00.000Z",
    });
    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("SUMMARY:Pop-up Portrait Night");
    expect(ics).toContain("DTSTART:");
    expect(ics).toContain("END:VCALENDAR");
  });
});
```

- [ ] **Step 2: Run — FAIL, then implement `lib/ics.ts`**

Format UTC as `YYYYMMDDTHHMMSSZ`. Escape commas/semicolons in text fields.

- [ ] **Step 3: Events UI**

`AddToCalendarButton`: when clicked, download `event.ics` via Blob URL. Only render if `event.addToCalendar`.

Empty state if no upcoming events.

- [ ] **Step 4: Tests + commit**

```bash
npm test -- tests/lib/ics.test.ts
git commit -am "feat: add events page and ICS download helper"
```

---

### Task 9: About + Services pages

**Files:**
- Create: `components/about/about-view.tsx`, `components/services/package-card.tsx`
- Create: `app/about/page.tsx`, `app/services/page.tsx`

**Interfaces:**
- Consumes: `getPageAbout`, `getServicePackages`

- [ ] **Step 1: About page**

Layout: portrait (next/image) + headline + bio + philosophy + press list (external links `rel="noopener noreferrer"`).

- [ ] **Step 2: Services page**

Map packages sorted by `order`. Featured package can use accent border — still not a heavy “card stack” in the hero sense; simple bordered sections OK for comparison.

- [ ] **Step 3: Build + commit**

```bash
npm run build
git commit -am "feat: add about and services pages from CMS content"
```

---

### Task 10: Booking + Contact form shells (Phase 2 field shapes)

**Files:**
- Create: `components/booking/booking-form.tsx`, `components/contact/contact-form.tsx`
- Create: `app/booking/page.tsx`, `app/contact/page.tsx`

**Interfaces:**
- Consumes: `getSiteSettings` (email, location, socials)
- Produces: forms with disabled submit and honest messaging

- [ ] **Step 1: Booking form fields (exact names for Phase 2)**

Controlled or uncontrolled form with:

- `name`, `email`, `eventType`, `date`, `location`, `budget`, `message`

Submit button: `disabled` with helper text:  
`Online booking launches soon — meanwhile email {contactEmail}.`

Do **not** show a fake success toast.

- [ ] **Step 2: Contact form fields**

- `name`, `email`, `subject`, `message`

Same gated submit pattern. Show social links + location text. Map: static OpenStreetMap embed iframe **or** a figure with location text if no map key — prefer OSM embed with `title="Studio location map"` and no API key.

- [ ] **Step 3: Build + commit**

```bash
npm run build
git commit -am "feat: add booking and contact form shells for Phase 2"
```

---

### Task 11: SEO — metadata, sitemap, robots, JSON-LD

**Files:**
- Create: `app/sitemap.ts`, `app/robots.ts`, `components/seo/json-ld.tsx`
- Modify: each `page.tsx` to export `metadata` where useful; `app/layout.tsx` for defaults

**Interfaces:**
- Consumes: `getSiteSettings`
- Produces: valid sitemap entries for all public routes; `Photograph`/`LocalBusiness` JSON-LD on home

- [ ] **Step 1: `sitemap.ts` / `robots.ts`**

```ts
import type { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/gallery", "/events", "/about", "/services", "/booking", "/contact"];
  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));
}
```

Add `NEXT_PUBLIC_SITE_URL=` to `.env.example`.

- [ ] **Step 2: JSON-LD component**

```tsx
export function LocalBusinessJsonLd({
  name,
  description,
  email,
  location,
}: {
  name: string;
  description: string;
  email: string;
  location: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name,
    description,
    email,
    areaServed: location,
    priceRange: "$$",
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

Include on home page.

- [ ] **Step 3: Build + commit**

```bash
npm run build
git commit -am "feat: add sitemap, robots, and local business JSON-LD"
```

---

### Task 12: Layout polish, reduced-motion audit, README deploy notes

**Files:**
- Modify: header/footer to use `getSiteSettings` in layout via async Server Component wrapper if needed
- Modify: `README.md` with run/deploy/Sanity setup steps
- Create: `docs/superpowers/plans/` already exists — add short `PHASE2.md` pointer only if needed (skip if YAGNI — prefer README section “Phase 2”)

**Interfaces:**
- Consumes: all prior pages
- Produces: documented Vercel + Sanity connect steps; ask user for credentials (do not invent)

- [ ] **Step 1: Async settings in chrome**

Create `components/layout/site-shell.tsx` as async server component:

```tsx
export async function SiteShell({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  return (
    <>
      <SiteHeader brandName={settings.brandName} />
      {children}
      <SiteFooter settings={settings} />
    </>
  );
}
```

Use in `app/layout.tsx`.

- [ ] **Step 2: README**

Document:

1. `npm install && npm run dev`
2. Mock mode without env
3. Create Sanity project → copy project ID/dataset → `.env.local`
4. Open `/studio` to replace placeholder images
5. `vercel` deploy + set env vars

Explicitly list credentials to request from the user: Sanity project ID, dataset name, read token (optional).

- [ ] **Step 3: Final verification**

```bash
npm test
npm run build
```

Expected: all tests pass; build succeeds.

Manual checklist:

- [ ] Home hero brand-first
- [ ] Gallery filter + lightbox keyboard
- [ ] Theme toggle
- [ ] Events ICS download
- [ ] Booking/contact submit disabled with honest copy
- [ ] `/studio` loads (with or without real project)

- [ ] **Step 4: Commit**

```bash
git commit -am "docs: finalize README and wire settings-driven site shell"
```

---

## Spec coverage checklist (self-review)

| Spec requirement | Task |
|---|---|
| Next.js App Router + TS strict + Tailwind + shadcn | 1, 3 |
| Framer Motion + GSAP ScrollTrigger | 6, 7 |
| Sanity schemas + Studio | 5 |
| Mock fallback without secrets | 2, 5 |
| Home hero / intro / featured | 6 |
| Gallery masonry + lightbox + filters | 7 |
| Events + add to calendar | 8 |
| About / Services | 9 |
| Booking + Contact shells | 10 |
| Dark/light theme | 3, 4 |
| SEO sitemap/robots/JSON-LD | 11 |
| A11y keyboard/ARIA/alt/reduced-motion | 6–8, 12 |
| Editorial noir tokens + fonts | 3 |
| Phase 2 explicitly deferred | Global Constraints + Task 10 |
| Vercel deploy docs | 12 |

## Placeholder scan

No TBD/TODO steps remain; env credentials are requested via README, not invented.

## Type consistency

Shared names: `SiteSettings`, `Category`, `GalleryImage`, `EventItem`, `ServicePackage`, `PageAbout`, `getSiteSettings`, `getCategories`, `getGalleryImages`, `getFeaturedGalleryImages`, `getEvents`, `getServicePackages`, `getPageAbout`, `buildIcsEvent`, `isSanityConfigured`.
