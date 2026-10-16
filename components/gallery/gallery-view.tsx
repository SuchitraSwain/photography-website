"use client";

import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

import { GalleryFilters } from "@/components/gallery/gallery-filters";
import { GalleryMasonry } from "@/components/gallery/gallery-masonry";
import { Lightbox } from "@/components/gallery/lightbox";
import type { Category, GalleryImage } from "@/lib/types/content";
import { cn } from "@/lib/utils";

type GalleryViewProps = {
  categories: Category[];
  images: GalleryImage[];
};

/** Keep the public gallery light: show a random subset on each visit. */
export const GALLERY_VISIBLE_COUNT = 10;

export function shuffleGalleryImages(images: GalleryImage[]): GalleryImage[] {
  const next = [...images];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const a = next[i]!;
    const b = next[j]!;
    next[i] = b;
    next[j] = a;
  }
  return next;
}

export function filterGalleryImages(
  images: GalleryImage[],
  activeFilter: string,
) {
  if (activeFilter === "all") {
    return images;
  }

  return images.filter((image) => image.categorySlug === activeFilter);
}

export function pickGalleryImages(
  images: GalleryImage[],
  activeFilter: string,
  limit = GALLERY_VISIBLE_COUNT,
) {
  const filtered = filterGalleryImages(images, activeFilter);
  // Only the All tab is capped + shuffled; category tabs show the full set.
  if (activeFilter !== "all") {
    return filtered;
  }
  return shuffleGalleryImages(filtered).slice(0, limit);
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
  const t = useTranslations("gallery");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [gridKey, setGridKey] = useState(0);
  // Stable first paint (SSR/hydration), then reshuffle on the client.
  const [visibleImages, setVisibleImages] = useState(() =>
    filterGalleryImages(images, "all").slice(0, GALLERY_VISIBLE_COUNT),
  );

  useEffect(() => {
    setVisibleImages(pickGalleryImages(images, activeFilter));
    setSelectedIndex(0);
    setGridKey((k) => k + 1);
  }, [images, activeFilter]);

  const selectedImage = useMemo(
    () => visibleImages[selectedIndex] ?? null,
    [selectedIndex, visibleImages],
  );

  function changeFilter(slug: string) {
    setLightboxOpen(false);
    setActiveFilter(slug);
  }

  function openImage(index: number) {
    setSelectedIndex(index);
    setLightboxOpen(true);
  }

  function navigate(direction: -1 | 1) {
    setSelectedIndex((currentIndex) =>
      getAdjacentImageIndex(currentIndex, direction, visibleImages.length),
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
        <div key={gridKey} className={cn("motion-fade")}>
          {visibleImages.length > 0 ? (
            <GalleryMasonry
              images={visibleImages}
              onImageSelect={openImage}
            />
          ) : (
            <p className="py-20 text-center text-sm text-muted-foreground">
              {t("empty")}
            </p>
          )}
        </div>
      </div>

      <Lightbox
        image={selectedImage}
        position={selectedIndex}
        total={visibleImages.length}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        onPrevious={() => navigate(-1)}
        onNext={() => navigate(1)}
      />
    </div>
  );
}
