"use client";

import Link from "next/link";

import { SafeImage } from "@/components/media/safe-image";
import {
  RevealOnScroll,
  StaggerItem,
  StaggerReveal,
} from "@/components/motion/reveal-on-scroll";
import type { GalleryImage } from "@/lib/types/content";

type FeaturedStripProps = {
  images: GalleryImage[];
};

export function FeaturedStrip({ images }: FeaturedStripProps) {
  if (images.length === 0) {
    return null;
  }

  const [heroImage, ...rest] = images;
  const sideImages = rest.slice(0, 3);

  return (
    <section className="border-t border-border/70 px-6 py-24 sm:px-10 sm:py-32 lg:px-16">
      <RevealOnScroll className="mx-auto max-w-[100rem]">
        <div className="mb-14 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[0.7rem] font-medium tracking-[0.35em] text-muted-foreground uppercase">
              Selected stories
            </p>
            <h2 className="font-display mt-4 text-[clamp(2.5rem,5vw,4rem)] leading-none font-medium tracking-[-0.02em]">
              Featured work
            </h2>
          </div>
          <Link
            href="/gallery"
            className="group inline-flex items-center gap-3 text-[0.7rem] font-semibold tracking-[0.24em] uppercase transition-colors hover:text-brass"
          >
            Explore gallery
            <span
              aria-hidden
              className="block h-px w-8 bg-current transition-all duration-300 group-hover:w-14"
            />
          </Link>
        </div>

        <StaggerReveal className="grid gap-3 lg:grid-cols-12 lg:gap-4">
          {heroImage ? (
            <StaggerItem className="lg:col-span-7">
              <Link
                href="/gallery"
                data-cursor="gallery"
                className="group relative block aspect-[4/5] overflow-hidden bg-secondary sm:aspect-[5/4] lg:aspect-auto lg:min-h-[36rem]"
                aria-label={`View ${heroImage.title} in the gallery`}
              >
                <SafeImage
                  src={heroImage.src}
                  alt={heroImage.alt}
                  fill
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover transition duration-[900ms] ease-out group-hover:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
                <div className="image-veil opacity-80" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <p className="text-[0.65rem] tracking-[0.28em] text-white/65 uppercase">
                    Feature
                  </p>
                  <p className="font-display mt-2 text-2xl text-white sm:text-3xl">
                    {heroImage.title}
                  </p>
                </div>
              </Link>
            </StaggerItem>
          ) : null}

          <StaggerItem className="grid gap-3 sm:grid-cols-3 lg:col-span-5 lg:grid-cols-1 lg:gap-4">
            {sideImages.map((image) => (
              <Link
                key={image._id}
                href="/gallery"
                data-cursor="gallery"
                className="group relative block aspect-[3/4] overflow-hidden bg-secondary lg:aspect-[16/10]"
                aria-label={`View ${image.title} in the gallery`}
              >
                <SafeImage
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 1024px) 35vw, (min-width: 640px) 33vw, 100vw"
                  className="object-cover transition duration-[900ms] ease-out group-hover:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
                <span className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/25" />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent px-5 pt-16 pb-4 text-sm text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:opacity-100">
                  {image.title}
                </span>
              </Link>
            ))}
          </StaggerItem>
        </StaggerReveal>
      </RevealOnScroll>
    </section>
  );
}
