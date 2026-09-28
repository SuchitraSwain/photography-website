"use client";

import { useMemo, useState } from "react";

import { GalleryFilters } from "@/components/gallery/gallery-filters";
import { GalleryMasonry } from "@/components/gallery/gallery-masonry";
import { Lightbox } from "@/components/gallery/lightbox";
import type { Category, GalleryImage } from "@/lib/types/content";
import { cn } from "@/lib/utils";

type GalleryViewProps = {
  categories: Category[];
  images: GalleryImage[];
};

export function filterGalleryImages(
  images: GalleryImage[],
  activeFilter: string,
) {
  if (activeFilter === "all") {
    return images;
  }

  return images.filter((image) => image.categorySlug === activeFilter);
}

export function getAdjacentImageIndex(
  currentIndex: number,
  direction: -1 | 1,
  imageCount: number,
) {
  if (imageCount === 0) {
    return 0;
  }

  return (currentIndex + direction + imageCount) % imageCount;
}

export function GalleryView({ categories, images }: GalleryViewProps) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [gridKey, setGridKey] = useState(0);

  const filteredImages = useMemo(
    () => filterGalleryImages(images, activeFilter),
    [activeFilter, images],
  );
  const selectedImage = filteredImages[selectedIndex] ?? null;

  function changeFilter(slug: string) {
    setLightboxOpen(false);
    setSelectedIndex(0);
    setActiveFilter(slug);
    setGridKey((k) => k + 1);
  }

  function openImage(index: number) {
    setSelectedIndex(index);
    setLightboxOpen(true);
  }

  function navigate(direction: -1 | 1) {
    setSelectedIndex((currentIndex) =>
      getAdjacentImageIndex(currentIndex, direction, filteredImages.length),
    );
  }

  return (
    <div className="mt-10">
      <GalleryFilters
        categories={categories}
        activeFilter={activeFilter}
        onFilterChange={changeFilter}
      />

      <div className="relative mt-8 min-h-[20rem]">
        <div
          key={gridKey}
          className={cn("motion-fade")}
        >
          {filteredImages.length > 0 ? (
            <GalleryMasonry
              images={filteredImages}
              onImageSelect={openImage}
            />
          ) : (
            <p className="py-20 text-center text-sm text-muted-foreground">
              No images are available in this category yet.
            </p>
          )}
        </div>
      </div>

      <Lightbox
        image={selectedImage}
        position={selectedIndex}
        total={filteredImages.length}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        onPrevious={() => navigate(-1)}
        onNext={() => navigate(1)}
      />
    </div>
  );
}
