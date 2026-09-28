# ATELIER — Photography Portfolio & Booking Site Design

**Date:** 2026-09-28  
**Status:** Approved (Phase 1)  
**Brand:** Placeholder `ATELIER` (swappable via CMS `siteSettings`)

## Goals

Build a modern, image-first photography portfolio that looks production-ready on day one, with content editable without code (Sanity), then add real Google Calendar booking in a second phase.

Success for Phase 1:

- Editorial-noir marketing site that feels premium on mobile and desktop
- Gallery, events, about, and services driven by Sanity
- Fast loads, strong SEO/a11y, motion that respects `prefers-reduced-motion`
- Booking/contact UIs present but not dependent on Google/Prisma/Resend yet

## Decisions locked

| Topic | Choice |
|---|---|
| Brand | Placeholder `ATELIER` |
| Delivery | Phased MVP |
| CMS | Sanity (free tier) |
| Image delivery (v1) | Sanity CDN + `next/image` |
| Placeholder imagery | Curated temporary stock; replace in Studio |
| Focus | Mixed: Weddings, Portraits, Events, Editorial |
| Visual direction | Editorial noir |
| Architecture | Sanity + `next-sanity` (Approach 1) |

## Out of scope for Phase 1

- NextAuth Google OAuth
- Google Calendar FreeBusy / Events API
- Prisma + PostgreSQL (Supabase)
- Resend (or Gmail) transactional email
- Admin approve/decline/reschedule for bookings
- Cloudinary / Vercel Blob (revisit if Sanity assets become limiting)
- Real payment / deposits

These are specified under **Phase 2** so the Phase 1 UI can anticipate them.

---

## Phase 1 architecture

```
┌─────────────────────────────────────────────────────────┐
│  Vercel (Next.js App Router, TypeScript strict)         │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │ Public pages│  │ /studio      │  │ API stubs      │  │
│  │ RSC + motion│  │ Sanity Studio│  │ (booking later)│  │
│  └──────┬──────┘  └──────┬───────┘  └────────────────┘  │
│         │                │                               │
│         └────────┬───────┘                               │
│                  ▼                                       │
│         next-sanity / Sanity CDN                         │
└─────────────────────────────────────────────────────────┘
```

**Stack**

- Next.js 14+ App Router, TypeScript (`strict`), Server Components by default
- Tailwind CSS + shadcn/ui (restyled for noir)
- Framer Motion (UI / lightbox / layout) + GSAP ScrollTrigger (scroll reveals)
- Sanity.io + embedded Studio at `/studio`
- Deploy: Vercel

**Environment variables (Phase 1)**

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION` (optional, pinned)
- `SANITY_API_READ_TOKEN` (if dataset is private; preferred for preview)
- Sanity project created by the user; credentials requested when wiring live CMS — local seed/mock so builds do not hard-fail without secrets

**No hardcoded credentials** anywhere in source.

---

## Pages & UX

### Global chrome

- Sticky minimal nav; on `/`, brand `ATELIER` is a hero-level signal (not only nav text)
- Dark mode default + light mode toggle
- Footer: socials, location micro-copy, legal stub
- Desktop gallery: subtle custom cursor / hover micro-interactions
- Keyboard accessible throughout; reduced-motion disables non-essential animation

### Routes

| Route | Purpose |
|---|---|
| `/` | Full-bleed hero (rotating featured stills), brief intro, featured work strip, CTAs to Gallery and Booking |
| `/gallery` | Filterable masonry by category; lightbox with keyboard + swipe; lazy images + blur placeholders |
| `/events` | Upcoming public events as date-forward cards; optional `.ics` “Add to calendar” |
| `/about` | Bio, portrait, philosophy, press — from CMS |
| `/services` | Packages, includes, add-ons — from CMS |
| `/booking` | Availability UI shell + booking form fields; submission gated until Phase 2 |
| `/contact` | Inquiry form UI + socials + map/location; full email pipeline in Phase 2 |
| `/studio` | Sanity Studio (editor only) |

### Motion budget

1. Hero image crossfade / subtle parallax  
2. Scroll-triggered section reveals (intro + featured)  
3. Gallery filter / layout morph + lightbox transitions  

All gated by `prefers-reduced-motion`.

### Layout rules

- One composition in the first viewport: brand, one headline, one supporting line, one CTA group, one dominant full-bleed image plane
- No cards in the hero; cards only where interaction needs a container (forms)
- One job per section; generous whitespace; image-first

---

## CMS schema

### `siteSettings` (singleton)

- `brandName`, `tagline`
- `heroImages[]` (image + alt)
- `socialLinks[]` (label, url)
- `location`, `contactEmail`
- `seoDefaults` (title template, description, ogImage)

### `category`

- `title`, `slug`, `order`  
- Seed: Weddings, Portraits, Events, Editorial

### `galleryImage`

- `title`, `image`, `alt`
- `category` (reference)
- `featured` (boolean), `order`, `shootDate` (optional)

### `event`

- `title`, `slug`
- `start`, `end`
- `location`, `description`
- `image` (optional)
- `addToCalendar` (boolean)

### `servicePackage`

- `name`, `priceLabel`, `description`
- `includes[]`, `addOns[]`
- `featured`, `order`

### `pageAbout` (singleton)

- `headline`, `bio` (portable text)
- `portrait`, `philosophy`
- `press[]` (title, outlet, url, year)

### Seed content

- 4 categories  
- 12–16 placeholder gallery images (curated stock)  
- 2–3 sample events  
- 3 service packages  
- About + site settings for `ATELIER`

### Publishing

- Editors publish in `/studio`
- Public site uses tag-based or time-based revalidation after publish

---

## Visual system (Editorial noir)

**Color**

- Dark default: background `#0A0A0A`, text `#F2F0EB`, muted stone secondary
- Accent: warm silver / champagne (not purple)
- Light mode: gallery white + charcoal (invert of the noir system)

