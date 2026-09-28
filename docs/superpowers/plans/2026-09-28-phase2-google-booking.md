# Phase 2 Booking + Google Calendar + Gmail Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire live booking and contact so clients see real Google Calendar availability, submissions create tentative calendar events + DB rows, and photographer/client emails send via Gmail API.

**Architecture:** NextAuth (Auth.js) with Google OAuth stores the photographer’s refresh token for Calendar FreeBusy + Events and Gmail send. Prisma + PostgreSQL persist `BookingRequest` and `Inquiry`. Public APIs are rate-limited; admin routes require a signed-in photographer email allowlist. Without Google/DB env vars, UI stays honest (“connect Google to enable”) and the build does not hard-fail.

**Tech Stack:** Auth.js (NextAuth v5) Google provider, `googleapis`, Prisma, PostgreSQL (Supabase), existing Next.js App Router forms, Upstash-style or in-memory rate limit for Phase 2 (simple token-bucket in-memory OK for single-instance; document Redis later).

## Global Constraints

- Brand: `ATELIER` (from CMS settings)
- No hardcoded secrets; builds succeed without Google/DB credentials
- Booking fields stay: `name`, `email`, `eventType`, `date`, `location`, `budget`, `message`
- Contact fields stay: `name`, `email`, `subject`, `message`
- Tentative Google Calendar events on booking submit
- Emails via **Gmail API** (not Resend) — photographer notification + client confirmation
- Admin: approve / decline / reschedule only for allowlisted Google account
- Rate-limit booking + contact POST routes
- Prefer focused modules under `lib/google`, `lib/booking`, `lib/email`

---

## Prerequisites (user / env)

Ask the user for (do not invent):

1. Google Cloud OAuth Client ID + Secret (Web application), with redirect URI `http://127.0.0.1:3000/api/auth/callback/google` (+ production URL later)
2. Enabled APIs: Google Calendar API, Gmail API
3. OAuth scopes: `openid email profile`, `https://www.googleapis.com/auth/calendar.events`, `https://www.googleapis.com/auth/calendar.freebusy`, `https://www.googleapis.com/auth/gmail.send`
4. `DATABASE_URL` (Supabase Postgres connection string)
5. Photographer admin email(s) for allowlist (`ADMIN_EMAILS`)
6. `AUTH_SECRET` (generate with `openssl rand -base64 32`)

Until these exist: implement code paths + `.env.example`; runtime features gate on `isGoogleBookingConfigured()` / `isDatabaseConfigured()`.

---

## File structure

```
prisma/schema.prisma
lib/db.ts
lib/auth.ts
lib/auth.config.ts
lib/google/calendar.ts
lib/google/gmail.ts
lib/google/tokens.ts
lib/booking/availability.ts
lib/booking/rate-limit.ts
lib/email/templates.ts
app/api/auth/[...nextauth]/route.ts
app/api/availability/route.ts
app/api/booking/route.ts
app/api/contact/route.ts
app/api/admin/bookings/[id]/route.ts
app/admin/layout.tsx
app/admin/page.tsx
app/admin/bookings/page.tsx
components/booking/availability-calendar.tsx
components/booking/booking-form.tsx          # enable submit when configured
components/contact/contact-form.tsx          # enable submit when configured
middleware.ts                                # protect /admin
.env.example                                 # extend
README.md                                    # Phase 2 setup section
tests/lib/rate-limit.test.ts
tests/lib/availability.test.ts
```

---

### Task 1: Prisma schema + client

**Files:**
- Create: `prisma/schema.prisma`, `lib/db.ts`
- Modify: `package.json` scripts (`prisma generate`, `prisma migrate`)
- Test: smoke that `PrismaClient` instantiates when `DATABASE_URL` set (skip test if unset)

**Produces:**
- Models `BookingRequest`, `Inquiry`, `Account`/`User`/`Session`/`VerificationToken` if using Prisma adapter (preferred for Auth.js)
- Enum `BookingStatus`: `PENDING | APPROVED | DECLINED | RESCHEDULED`

- [ ] **Step 1:** Install `prisma` `@prisma/client` and init schema with Postgres provider
- [ ] **Step 2:** Define models matching Phase 2 fields + `googleEventId` optional on bookings
- [ ] **Step 3:** `lib/db.ts` singleton Prisma client
- [ ] **Step 4:** `isDatabaseConfigured()` helper
- [ ] **Step 5:** Commit

---

### Task 2: Auth.js Google OAuth (photographer)

**Files:**
- Create: `lib/auth.ts`, `app/api/auth/[...nextauth]/route.ts`, `middleware.ts`
- Modify: `.env.example`

**Produces:**
- Google sign-in that requests Calendar + Gmail scopes with `access_type=offline` + `prompt=consent` once to obtain refresh token
- Persist tokens via Prisma adapter (or encrypted Account table)
- `auth()` helper; `requireAdmin()` checks `ADMIN_EMAILS`

