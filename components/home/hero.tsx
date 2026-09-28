"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

import { SafeImage } from "@/components/media/safe-image";

type HeroProps = {
  brandName: string;
  tagline: string;
  images: Array<{ src: string; alt: string; lqip?: string }>;
};

/**
 * Hero load-in uses CSS keyframes (not set-hidden-then-show) so the first
 * paint never flashes visible → invisible → visible.
 */
export function Hero({ brandName, tagline, images }: HeroProps) {
  const [activeImage, setActiveImage] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion || images.length < 2) return;
    const interval = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % images.length);
    }, 6500);
    return () => window.clearInterval(interval);
  }, [images.length, reduceMotion]);

  return (
    <section className="relative isolate -mt-16 min-h-[100svh] overflow-hidden bg-black text-white">
      <div className="absolute inset-0" aria-hidden={images.length === 0}>
        {images.map((image, index) => (
          <motion.div
            key={`${image.src}-${index}`}
            className="absolute inset-0"
            initial={false}
            animate={{
              opacity: index === activeImage ? 1 : 0,
            }}
            transition={{
              opacity: { duration: reduceMotion ? 0 : 1.2, ease: "easeInOut" },
            }}
          >
            <SafeImage
              src={image.src}
              alt={index === activeImage ? image.alt : ""}
              fill
              priority={index === 0}
              sizes="100vw"
              blurDataURL={image.lqip}
              className="object-cover"
            />
          </motion.div>
        ))}
      </div>

      <div className="image-veil" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/20" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-[100rem] flex-col justify-end px-6 pb-12 pt-28 sm:px-10 sm:pb-16 lg:px-16 lg:pb-20">
        <h1
          className="hero-rise font-display max-w-[18ch] text-[clamp(4.5rem,16vw,14rem)] leading-[0.78] font-medium tracking-[-0.04em] text-white uppercase"
          style={{ animationDelay: "0ms" }}
        >
          {brandName}
        </h1>

        <p
          className="hero-rise mt-6 max-w-md text-[0.7rem] font-medium tracking-[0.42em] text-white/70 uppercase sm:text-xs"
          style={{ animationDelay: "150ms" }}
        >
          {tagline}
        </p>

        <p
          className="hero-rise mt-8 max-w-md text-base leading-relaxed text-white/78 sm:text-lg"
          style={{ animationDelay: "300ms" }}
        >
          Some moments aren&apos;t posed. They&apos;re witnessed.
        </p>

        <div
          className="hero-rise mt-10 flex flex-col gap-4 border-t border-white/25 pt-8 sm:flex-row sm:items-center"
          style={{ animationDelay: "450ms" }}
        >
          <Link
            href="/gallery"
            className="inline-flex h-12 items-center justify-center bg-white px-8 text-[0.7rem] font-semibold tracking-[0.22em] text-black uppercase transition-transform duration-300 hover:scale-[1.03] hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:hover:scale-100"
          >
            View work
          </Link>
          <Link
            href="/booking"
            className="inline-flex h-12 items-center justify-center border border-white/80 px-8 text-[0.7rem] font-semibold tracking-[0.22em] text-white uppercase transition-transform duration-300 hover:scale-[1.03] hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:hover:scale-100"
          >
            Book now
          </Link>
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
