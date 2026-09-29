import { del, put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/booking/require-admin";
import { GALLERY_CATEGORY_SLUGS } from "@/lib/content/fetch";
import { isDatabaseConfigured, prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILE_BYTES = 12 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function isBlobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 120) || "image.jpg";
}

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  if (!isDatabaseConfigured()) {
    return NextResponse.json({ images: [], reason: "DATABASE_URL is not set" });
  }

  const images = await prisma.galleryImage.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json({ images });
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "DATABASE_URL is not set" },
      { status: 501 },
    );
  }

  if (!isBlobConfigured()) {
    return NextResponse.json(
      { error: "BLOB_READ_WRITE_TOKEN is not set" },
      { status: 501 },
    );
  }

  const form = await request.formData();
  const categorySlug = String(form.get("categorySlug") ?? "");
  const featured = String(form.get("featured") ?? "") === "true";

  if (!GALLERY_CATEGORY_SLUGS.includes(categorySlug)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }

  const files = form
    .getAll("files")
    .filter((value): value is File => value instanceof File && value.size > 0);

  if (files.length === 0) {
    return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
  }

  const created = [];

  for (const file of files) {
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: `Unsupported type: ${file.type || file.name}` },
        { status: 400 },
      );
    }
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { error: `File too large (max 12MB): ${file.name}` },
        { status: 400 },
      );
    }

    const pathname = `gallery/${categorySlug}/${Date.now()}-${sanitizeFilename(file.name)}`;
    const blob = await put(pathname, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type,
    });

    const title = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
    const row = await prisma.galleryImage.create({
      data: {
        title,
        alt: title,
        url: blob.url,
        pathname: blob.pathname,
        categorySlug,
        featured,
        published: true,
      },
    });
    created.push(row);
  }

  revalidatePath("/gallery");
  revalidatePath("/");

  return NextResponse.json({ ok: true, images: created });
}

export async function DELETE(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "DATABASE_URL is not set" },
      { status: 501 },
    );
  }

  const body = (await request.json().catch(() => null)) as { id?: string } | null;
  const id = body?.id?.trim();
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const existing = await prisma.galleryImage.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (isBlobConfigured()) {
    try {
      await del(existing.url);
    } catch (err) {
      console.error("[admin/media] blob delete failed", err);
    }
  }

  await prisma.galleryImage.delete({ where: { id } });
  revalidatePath("/gallery");
  revalidatePath("/");

  return NextResponse.json({ ok: true });
}
