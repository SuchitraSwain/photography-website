"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

import { MagneticButton } from "@/components/effects/magnetic-button";
import { SafeImage } from "@/components/media/safe-image";

type HeroProps = {
  brandName: string;
  tagline: string;
  images: Array<{ src: string; alt: string; lqip?: string }>;
};

const EASE = [0.4, 0, 0.2, 1] as const;

const loadIn = {
  hidden: { opacity: 0, y: 24 },
  show: (order: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: order * 0.15,
      ease: EASE,
    },
  }),
};

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
      {/* Top scrim keeps nav readable on bright skies / light photos */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/75 via-black/35 to-transparent"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/20" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-[100rem] flex-col justify-end px-6 pb-12 pt-28 sm:px-10 sm:pb-16 lg:px-16 lg:pb-20">
        <motion.h1
          custom={0}
          variants={loadIn}
          initial={reduceMotion ? false : "hidden"}
          animate="show"
          className="font-display max-w-[18ch] text-[clamp(2.5rem,8vw,4.55rem)] leading-[0.99] font-extrabold tracking-[-0.035em] text-white"
        >
          {brandName}
        </motion.h1>

        <motion.p
          custom={1}
          variants={loadIn}
          initial={reduceMotion ? false : "hidden"}
          animate="show"
          className="font-mono-nav mt-6 max-w-md text-[0.72rem] tracking-[0.18em] text-[#97a3b8] uppercase"
        >
          {tagline}
        </motion.p>

        <motion.p
          custom={2}
          variants={loadIn}
          initial={reduceMotion ? false : "hidden"}
          animate="show"
          className="mt-8 max-w-md text-[1.08rem] leading-[1.7] text-[#97a3b8]"
        >
          Some moments aren&apos;t posed. They&apos;re witnessed.
        </motion.p>

        <motion.div
          custom={3}
          variants={loadIn}
          initial={reduceMotion ? false : "hidden"}
          animate="show"
          className="mt-10 flex flex-col gap-4 border-t border-white/20 pt-8 sm:flex-row sm:items-center"
        >
          <MagneticButton href="/gallery" className="pill-cta-accent">
            View work
          </MagneticButton>
          <MagneticButton href="/booking" className="pill-cta">
            Book now
          </MagneticButton>
        </motion.div>

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
