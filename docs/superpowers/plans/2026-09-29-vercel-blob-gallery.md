# Vercel Blob Gallery Implementation Plan

> **For agentic workers:** Execute task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Remove Sanity; serve/upload gallery images via Prisma + Vercel Blob behind `/admin`.

**Architecture:** `lib/content/fetch.ts` returns mocks for non-gallery content; gallery reads Prisma when configured and non-empty. Admin uploads via `put()` to Blob then inserts rows.

**Tech Stack:** Next.js App Router, Prisma, `@vercel/blob`, existing NextAuth admin allowlist.

## Global Constraints

- Keep mock fallbacks so build/dev works without `DATABASE_URL` / Blob token.
- Auth required on media write APIs.
- Category slugs match `mockCategories`.

---

### Task 1: Remove Sanity

- [ ] Delete `app/studio`, `sanity/`, `lib/sanity/`, `sanity.config.ts`
- [ ] Uninstall `sanity`, `next-sanity`, `@sanity/image-url`, `@sanity/vision` (keep `styled-components` only if still needed — remove if unused)
- [ ] Strip Sanity env from `.env.example`; leave local `.env.local` Sanity keys removable
- [ ] Simplify `/api/revalidate` or leave as path revalidate without Sanity secret dependency if still useful

### Task 2: Content fetch layer

- [ ] Add `lib/content/fetch.ts` with same public getters; non-gallery → mocks; gallery → Prisma or mocks
- [ ] Update all imports from `@/lib/sanity/fetch` → `@/lib/content/fetch`
- [ ] Replace `tests/lib/sanity-fetch.test.ts` with `tests/lib/content-fetch.test.ts`
- [ ] Remove `tests/lib/env.test.ts` Sanity cases or retarget

### Task 3: Prisma GalleryImage

- [ ] Add model + migrate/push
- [ ] Map DB rows → `GalleryImage` content type

### Task 4: Blob + admin media

- [ ] `npm i @vercel/blob`
- [ ] `POST /api/admin/media` multipart upload; `DELETE` by id
- [ ] `/admin/media` UI: multi-file + category + list
- [ ] Link from `/admin`; nav Media
- [ ] `next.config.ts` remotePatterns for `*.public.blob.vercel-storage.com`
- [ ] Document `BLOB_READ_WRITE_TOKEN` in `.env.example`

### Task 5: Verify

- [ ] `npm test`
- [ ] `npm run build`
