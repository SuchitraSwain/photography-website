"use client";

import { motion } from "framer-motion";

import { SafeImage } from "@/components/media/safe-image";
import type { GalleryImage } from "@/lib/types/content";

const CATEGORY_LABELS: Record<string, string> = {
  weddings: "Weddings",
  portraits: "Portraits",
  events: "Events",
  editorial: "Editorial",
};

type GalleryMasonryProps = {
  images: GalleryImage[];
  onImageSelect: (index: number) => void;
};

export function GalleryMasonry({
  images,
  onImageSelect,
}: GalleryMasonryProps) {
  return (
    <div className="columns-1 gap-3 sm:columns-2 sm:gap-4 lg:columns-3">
      {images.map((image, index) => (
        <motion.button
          key={image._id}
          type="button"
          layout
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: Math.min(index, 12) * 0.04 }}
          onClick={() => onImageSelect(index)}
          aria-label={`Open ${image.title} in lightbox`}
          className="group relative mb-3 block w-full break-inside-avoid overflow-hidden bg-secondary text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:mb-4"
        >
          <SafeImage
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            blurDataURL={image.lqip}
            className="h-auto w-full transition duration-[800ms] ease-out group-hover:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
          <span className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/35 motion-reduce:transition-none" />
          <span className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-black/85 via-black/35 to-transparent px-5 pt-24 pb-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none">
            <span className="block text-[0.65rem] tracking-[0.2em] text-white/70 uppercase">
              {CATEGORY_LABELS[image.categorySlug] ?? image.categorySlug}
            </span>
            <span className="mt-1 block text-[0.7rem] tracking-[0.18em] text-white uppercase">
              {image.title}
            </span>
          </span>
        </motion.button>
      ))}
    </div>
  );
}
