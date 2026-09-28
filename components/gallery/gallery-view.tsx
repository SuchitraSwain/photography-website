"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";

import { GalleryFilters } from "@/components/gallery/gallery-filters";
import { GalleryMasonry } from "@/components/gallery/gallery-masonry";
import { Lightbox } from "@/components/gallery/lightbox";
import type { Category, GalleryImage } from "@/lib/types/content";

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
  const reduceMotion = useReducedMotion();

  const filteredImages = useMemo(
    () => filterGalleryImages(images, activeFilter),
    [activeFilter, images],
  );
  const selectedImage = filteredImages[selectedIndex] ?? null;

  function changeFilter(slug: string) {
    setLightboxOpen(false);
    setSelectedIndex(0);
    setActiveFilter(slug);
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
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
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
          </motion.div>
        </AnimatePresence>
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
