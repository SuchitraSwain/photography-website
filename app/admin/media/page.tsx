import { MediaUploadForm } from "@/components/admin/media-upload-form";
import { requireAdmin } from "@/lib/booking/require-admin";
import { getCategories } from "@/lib/content/fetch";
import { isDatabaseConfigured, prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const { error } = await requireAdmin();
  if (error) {
    redirect("/admin/sign-in?callbackUrl=/admin/media");
  }

  const categories = await getCategories();
  const dbReady = isDatabaseConfigured();
  const blobReady = Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());

  const images = dbReady
    ? await prisma.galleryImage.findMany({
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      })
    : [];

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
      <p className="type-label">Admin</p>
      <h1 className="type-title mt-3">Media</h1>
      <p className="type-lead">
        Upload gallery images to Vercel Blob. Pick a category, then select one
        or many files.
      </p>
      <div className="mt-12">
        <MediaUploadForm
          categories={categories}
          blobReady={blobReady}
          dbReady={dbReady}
          initialImages={images.map((image) => ({
            id: image.id,
            title: image.title,
            url: image.url,
            categorySlug: image.categorySlug,
            featured: image.featured,
            published: image.published,
            createdAt: image.createdAt.toISOString(),
          }))}
        />
      </div>
    </main>
  );
}
