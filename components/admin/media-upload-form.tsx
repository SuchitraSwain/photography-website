"use client";

import { useRouter } from "next/navigation";
import { useId, useRef, useState, useTransition } from "react";

import { cn } from "@/lib/utils";
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
  const fileInputId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [categorySlug, setCategorySlug] = useState(
    categories[0]?.slug ?? "weddings",
  );
  const [featured, setFeatured] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const [images, setImages] = useState(initialImages);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const canUpload = blobReady && dbReady;
  const fileCount = files?.length ?? 0;

  function applyFiles(next: FileList | null) {
    setFiles(next);
    if (fileRef.current && !next) {
      fileRef.current.value = "";
    }
  }

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
      applyFiles(null);
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
    <div className="space-y-12">
      {!canUpload ? (
        <p className="surface-card px-5 py-4 text-sm text-muted-foreground">
          Connect storage before uploading:{" "}
          {!dbReady ? "set DATABASE_URL. " : null}
          {!blobReady ? "set BLOB_READ_WRITE_TOKEN (Vercel Blob)." : null}
        </p>
      ) : null}

      <form onSubmit={onSubmit} className="surface-card space-y-8 p-6 md:p-8">
        <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
          <label className="block">
            <span className="type-label">Category</span>
            <select
              className="mt-3 w-full appearance-none rounded-[10px] border border-[rgba(148,176,224,0.14)] bg-[#0b101a] px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent/50"
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

          <label className="flex cursor-pointer items-center gap-3 rounded-[10px] border border-[rgba(148,176,224,0.14)] bg-[#0b101a]/60 px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-accent/40 hover:text-foreground">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="size-4 accent-[hsl(var(--accent))]"
            />
            Mark as featured
          </label>
        </div>

        <div>
          <span className="type-label">Images</span>
          <label
            htmlFor={fileInputId}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              if (e.dataTransfer.files?.length) {
                applyFiles(e.dataTransfer.files);
              }
            }}
            className={cn(
              "mt-3 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[14px] border border-dashed px-6 py-12 text-center transition-colors",
              dragOver
                ? "border-accent bg-accent/10"
                : "border-[rgba(148,176,224,0.22)] bg-[#0b101a]/50 hover:border-accent/50",
            )}
          >
            <span className="font-mono-nav text-[0.72rem] tracking-[0.14em] text-accent uppercase">
              Drop images here
            </span>
            <span className="max-w-sm text-sm text-muted-foreground">
              JPEG, PNG, WebP, or GIF · multi-select supported
            </span>
            <span className="pill-cta pointer-events-none py-2 text-[0.68rem]">
              Choose files
            </span>
            {fileCount > 0 ? (
              <span className="text-sm text-foreground">
                {fileCount} file{fileCount === 1 ? "" : "s"} selected
              </span>
            ) : null}
          </label>
          <input
            ref={fileRef}
            id={fileInputId}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="sr-only"
            onChange={(e) => applyFiles(e.target.files)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={!canUpload || pending}
            className="pill-cta-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? "Working…" : "Upload"}
          </button>
          {message ? (
            <p className="text-sm text-accent">{message}</p>
          ) : null}
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>
      </form>

      <section>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="type-label">Library</p>
            <h2 className="font-display mt-2 text-[clamp(1.6rem,2.6vw,2.2rem)] text-foreground">
              Uploaded images
            </h2>
          </div>
          <p className="font-mono-nav text-[0.65rem] tracking-[0.14em] text-muted-foreground uppercase">
            {images.length} item{images.length === 1 ? "" : "s"}
          </p>
        </div>

        {images.length === 0 ? (
          <p className="surface-card mt-6 px-5 py-8 text-sm text-muted-foreground">
            No uploaded images yet. Gallery will show mock photos until you
            upload.
          </p>
        ) : (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image) => (
              <li key={image.id} className="surface-card overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.url}
                  alt={image.title}
                  className="aspect-[4/3] w-full object-cover"
                />
                <div className="space-y-3 p-4">
                  <div>
                    <p className="font-medium text-foreground">
                      {image.title || "Untitled"}
                    </p>
                    <p className="mt-1 font-mono-nav text-[0.65rem] tracking-[0.12em] text-muted-foreground uppercase">
                      {image.categorySlug}
                      {image.featured ? " · featured" : ""}
                      {!image.published ? " · draft" : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => onDelete(image.id)}
                    className="pill-cta py-2 text-[0.65rem] disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
