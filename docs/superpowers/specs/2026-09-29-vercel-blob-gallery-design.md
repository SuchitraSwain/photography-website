# Vercel Blob Gallery + Sanity Cleanup Design

**Date:** 2026-09-29  
**Status:** Approved (Approach A)

## Goal

Remove Sanity CMS. Store gallery images in **Vercel Blob** with metadata in **Prisma/Postgres**. Upload via authenticated `/admin/media`. Public site keeps mock/static content for About, Events, Services, and Site settings.

## Architecture

```
Admin (NextAuth allowlist)
  → POST /api/admin/media (multipart)
  → @vercel/blob put (public)
  → Prisma GalleryImage row

Gallery / Home featured
  → getGalleryImages() / getFeaturedGalleryImages()
  → Prisma published rows, else mockContent.galleryImages

Other pages
  → lib/content/fetch.ts → mockContent only
```

## Data model

`GalleryImage`: id, title, alt, url, pathname, width, height, categorySlug, featured, sortOrder, published, createdAt, updatedAt.

Categories remain the static mock list (`weddings`, `portraits`, `events`, `editorial`).

## Auth

Reuse existing Google NextAuth + `ADMIN_EMAILS`. Upload/delete APIs call `requireAdmin()`. No public unauthenticated admin.

## Env

- `BLOB_READ_WRITE_TOKEN` (Vercel Blob)
- Existing `DATABASE_URL`, `AUTH_*`, `ADMIN_EMAILS`
- Remove all `NEXT_PUBLIC_SANITY_*` / `SANITY_*`

## Out of scope

Folder-tree bulk UX, image resize pipeline, admin editing of About/Events/Services, migrating existing Sanity assets.

## Success criteria

1. `/studio` gone; Sanity packages removed; site builds without Sanity env.
2. Admin can upload multiple images with a category and see them listed.
3. Gallery shows DB images when present; otherwise mocks.
4. Unauthenticated upload API returns 401.
