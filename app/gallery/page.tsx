import type { Metadata } from "next";

import { GalleryView } from "@/components/gallery/gallery-view";
import { getCategories, getGalleryImages } from "@/lib/sanity/fetch";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Explore wedding, portrait, event, and editorial photography.",
};

export default async function GalleryPage() {
  const [categories, images] = await Promise.all([
    getCategories(),
    getGalleryImages(),
  ]);

  return (
    <main className="px-4 py-16 md:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
          Selected work
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-medium tracking-tight md:text-6xl">
          Gallery
        </h1>
        <GalleryView categories={categories} images={images} />
      </div>
    </main>
  );
}
