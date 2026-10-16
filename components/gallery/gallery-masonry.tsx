"use client";

import { useTranslations } from "next-intl";

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
  const t = useTranslations("gallery");
  const label = GALLERY_CATEGORY_LABELS[image.categorySlug] ?? image.categorySlug;

  return (
    <button
      type="button"
      onClick={onSelect}
      data-cursor="gallery"
      aria-label={t("openPhoto", { label })}
      className="group relative aspect-[3/4] w-full overflow-hidden rounded-[10px] bg-[#111b21] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <SafeImage
        src={image.src}
        alt={image.alt}
        fill
        // Serve gallery originals directly so the image optimizer cannot
        // keep a stale sideways transform of an older file version.
        unoptimized
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        blurDataURL={image.lqip}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        className="object-cover object-center transition-transform duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />
      <span className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-[350ms] group-hover:bg-black/30 motion-reduce:transition-none" />
      <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-black/85 via-black/30 to-transparent px-3 pt-12 pb-3 opacity-0 transition-all duration-[350ms] ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none">
        <span className="block text-[0.8rem] font-semibold tracking-[0.14em] text-white/90 uppercase">
          {label}
        </span>
      </span>
    </button>
  );
}

export function GalleryMasonry({
  images,
  onImageSelect,
}: GalleryMasonryProps) {
  // Equal 3:4 tiles keep the grid even (no ragged CSS-column gaps).
  // Full native framing still shows in the lightbox.
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3">
      {images.map((image, index) => (
        <GalleryTile
          key={image._id}
          image={image}
          priority={index < 6}
          onSelect={() => onImageSelect(index)}
        />
      ))}
    </div>
  );
}
