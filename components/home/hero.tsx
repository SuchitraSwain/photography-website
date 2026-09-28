"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type HeroProps = {
  brandName: string;
  tagline: string;
  images: Array<{ src: string; alt: string; lqip?: string }>;
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
    }, 6500);

    return () => window.clearInterval(interval);
  }, [images.length]);

  return (
    <section className="relative isolate -mt-16 min-h-[100svh] overflow-hidden bg-black text-white">
      <div className="absolute inset-0" aria-hidden={images.length === 0}>
        {images.map((image, index) => (
          <Image
            key={`${image.src}-${index}`}
            src={image.src}
            alt={index === activeImage ? image.alt : ""}
            fill
            priority={index === 0}
            sizes="100vw"
            placeholder={image.lqip ? "blur" : "empty"}
            blurDataURL={image.lqip}
            className={`object-cover transition-[opacity,transform] duration-[2000ms] ease-out motion-reduce:transition-opacity ${
              index === activeImage
                ? "scale-105 opacity-100 motion-reduce:scale-100"
                : "scale-100 opacity-0"
            }`}
          />
        ))}
      </div>

      <div className="image-veil" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/20" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-[100rem] flex-col justify-end px-6 pb-12 pt-28 sm:px-10 sm:pb-16 lg:px-16 lg:pb-20">
        <p className="mb-6 max-w-md text-[0.7rem] font-medium tracking-[0.42em] text-white/70 uppercase sm:text-xs">
          {tagline}
        </p>

        <h1 className="font-display max-w-[18ch] text-[clamp(4.5rem,16vw,14rem)] leading-[0.78] font-medium tracking-[-0.04em] text-white uppercase">
          {brandName}
        </h1>

        <div className="mt-12 grid gap-10 border-t border-white/25 pt-8 md:grid-cols-[minmax(0,1.2fr)_auto] md:items-end">
          <p className="max-w-md text-base leading-relaxed text-white/78 sm:text-lg">
            Photography for people who want the frame to feel like memory —
            unhurried, intimate, and unforgettable.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/gallery"
              className="inline-flex h-12 items-center justify-center bg-white px-8 text-[0.7rem] font-semibold tracking-[0.22em] text-black uppercase transition-colors hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              View work
            </Link>
            <Link
              href="/booking"
              className="inline-flex h-12 items-center justify-center border border-white/80 px-8 text-[0.7rem] font-semibold tracking-[0.22em] text-white uppercase transition-colors hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Book now
            </Link>
          </div>
        </div>

        {images.length > 1 ? (
          <div
            className="mt-10 flex items-center gap-2"
            aria-label="Featured image indicators"
          >
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Show image ${index + 1}`}
                aria-current={index === activeImage}
                onClick={() => setActiveImage(index)}
                className={`h-px transition-all duration-500 ${
                  index === activeImage
                    ? "w-10 bg-white"
                    : "w-5 bg-white/35 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
