# ATELIER Photography Portfolio

Next.js portfolio site for ATELIER photography. Gallery images upload through
`/admin/media` to **Vercel Blob**, with metadata in Postgres (Prisma). About /
Events / Services use typed mock content until you extend admin later.

## Install and run

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Admin is at
[http://localhost:3000/admin](http://localhost:3000/admin) (Google auth +
`ADMIN_EMAILS` allowlist).

## Mock mode

No storage env vars are required for browsing the public site. Without
`DATABASE_URL` gallery rows, the site uses placeholder images in
`lib/mock/content.ts`.

## Gallery uploads (Vercel Blob)

1. Create a Blob store in the [Vercel dashboard](https://vercel.com/dashboard)
   → Storage → Blob. Copy `BLOB_READ_WRITE_TOKEN`.
2. Provision Postgres (Neon / Vercel Postgres) and set `DATABASE_URL`.
3. Copy env and fill values:

   ```bash
   cp .env.example .env.local
   ```

   ```dotenv
   DATABASE_URL=...
   BLOB_READ_WRITE_TOKEN=...
   AUTH_SECRET=...
   AUTH_URL=http://localhost:3000
   AUTH_GOOGLE_ID=...
   AUTH_GOOGLE_SECRET=...
   ADMIN_EMAILS=you@example.com
   ```

4. Push the schema:

   ```bash
   npx prisma db push
   ```

5. Restart `npm run dev`, sign in at `/admin`, open **Media**, upload images
   with a category. Published rows replace mock gallery content on `/gallery`.

### Content freshness

Public pages revalidate every 5 minutes. Uploads also call `revalidatePath` for
`/` and `/gallery`. Optional manual purge: set `REVALIDATE_SECRET` and
`POST /api/revalidate` with `x-revalidate-secret`.

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
   - `DATABASE_URL`
   - `BLOB_READ_WRITE_TOKEN`
   - `AUTH_SECRET`, `AUTH_URL`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`
   - `ADMIN_EMAILS`
   - `REVALIDATE_SECRET` — optional; enables `/api/revalidate`
3. Deploy production:

   ```bash
   vercel --prod
   ```

Without Blob/DB vars, the public site stays in mock gallery mode.

### Credentials to request from the site owner

Do not invent or commit credentials. Request:

- Vercel Blob read/write token
- Postgres `DATABASE_URL`
- Google OAuth client for admin sign-in
- Admin allowlist emails

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
