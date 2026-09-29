"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useId, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const mediaFormSchema = z.object({
  categorySlug: z.string().min(1, "Pick a category."),
  featured: z.boolean(),
  files: z
    .custom<FileList | null>((value) => value instanceof FileList)
    .refine((files) => !!files && files.length > 0, {
      message: "Choose one or more images.",
    }),
});

type MediaFormValues = z.infer<typeof mediaFormSchema>;

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
  const [images, setImages] = useState(initialImages);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const canUpload = blobReady && dbReady;

  const form = useForm<MediaFormValues>({
    resolver: zodResolver(mediaFormSchema),
    defaultValues: {
      categorySlug: categories[0]?.slug ?? "weddings",
      featured: false,
      files: null,
    },
  });

  const selectedFiles = form.watch("files");
  const fileCount = selectedFiles?.length ?? 0;

  function applyFiles(next: FileList | null) {
    form.setValue("files", next, { shouldValidate: true, shouldDirty: true });
    if (fileRef.current && !next) {
      fileRef.current.value = "";
    }
  }

  function onSubmit(values: MediaFormValues) {
    setMessage(null);
    setError(null);

    if (!values.files?.length) {
      form.setError("files", { message: "Choose one or more images." });
      return;
    }

    const body = new FormData();
    body.set("categorySlug", values.categorySlug);
    body.set("featured", values.featured ? "true" : "false");
    Array.from(values.files).forEach((file) => body.append("files", file));

    startTransition(async () => {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        body,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Upload failed");
        return;
      }
      setMessage(`Uploaded ${data.images?.length ?? 0} image(s).`);
      applyFiles(null);
      form.reset({
        categorySlug: values.categorySlug,
        featured: false,
        files: null,
      });
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
        <Card className="py-4">
          <CardContent className="text-sm text-muted-foreground">
            Connect storage before uploading:{" "}
            {!dbReady ? "set DATABASE_URL. " : null}
            {!blobReady ? "set BLOB_READ_WRITE_TOKEN (Vercel Blob)." : null}
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-xl tracking-tight">
            Upload
          </CardTitle>
          <CardDescription>
            Choose a category, optionally feature on home, then drop images.
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-8">
              <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
                <FormField
                  control={form.control}
                  name="categorySlug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="type-label text-muted-foreground">
                        Category
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!canUpload || pending}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              key={category._id}
                              value={category.slug}
                            >
                              {category.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-3 rounded-[10px] border border-[rgba(148,176,224,0.14)] bg-[#0b101a]/60 px-4 py-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) =>
                            field.onChange(checked === true)
                          }
                          disabled={!canUpload || pending}
                        />
                      </FormControl>
                      <FormLabel className="cursor-pointer font-normal text-muted-foreground">
                        Mark as featured
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="files"
                render={() => (
                  <FormItem>
                    <FormLabel className="type-label text-muted-foreground">
                      Images
                    </FormLabel>
                    <FormControl>
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
                          "mt-1 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[14px] border border-dashed px-6 py-12 text-center transition-colors",
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
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="pointer-events-none rounded-full"
                          tabIndex={-1}
                        >
                          Choose files
                        </Button>
                        {fileCount > 0 ? (
                          <span className="text-sm text-foreground">
                            {fileCount} file{fileCount === 1 ? "" : "s"} selected
                          </span>
                        ) : null}
                      </label>
                    </FormControl>
                    <input
                      ref={fileRef}
                      id={fileInputId}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      multiple
                      className="sr-only"
                      disabled={!canUpload || pending}
                      onChange={(e) => applyFiles(e.target.files)}
                    />
                    <FormDescription>
                      Files upload to Vercel Blob and appear in the gallery.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter className="flex flex-wrap items-center gap-4 border-t border-[rgba(148,176,224,0.08)] pt-6">
              <Button
                type="submit"
                disabled={!canUpload || pending}
                className="rounded-full bg-accent px-6 text-[#06101f] hover:bg-[#86adf7] hover:text-[#06101f]"
              >
                {pending ? "Working…" : "Upload"}
              </Button>
              {message ? (
                <p className="text-sm text-accent">{message}</p>
              ) : null}
              {error ? (
                <p className="text-sm text-destructive">{error}</p>
              ) : null}
            </CardFooter>
          </form>
        </Form>
      </Card>

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
          <Card className="mt-6 py-4">
            <CardContent className="text-sm text-muted-foreground">
              No uploaded images yet. Gallery will show mock photos until you
              upload.
            </CardContent>
          </Card>
        ) : (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image) => (
              <li key={image.id}>
                <Card className="overflow-hidden py-0 gap-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.url}
                    alt={image.title}
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <CardContent className="space-y-3 py-4">
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
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      disabled={pending}
                      onClick={() => onDelete(image.id)}
                    >
                      Delete
                    </Button>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