- [ ] **Step 1:** Install `next-auth@beta` (Auth.js v5) + `@auth/prisma-adapter`
- [ ] **Step 2:** Configure Google provider with scopes listed above
- [ ] **Step 3:** Admin gate helper
- [ ] **Step 4:** `/admin` middleware protection
- [ ] **Step 5:** Commit

---

### Task 3: Google Calendar FreeBusy + Events helpers

**Files:**
- Create: `lib/google/calendar.ts`, `lib/google/tokens.ts`
- Test: `tests/lib/availability.test.ts` (pure slot math, no network)

**Produces:**
- `getFreeBusy(timeMin, timeMax): Promise<BusyInterval[]>`
- `listOpenSlots({ from, to, durationMinutes, workingHours }): Slot[]`
- `createTentativeEvent({ summary, description, start, end, attendeeEmail }): eventId`
- Working hours default Mon–Fri 10:00–18:00 in `NEXT_PUBLIC_SITE_TIMEZONE` (reuse Phase 1 timezone helper)

- [ ] **Step 1:** Failing tests for slot generation given busy intervals
- [ ] **Step 2:** Implement slot math
- [ ] **Step 3:** Implement Calendar API wrappers using photographer refresh token
- [ ] **Step 4:** Commit

---

### Task 4: Gmail send helpers + templates

**Files:**
- Create: `lib/google/gmail.ts`, `lib/email/templates.ts`
- Test: template string tests (no network)

**Produces:**
- `sendMail({ to, subject, html, text })` via Gmail API `users.messages.send` as the connected photographer
- Templates: booking received (client), booking notify (photographer), inquiry received/notify, status change

- [ ] **Step 1:** Implement RFC 2822 raw message base64url encoder
- [ ] **Step 2:** Templates
- [ ] **Step 3:** Commit

---

### Task 5: Availability API + booking calendar UI

**Files:**
- Create: `app/api/availability/route.ts`, `components/booking/availability-calendar.tsx`
- Modify: `app/booking/page.tsx`, `components/booking/booking-form.tsx`

**Produces:**
- GET `/api/availability?from=&to=` returns open ISO slots (or 503 if Google not connected)
- Interactive calendar picks a slot → fills `date` on the form
- Form submit enabled only when DB + Google configured

- [ ] **Step 1:** API route + rate limit
- [ ] **Step 2:** Client calendar component
- [ ] **Step 3:** Wire booking page
- [ ] **Step 4:** Commit

---

### Task 6: Booking + contact POST APIs

**Files:**
- Create: `app/api/booking/route.ts`, `app/api/contact/route.ts`, `lib/booking/rate-limit.ts`
- Modify: booking/contact forms to POST via `fetch`
- Test: `tests/lib/rate-limit.test.ts`

**Produces:**
- POST booking: validate → rate limit → create Prisma row → tentative Calendar event → Gmail to client + photographer → return `{ ok: true }`
- POST contact: validate → rate limit → Prisma Inquiry → Gmail both ways
- Zod validation for all fields

- [ ] **Step 1:** Rate limiter TDD
- [ ] **Step 2:** Booking route
- [ ] **Step 3:** Contact route
- [ ] **Step 4:** Enable forms
- [ ] **Step 5:** Commit

---

### Task 7: Admin approve / decline / reschedule

**Files:**
- Create: `app/admin/layout.tsx`, `app/admin/page.tsx`, `app/admin/bookings/page.tsx`, `app/api/admin/bookings/[id]/route.ts`

**Produces:**
- List pending bookings
- Actions update status + patch Google event (confirm / delete / update time) + email client
- Sign-in link for photographer

- [ ] **Step 1:** Admin UI list
- [ ] **Step 2:** PATCH API
- [ ] **Step 3:** Commit

---

### Task 8: Docs + env checklist + verify smoke

**Files:**
- Modify: `README.md`, `.env.example`

**Produces:**
- Step-by-step Google Cloud + Supabase + local connect
- Explicit credential request list for the user

- [ ] **Step 1:** Docs
- [ ] **Step 2:** `npm test` + `npm run build`
- [ ] **Step 3:** Commit

---

## Spec coverage

| Spec item | Task |
|---|---|
| NextAuth Google OAuth | 2 |
| FreeBusy + open slots UI | 3, 5 |
| Tentative event on submit | 3, 6 |
| Prisma BookingRequest + Inquiry | 1, 6 |
| Gmail notifications | 4, 6 |
| Admin approve/decline/reschedule | 7 |
| Rate limiting | 6 |
| No secrets / graceful ungated UI | 2, 5, 8 |

## Email decision (locked)

Use **Gmail API** with the photographer’s connected Google account instead of Resend (user requested Google-direct).
