"use client";

import { useReducedMotion } from "framer-motion";

import {
  StaggerItem,
  StaggerReveal,
} from "@/components/motion/reveal-on-scroll";
import { SafeImage } from "@/components/media/safe-image";
import { GALLERY_CATEGORY_LABELS } from "@/lib/content/categories";
import type { GalleryImage } from "@/lib/types/content";

type GalleryMasonryProps = {
  images: GalleryImage[];
  onImageSelect: (index: number) => void;
};

function GalleryTile({
  image,
  onSelect,
  priority,
}: {
  image: GalleryImage;
  onSelect: () => void;
  priority?: boolean;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <StaggerItem className="mb-3 break-inside-avoid sm:mb-4">
      <button
        type="button"
        onClick={onSelect}
        data-cursor="gallery"
        aria-label={`Open ${image.title} in lightbox`}
        className="group relative block w-full overflow-hidden rounded-[12px] bg-[#0b101a] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 animate-pulse bg-gradient-to-br from-[#0b101a] via-[#152035] to-[#0b101a]"
        />
        <SafeImage
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          blurDataURL={image.lqip}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          className={
            reduceMotion
              ? "relative z-[1] h-auto w-full"
              : "relative z-[1] h-auto w-full transition-transform duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.04]"
          }
        />
        <span className="absolute inset-0 z-[2] bg-black/0 transition-colors duration-[350ms] group-hover:bg-black/35 motion-reduce:transition-none" />
        <span className="absolute inset-x-0 bottom-0 z-[3] translate-y-3 bg-gradient-to-t from-black/85 via-black/35 to-transparent px-5 pt-24 pb-5 opacity-0 transition-all duration-[350ms] ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none">
          <span className="block text-[0.65rem] tracking-[0.2em] text-white/70 uppercase">
            {GALLERY_CATEGORY_LABELS[image.categorySlug] ?? image.categorySlug}
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
      stagger={0.06}
    >
      {images.map((image, index) => (
        <GalleryTile
          key={image._id}
          image={image}
          priority={index < 6}
          onSelect={() => onImageSelect(index)}
        />
      ))}
    </StaggerReveal>
  );
}
