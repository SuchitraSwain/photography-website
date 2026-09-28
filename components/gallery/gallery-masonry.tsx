"use client";

import { SafeImage } from "@/components/media/safe-image";
import type { GalleryImage } from "@/lib/types/content";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

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
  index,
  onSelect,
}: {
  image: GalleryImage;
  index: number;
  onSelect: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setPlay(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" },
    );
    observer.observe(node);

    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setPlay(true);
      observer.disconnect();
    }

    const timeout = window.setTimeout(() => setPlay(true), 1500);

    return () => {
      observer.disconnect();
      window.clearTimeout(timeout);
    };
  }, []);

  return (
    <button
      ref={ref}
      type="button"
      onClick={onSelect}
      aria-label={`Open ${image.title} in lightbox`}
      className={cn(
        "group relative mb-3 block w-full break-inside-avoid overflow-hidden bg-secondary text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:mb-4 motion-reveal",
        play && "motion-reveal-play",
      )}
      style={
        {
          "--motion-delay": `${Math.min(index, 8) * 0.08}s`,
        } as React.CSSProperties
      }
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
    </button>
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
