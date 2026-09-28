import Image from "next/image";
import Link from "next/link";

import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import type { GalleryImage } from "@/lib/types/content";

type FeaturedStripProps = {
  images: GalleryImage[];
};

export function FeaturedStrip({ images }: FeaturedStripProps) {
  if (images.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-border px-6 py-20 sm:px-10 sm:py-28 lg:px-14">
      <RevealOnScroll className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
              Selected stories
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-medium tracking-tight sm:text-5xl">
              Featured work
            </h2>
          </div>
          <Link
            href="/gallery"
            className="hidden border-b border-foreground pb-1 text-sm font-medium transition-opacity hover:opacity-60 sm:inline-block"
          >
            Explore gallery
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {images.map((image, index) => (
            <Link
              key={image._id}
              href="/gallery"
              className={`group relative block overflow-hidden bg-secondary ${
                index % 3 === 1 ? "aspect-[4/5]" : "aspect-[3/4]"
              }`}
              aria-label={`View ${image.title} in the gallery`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition duration-700 ease-out group-hover:scale-[1.025] group-hover:opacity-90 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-5 pt-16 pb-5 text-sm text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                {image.title}
              </span>
            </Link>
          ))}
        </div>

        <Link
          href="/gallery"
          className="mt-8 inline-block border-b border-foreground pb-1 text-sm font-medium transition-opacity hover:opacity-60 sm:hidden"
        >
          Explore gallery
        </Link>
      </RevealOnScroll>
    </section>
  );
}
