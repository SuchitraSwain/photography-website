import Image from "next/image";

import type { GalleryImage } from "@/lib/types/content";

type GalleryMasonryProps = {
  images: GalleryImage[];
  onImageSelect: (index: number) => void;
};

export function GalleryMasonry({
  images,
  onImageSelect,
}: GalleryMasonryProps) {
  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
      {images.map((image, index) => (
        <button
          key={image._id}
          type="button"
          onClick={() => onImageSelect(index)}
          aria-label={`Open ${image.title} in lightbox`}
          className="group relative mb-4 block w-full break-inside-avoid overflow-hidden bg-secondary text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            placeholder={image.lqip ? "blur" : "empty"}
            blurDataURL={image.lqip}
            className="h-auto w-full transition duration-500 ease-out group-hover:scale-[1.015] group-hover:opacity-90"
          />
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-5 pt-20 pb-5 text-sm text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
            {image.title}
          </span>
        </button>
      ))}
    </div>
  );
}
