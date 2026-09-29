import type { Metadata } from "next";

import { GalleryView } from "@/components/gallery/gallery-view";
import { getCategories, getGalleryImages } from "@/lib/content/fetch";

/** Refresh CMS-backed content every 5 minutes (see CONTENT_REVALIDATE_SECONDS). */
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Browse ATELIER’s curated gallery of weddings, portraits, events, and editorial photography.",
};

export default async function GalleryPage() {
  const [categories, images] = await Promise.all([
    getCategories(),
    getGalleryImages(),
  ]);

  return (
    <main className="px-4 py-16 md:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="type-label">Selected work</p>
        <h1 className="type-title mt-3">Gallery</h1>
        <GalleryView categories={categories} images={images} />
      </div>
    </main>
  );
}