**Typography**

- Display: Cormorant Garamond (brand + headlines)
- UI/body: Geist Sans
- Brand name dominates first viewport; supporting headline does not overpower it

**Components**

- shadcn primitives (Button, Dialog for lightbox shell, form controls, Switch/Toggle for theme) restyled to match noir — not stock shadcn aesthetics

**Imagery**

- Full-bleed hero only
- Masonry gallery with hover caption reveal
- Sanity image pipeline: width/quality params + LQIP / blur placeholders via `next/image`

---

## SEO, accessibility, reliability

**SEO**

- Route-level `metadata` + Open Graph
- JSON-LD for photographer / local business (from `siteSettings`)
- `sitemap.xml`, `robots.txt`

**Accessibility**

- Semantic HTML, CMS-driven meaningful `alt`
- Lightbox focus trap + keyboard (Esc, arrows)
- ARIA on filters, theme toggle, dialogs
- Visible focus rings; reduced-motion alternate path

**Reliability**

- Skeletons while CMS data loads
- Empty and error states if Sanity is unreachable
- Forms in Phase 1: clearly disabled or “coming soon” with no false “email sent” success
- Rate limiting deferred to Phase 2 APIs (when booking/contact actually POST)

---

## Phase 2 (specified, not implemented in Phase 1)

### Availability & booking

- NextAuth.js with Google OAuth (photographer account)
- Google Calendar API: FreeBusy for open slots; create **tentative** events on submit
- Client-facing interactive calendar shows only open dates/times
- Booking form: name, email, event type, date, location, budget, message
- On submit: tentative calendar event + Prisma row + Resend notification to photographer + confirmation to client
- Rate-limited API routes

### Data

- Prisma + PostgreSQL (Supabase): `BookingRequest`, `Inquiry`, status enums (`pending` | `approved` | `declined` | `rescheduled`)
- Admin-only protected routes to approve / decline / reschedule

### Contact

- Contact form posts to API → Prisma `Inquiry` + Resend email (separate from booking)

### Optional later

- Cloudinary if Sanity asset/CDN limits become tight
- Dedicated public “shoots” calendar feed if CMS events are insufficient

Phase 1 `/booking` and `/contact` UIs should match these field shapes so Phase 2 is wiring, not redesign.

---

## Implementation order (high level)

1. Scaffold Next.js + Tailwind + shadcn + theme + fonts  
2. Sanity project schema + Studio + seed  
3. Design system + global layout (nav, footer, theme)  
4. Home (hero + intro + featured) with motion  
5. Gallery + lightbox  
6. Events, About, Services  
7. Booking + Contact shells  
8. SEO (metadata, sitemap, JSON-LD) + a11y pass  
9. Vercel deploy checklist + env documentation  

Phase 2 begins only after Phase 1 is live and content-editable.

---

## Non-goals / YAGNI

- Multi-photographer / multi-tenant
- Client proofing galleries with passwords (can be a later product)
- E-commerce print store
- Blog (unless content demand appears)
- Purple/glow/AI-template visual tropes

## Open items for implementation (not blockers)

- Sanity project ID / dataset tokens provided by user when ready to connect live CMS
- Real photography assets uploaded by user after Studio is live
- Map embed provider for Contact (static map image vs embed) chosen during Contact page build
