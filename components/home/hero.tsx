"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

import { MagneticButton } from "@/components/effects/magnetic-button";
import { SafeImage } from "@/components/media/safe-image";
import { cn } from "@/lib/utils";

type HeroImage = {
  src: string;
  alt: string;
  lqip?: string;
  width?: number;
  height?: number;
};

type HeroProps = {
  brandName: string;
  tagline: string;
  images: HeroImage[];
};

const EASE = [0.4, 0, 0.2, 1] as const;
const ROTATE_MS = 5500;
/** Session carousel size — random picks from the landscape hero pool. */
const HERO_SESSION_SLIDES = 8;

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

function shuffle<T>(list: T[]): T[] {
  const next = [...list];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const a = next[i]!;
    const b = next[j]!;
    next[i] = b;
    next[j] = a;
  }
  return next;
}

function pickNextIndex(current: number, length: number): number {
  if (length <= 1) return 0;
  let next = current;
  while (next === current) {
    next = Math.floor(Math.random() * length);
  }
  return next;
}

function objectPositionFor(image: HeroImage): string {
  const { width = 0, height = 0 } = image;
  if (width > 0 && height > 0 && width / height < 1.15) {
    // Portrait fallback: keep faces higher in frame.
    return "center 22%";
  }
  return "center center";
}

function isLandscapeHero(image: HeroImage): boolean {
  const { width = 0, height = 0 } = image;
  // Dedicated hero plates may omit dims; treat those as landscape-safe.
  if (width <= 0 || height <= 0) return true;
  return width / height >= 1.25;
}

export function Hero({ brandName, tagline, images }: HeroProps) {
  const t = useTranslations("hero");
  const reduceMotion = useReducedMotion();
  const landscapeImages = useMemo(
    () => images.filter(isLandscapeHero),
    [images],
  );
  const slides = useMemo(
    () =>
      shuffle(landscapeImages).slice(
        0,
        Math.min(HERO_SESSION_SLIDES, landscapeImages.length),
      ),
    [landscapeImages],
  );
  const [activeImage, setActiveImage] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    setActiveImage(0);
  }, [slides]);

  useEffect(() => {
    if (reduceMotion || slides.length < 2) return;
    const interval = window.setInterval(() => {
      setActiveImage((current) => pickNextIndex(current, slides.length));
    }, ROTATE_MS);
    return () => window.clearInterval(interval);
  }, [slides.length, reduceMotion]);

  const visibleSlides = hydrated
    ? slides
    : landscapeImages.slice(
        0,
        Math.min(HERO_SESSION_SLIDES, landscapeImages.length),
      );

  return (
    <section className="relative isolate -mt-16 min-h-[85svh] overflow-hidden bg-black text-white lg:min-h-[90svh]">
      <div className="absolute inset-0" aria-hidden={visibleSlides.length === 0}>
        {visibleSlides.map((image, index) => (
          <motion.div
            key={image.src}
            className="absolute inset-0"
            initial={false}
            animate={{
              opacity: index === activeImage ? 1 : 0,
            }}
            transition={{
              opacity: {
                duration: reduceMotion ? 0 : 1.1,
                ease: "easeInOut",
              },
            }}
          >
            <SafeImage
              src={image.src}
              alt={index === activeImage ? image.alt : ""}
              fill
              priority={index < 3}
              unoptimized
              placeholder="empty"
              quality={95}
              sizes="100vw"
              className={cn("object-cover")}
              style={{ objectPosition: objectPositionFor(image) }}
            />
          </motion.div>
        ))}
      </div>

      <div className="image-veil opacity-85" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/70 via-black/30 to-transparent"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/20" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/80 via-black/35 to-transparent"
      />

      <div className="relative mx-auto flex min-h-[85svh] max-w-[100rem] flex-col justify-end px-6 pb-12 pt-28 sm:px-10 sm:pb-16 lg:min-h-[90svh] lg:px-16 lg:pb-20">
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
          className="font-mono-nav mt-6 max-w-xl text-[0.95rem] font-semibold tracking-[0.14em] text-white/90 uppercase drop-shadow-[0_1px_8px_rgba(0,0,0,0.65)]"
        >
          {tagline}
        </motion.p>

        <motion.p
          custom={2}
          variants={loadIn}
          initial={reduceMotion ? false : "hidden"}
          animate="show"
          className="mt-8 max-w-lg text-[1.2rem] leading-[1.7] font-medium text-white/88 drop-shadow-[0_1px_8px_rgba(0,0,0,0.65)]"
        >
          {t("supporting")}
        </motion.p>

        <motion.div
          custom={3}
          variants={loadIn}
          initial={reduceMotion ? false : "hidden"}
          animate="show"
          className="mt-10 flex flex-col gap-4 border-t border-white/20 pt-8 sm:flex-row sm:items-center"
        >
          <MagneticButton href="/gallery" className="pill-cta-accent">
            {t("viewWork")}
          </MagneticButton>
          <MagneticButton href="/booking" className="pill-cta">
            {t("bookNow")}
          </MagneticButton>
        </motion.div>

        {visibleSlides.length > 1 ? (
          <div
            className="mt-10 flex items-center gap-2"
            aria-label={t("indicators")}
          >
            {visibleSlides.map((image, index) => (
              <button
                key={image.src}
                type="button"
                aria-label={t("showImage", { n: index + 1 })}
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
