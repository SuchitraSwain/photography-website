# ATELIER Photography Portfolio

Next.js portfolio site for ATELIER photography.

## Environment

Copy `.env.example` to `.env.local` and fill in values when ready.

Without Sanity environment variables configured, the site uses **mock content** for development. Create a [Sanity](https://www.sanity.io/) project and paste your project ID and tokens into `.env.local` when you are ready to connect live CMS data.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — development server (Turbopack)
- `npm run build` — production build
- `npm run start` — start production server
- `npm test` — run Vitest once
- `npm run test:watch` — Vitest in watch mode
- `npm run lint` — ESLint

## TypeScript

The project uses strict TypeScript (`strict: true`, `noUncheckedIndexedAccess: true`). Run `npx tsc --noEmit` to type-check.
