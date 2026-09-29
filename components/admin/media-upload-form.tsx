"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import type { Category } from "@/lib/types/content";

type AdminImage = {
  id: string;
  title: string;
  url: string;
  categorySlug: string;
  featured: boolean;
  published: boolean;
  createdAt: string;
};

export function MediaUploadForm({
  categories,
  initialImages,
  blobReady,
  dbReady,
}: {
  categories: Category[];
  initialImages: AdminImage[];
  blobReady: boolean;
  dbReady: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [categorySlug, setCategorySlug] = useState(
    categories[0]?.slug ?? "weddings",
  );
  const [featured, setFeatured] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const [images, setImages] = useState(initialImages);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canUpload = blobReady && dbReady;

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    if (!files?.length) {
      setError("Choose one or more images.");
      return;
    }

    const form = new FormData();
    form.set("categorySlug", categorySlug);
    form.set("featured", featured ? "true" : "false");
    Array.from(files).forEach((file) => form.append("files", file));

    startTransition(async () => {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: form,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Upload failed");
        return;
      }
      setMessage(`Uploaded ${data.images?.length ?? 0} image(s).`);
      setFiles(null);
      router.refresh();
      const list = await fetch("/api/admin/media").then((r) => r.json());
      if (Array.isArray(list.images)) setImages(list.images);
    });
  }

  async function onDelete(id: string) {
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/admin/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Delete failed");
        return;
      }
      setImages((prev) => prev.filter((img) => img.id !== id));
      router.refresh();
    });
  }

  return (
    <div className="space-y-10">
      {!canUpload ? (
        <p className="rounded-md border border-border px-4 py-3 text-sm text-muted-foreground">
          Connect storage before uploading:{" "}
          {!dbReady ? "set DATABASE_URL. " : null}
          {!blobReady ? "set BLOB_READ_WRITE_TOKEN (Vercel Blob)." : null}
        </p>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="text-muted-foreground">Category</span>
            <select
              className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2"
              value={categorySlug}
              onChange={(e) => setCategorySlug(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category._id} value={category.slug}>
                  {category.title}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-end gap-2 pb-2 text-sm">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />
            Mark as featured (home)
          </label>
        </div>

        <label className="block text-sm">
          <span className="text-muted-foreground">Images (multi-select)</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="mt-2 block w-full text-sm"
            onChange={(e) => setFiles(e.target.files)}
          />
        </label>

        <Button type="submit" disabled={!canUpload || pending}>
          {pending ? "Working…" : "Upload"}
        </Button>

        {message ? (
          <p className="text-sm text-[color:var(--accent)]">{message}</p>
        ) : null}
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </form>

      <section>
        <h2 className="font-[family-name:var(--font-display)] text-2xl">
          Library
        </h2>
        {images.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            No uploaded images yet. Gallery will show mock photos until you
            upload.
          </p>
        ) : (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image) => (
              <li
                key={image.id}
                className="surface-card overflow-hidden"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.url}
                  alt={image.title}
                  className="aspect-[4/3] w-full object-cover"
                />
                <div className="space-y-2 p-3 text-sm">
                  <p className="font-medium">{image.title || "Untitled"}</p>
                  <p className="text-muted-foreground">
                    {image.categorySlug}
                    {image.featured ? " · featured" : ""}
                    {!image.published ? " · draft" : ""}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={pending}
                    onClick={() => onDelete(image.id)}
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
