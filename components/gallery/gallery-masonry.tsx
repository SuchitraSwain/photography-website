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
    <div className="columns-1 gap-3 sm:columns-2 sm:gap-4 lg:columns-3">
      {images.map((image, index) => (
        <button
          key={image._id}
          type="button"
          onClick={() => onImageSelect(index)}
          aria-label={`Open ${image.title} in lightbox`}
          className="group relative mb-3 block w-full break-inside-avoid overflow-hidden bg-secondary text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:mb-4"
        >
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            placeholder={image.lqip ? "blur" : "empty"}
            blurDataURL={image.lqip}
            className="h-auto w-full transition duration-[800ms] ease-out group-hover:scale-[1.045] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
          <span className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/25 motion-reduce:transition-none" />
          <span className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-black/85 via-black/35 to-transparent px-5 pt-24 pb-5 text-[0.7rem] tracking-[0.18em] text-white uppercase opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none">
            {image.title}
          </span>
        </button>
      ))}
    </div>
  );
}
