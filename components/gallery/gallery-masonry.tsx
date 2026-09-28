"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { SafeImage } from "@/components/media/safe-image";
import type { GalleryImage } from "@/lib/types/content";

const CATEGORY_LABELS: Record<string, string> = {
  weddings: "Weddings",
  portraits: "Portraits",
  events: "Events",
  editorial: "Editorial",
};

const EASE = [0.22, 1, 0.36, 1] as const;

type GalleryMasonryProps = {
  images: GalleryImage[];
  onImageSelect: (index: number) => void;
};

function GalleryTile({
  image,
  index,
  onSelect,
}: {
  image: GalleryImage;
  index: number;
  onSelect: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const [mode, setMode] = useState<"boot" | "static" | "hidden" | "shown">(
    "boot",
  );

  useLayoutEffect(() => {
    if (reduceMotion) {
      setMode("static");
      return;
    }
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const onScreen = rect.top < window.innerHeight * 0.9 && rect.bottom > 0;
    setMode(onScreen ? "static" : "hidden");
  }, [reduceMotion]);

  useEffect(() => {
    if (mode === "hidden" && inView) setMode("shown");
  }, [mode, inView]);

  return (
    <motion.button
      ref={ref}
      type="button"
      initial={false}
      animate={
        mode === "hidden" ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }
      }
      transition={
        mode === "shown"
          ? {
              duration: reduceMotion ? 0 : 0.45,
              delay: reduceMotion ? 0 : Math.min(index, 8) * 0.08,
              ease: EASE,
            }
          : { duration: 0 }
      }
      onClick={onSelect}
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
        className="h-auto w-full transition-transform duration-[400ms] ease-out group-hover:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
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
    </motion.button>
  );
}

export function GalleryMasonry({
  images,
  onImageSelect,
}: GalleryMasonryProps) {
  return (
    <div className="columns-1 gap-3 sm:columns-2 sm:gap-4 lg:columns-3">
      {images.map((image, index) => (
        <GalleryTile
          key={image._id}
          image={image}
          index={index}
          onSelect={() => onImageSelect(index)}
        />
      ))}
    </div>
  );
}
