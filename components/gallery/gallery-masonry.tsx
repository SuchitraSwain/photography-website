"use client";

import { useReducedMotion } from "framer-motion";

import {
  StaggerItem,
  StaggerReveal,
} from "@/components/motion/reveal-on-scroll";
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

function GalleryTile({
  image,
  onSelect,
}: {
  image: GalleryImage;
  onSelect: () => void;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <StaggerItem className="mb-3 break-inside-avoid sm:mb-4">
      <button
        type="button"
        onClick={onSelect}
        data-cursor="gallery"
        aria-label={`Open ${image.title} in lightbox`}
        className="group relative block w-full overflow-hidden bg-secondary text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <SafeImage
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          blurDataURL={image.lqip}
          className={
            reduceMotion
              ? "h-auto w-full"
              : "h-auto w-full transition-transform duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.04]"
          }
        />
        <span className="absolute inset-0 bg-black/0 transition-colors duration-[350ms] group-hover:bg-black/35 motion-reduce:transition-none" />
        <span className="absolute inset-x-0 bottom-0 translate-y-3 bg-gradient-to-t from-black/85 via-black/35 to-transparent px-5 pt-24 pb-5 opacity-0 transition-all duration-[350ms] ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none">
          <span className="block text-[0.65rem] tracking-[0.2em] text-white/70 uppercase">
            {CATEGORY_LABELS[image.categorySlug] ?? image.categorySlug}
          </span>
          <span className="mt-1 block text-[0.7rem] tracking-[0.18em] text-white uppercase">
            {image.title}
          </span>
        </span>
      </button>
    </StaggerItem>
  );
}

export function GalleryMasonry({
  images,
  onImageSelect,
}: GalleryMasonryProps) {
  return (
    <StaggerReveal
      className="columns-1 gap-3 sm:columns-2 sm:gap-4 lg:columns-3"
      stagger={0.1}
    >
      {images.map((image, index) => (
        <GalleryTile
          key={image._id}
          image={image}
          onSelect={() => onImageSelect(index)}
        />
      ))}
    </StaggerReveal>
  );
}
