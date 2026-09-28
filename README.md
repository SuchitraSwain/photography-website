# ATELIER Photography Portfolio

Next.js portfolio site for ATELIER photography, with an embedded Sanity Studio
and a built-in mock-content fallback.

## Install and run

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The Sanity Studio is
available at [http://localhost:3000/studio](http://localhost:3000/studio).

## Mock mode

No environment variables are required for local development. If
`NEXT_PUBLIC_SANITY_PROJECT_ID` is unset, the website automatically uses the
content and placeholder images in `lib/mock/content.ts`.

The `/studio` route still renders its setup shell in mock mode, but it is not
connected to a real content project.

## Connect Sanity

1. Create a project at [sanity.io/manage](https://www.sanity.io/manage) and
   create or choose a dataset (the default used here is `production`).
2. In the Sanity project settings, add `http://localhost:3000` as a CORS origin
   with credentials enabled. Add the deployed site origin later as well.
3. Copy the example environment file:

   ```bash
   cp .env.example .env.local
   ```

4. Set the project values:

   ```dotenv
   NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
   NEXT_PUBLIC_SANITY_DATASET=production
   NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01
   ```

5. Restart `npm run dev`, open `/studio`, sign in to Sanity, and create the site
   settings and other documents. Replace all placeholder images through the
   Studio.

The current frontend reads public datasets and does not require a token.
`SANITY_API_READ_TOKEN` is optional and reserved for private dataset or future
authenticated server-side reads; never expose it with a `NEXT_PUBLIC_` prefix or
commit it.

### Content freshness

Pages are statically generated and revalidated every 5 minutes, so published
edits appear without a redeploy. Requests bypass the Sanity CDN
(`useCdn: false`) so Next.js is the only cache layer.

To publish immediately instead of waiting out the window, set
`SANITY_REVALIDATE_SECRET` and point a Sanity webhook at
`POST https://<your-site>/api/revalidate`, sending the same value in an
`x-revalidate-secret` header (a `?secret=` query parameter also works). The
route returns `501` until the secret is configured and `401` when it does not
match.

### Event timezone

`NEXT_PUBLIC_SITE_TIMEZONE` is the IANA timezone used to render event dates and
times (for example `America/New_York`). It defaults to `UTC`, and an
unrecognized value falls back to `UTC` with an error logged. Times are always
displayed with their zone abbreviation. Calendar exports are unaffected — `.ics`
files are always written in UTC.

## Deploy to Vercel

1. Install and authenticate the Vercel CLI, then deploy from the project root:

   ```bash
   npm install --global vercel
   vercel
   ```

2. In the Vercel project settings, add these environment variables to the
   Production and Preview environments:
   - `NEXT_PUBLIC_SITE_URL` — the canonical production URL, including `https://`
   - `NEXT_PUBLIC_SITE_TIMEZONE` — optional; IANA zone for event times (default `UTC`)
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `NEXT_PUBLIC_SANITY_API_VERSION`
   - `SANITY_API_READ_TOKEN` — optional; only if private reads are implemented
   - `SANITY_REVALIDATE_SECRET` — optional; enables the `/api/revalidate` webhook
3. Add the Vercel production and preview origins to the Sanity project's CORS
   origins with credentials enabled so `/studio` can authenticate.
4. Deploy production:

   ```bash
   vercel --prod
   ```

If Sanity variables are omitted, the deployed website remains in mock mode.

### Credentials to request from the site owner

Do not invent or commit credentials. Request:

- Sanity project ID
- Sanity dataset name (usually `production`)
- Sanity read token (optional; only for private authenticated reads)

The site owner must also grant the content editors access to the Sanity project.

## Scripts

- `npm run dev` — development server (Turbopack)
- `npm run build` — production build
- `npm run start` — start production server
- `npm test` — run Vitest once
- `npm run test:watch` — Vitest in watch mode
- `npm run lint` — ESLint

## TypeScript

The project uses strict TypeScript (`strict: true`, `noUncheckedIndexedAccess: true`). Run `npx tsc --noEmit` to type-check.

## Phase 2 — Google Calendar booking + Gmail

Booking and contact submit to your Google account (Calendar FreeBusy + tentative
events + Gmail). Admin UI lives at `/admin`.

### 1. Create a Supabase Postgres database

1. Create a project at [supabase.com](https://supabase.com).
2. Copy the connection string (Settings → Database) into `DATABASE_URL`.
3. From the app root:

   ```bash
   npx prisma migrate dev --name init
   ```

### 2. Create Google OAuth credentials

1. Open [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project (or pick one) and enable **Google Calendar API** and **Gmail API**.
3. Configure the OAuth consent screen (External is fine for personal use).
4. Create an OAuth client ID of type **Web application**.
5. Add authorized redirect URI:

   `http://127.0.0.1:3000/api/auth/callback/google`

   (Add your production `https://…/api/auth/callback/google` later.)
6. Copy Client ID → `AUTH_GOOGLE_ID` and Client Secret → `AUTH_GOOGLE_SECRET`.

### 3. Fill `.env.local`

```bash
cp .env.example .env.local
openssl rand -base64 32   # paste into AUTH_SECRET
```

Set:

- `DATABASE_URL`
- `AUTH_SECRET`
- `AUTH_URL=http://127.0.0.1:3000`
- `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`
- `ADMIN_EMAILS=you@gmail.com` (the Google account that owns the calendar)

### 4. Connect Google

1. `npm run dev`
2. Open [http://127.0.0.1:3000/admin/sign-in](http://127.0.0.1:3000/admin/sign-in)
3. Sign in with the admin Gmail account (consent to Calendar + Gmail)
4. Booking (`/booking`) and contact (`/contact`) unlock automatically once env + DB + OAuth are set

### Credentials to request

- Supabase / Postgres `DATABASE_URL`
- Google OAuth Client ID + Secret
- Admin Google email(s) for `ADMIN_EMAILS`
- Generated `AUTH_SECRET`

Without these variables the site still runs; booking/contact stay gated with mailto fallbacks.
