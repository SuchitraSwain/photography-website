"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type HeroProps = {
  brandName: string;
  tagline: string;
  images: Array<{ src: string; alt: string }>;
};

export function Hero({ brandName, tagline, images }: HeroProps) {
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    if (reducedMotion.matches || images.length < 2) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % images.length);
    }, 6000);

    return () => window.clearInterval(interval);
  }, [images.length]);

  return (
    <section className="relative isolate min-h-[calc(100svh-4rem)] overflow-hidden bg-zinc-950 text-white">
      <div className="absolute inset-0" aria-hidden={images.length === 0}>
        {images.map((image, index) => (
          <Image
            key={`${image.src}-${index}`}
            src={image.src}
            alt={index === activeImage ? image.alt : ""}
            fill
            priority={index === 0}
            sizes="100vw"
            className={`object-cover transition-opacity duration-[1600ms] ease-in-out ${
              index === activeImage ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/15 to-black/70" />

      <div className="relative mx-auto flex min-h-[calc(100svh-4rem)] max-w-[96rem] flex-col justify-end px-6 py-14 sm:px-10 sm:py-20 lg:px-14">
        <p className="mb-5 max-w-xl text-xs font-medium tracking-[0.28em] text-white/75 uppercase sm:text-sm">
          {tagline}
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-[clamp(5rem,18vw,17rem)] leading-[0.68] font-medium tracking-[-0.055em] uppercase">
          {brandName}
        </h1>

        <div className="mt-10 flex flex-col gap-8 border-t border-white/35 pt-7 md:flex-row md:items-end md:justify-between">
          <p className="max-w-lg text-base leading-relaxed text-white/80 sm:text-lg">
            Quiet, intentional photography shaped by natural light and honest
            connection.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/gallery"
              className="inline-flex h-11 items-center justify-center border border-white bg-white px-6 text-sm font-medium text-zinc-950 transition-colors hover:bg-transparent hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              View the work
            </Link>
            <Link
              href="/booking"
              className="inline-flex h-11 items-center justify-center border border-white/70 px-6 text-sm font-medium text-white transition-colors hover:border-white hover:bg-white hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Book a session
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
