"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

import { SafeImage } from "@/components/media/safe-image";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { Link } from "@/i18n/navigation";
import { GALLERY_CATEGORY_LABELS } from "@/lib/content/categories";
import type { GalleryImage } from "@/lib/types/content";

type FeaturedStripProps = {
  images: GalleryImage[];
};

const SHUFFLE_MS = 5200;
const VISIBLE_COUNT = 6;

function shuffleImages(list: GalleryImage[]): GalleryImage[] {
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

/** Pick `count` images from the full pool, preferring ones not currently visible. */
function pickVisible(
  pool: GalleryImage[],
  count: number,
  previous: GalleryImage[] = [],
): GalleryImage[] {
  if (pool.length === 0) return [];
  if (pool.length <= count) return shuffleImages(pool);

  const previousIds = new Set(previous.map((image) => image._id));
  const fresh = pool.filter((image) => !previousIds.has(image._id));
  const source = fresh.length >= count ? fresh : pool;
  return shuffleImages(source).slice(0, count);
}

/** Replace one visible slot with a fresh image from the pool. */
function swapOneSlot(
  pool: GalleryImage[],
  current: GalleryImage[],
): GalleryImage[] {
  if (pool.length === 0 || current.length === 0) return current;

  const visibleIds = new Set(current.map((image) => image._id));
  const candidates = pool.filter((image) => !visibleIds.has(image._id));
  if (candidates.length === 0) return current;

  const next = [...current];
  const slot = Math.floor(Math.random() * next.length);
  const replacement =
    candidates[Math.floor(Math.random() * candidates.length)]!;
  next[slot] = replacement;
  return next;
}

function TileOverlay({
  label,
  emphasize,
  fallbackLabel,
}: {
  label: string;
  emphasize: boolean;
  fallbackLabel: string;
}) {
  if (emphasize) {
    return (
      <>
        <p className="text-[0.8rem] font-semibold tracking-[0.14em] text-white/85 uppercase">
          {fallbackLabel}
        </p>
        <p className="font-display mt-1 text-lg text-white sm:text-xl">{label}</p>
      </>
    );
  }

  return (
    <p className="text-[0.85rem] font-semibold tracking-[0.12em] text-white/90 uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:opacity-100">
      {label}
    </p>
  );
}

function FeaturedTile({
  image,
  sizes,
  emphasize = false,
  fallbackLabel,
}: {
  image: GalleryImage;
  sizes: string;
  emphasize?: boolean;
  fallbackLabel: string;
}) {
  const reduceMotion = useReducedMotion();
  const [displayed, setDisplayed] = useState(image);
  const [incoming, setIncoming] = useState<GalleryImage | null>(null);
  const [incomingReady, setIncomingReady] = useState(false);

  useEffect(() => {
    if (image._id === displayed._id) return;
    if (reduceMotion) {
      setDisplayed(image);
      setIncoming(null);
      setIncomingReady(false);
      return;
    }
    setIncoming(image);
    setIncomingReady(false);
  }, [image, displayed._id, reduceMotion]);

  useEffect(() => {
    if (!incoming || !incomingReady) return;
    const id = window.setTimeout(() => {
      setDisplayed(incoming);
      setIncoming(null);
      setIncomingReady(false);
    }, 750);
    return () => window.clearTimeout(id);
  }, [incoming, incomingReady]);

  const label =
    GALLERY_CATEGORY_LABELS[displayed.categorySlug] ?? fallbackLabel;

  return (
    <Link
      href="/gallery"
      data-cursor="gallery"
      className="group relative block aspect-[4/3] w-full overflow-hidden bg-[#0a1016]"
      aria-label={label}
    >
      <div className="absolute inset-0 flex items-center justify-center p-1.5 sm:p-2">
        <SafeImage
          src={displayed.src}
          alt={displayed.alt}
          width={Math.max(displayed.width || 4, 1)}
          height={Math.max(displayed.height || 3, 1)}
          sizes={sizes}
          className="max-h-full max-w-full bg-transparent object-contain transition duration-[900ms] ease-out group-hover:scale-[1.02]"
          fallbackClassName="bg-transparent"
        />
      </div>

      {incoming ? (
        <motion.div
          className="absolute inset-0 flex items-center justify-center p-1.5 sm:p-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: incomingReady ? 1 : 0 }}
          transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1] }}
        >
          <SafeImage
            src={incoming.src}
            alt={incoming.alt}
            width={Math.max(incoming.width || 4, 1)}
            height={Math.max(incoming.height || 3, 1)}
            sizes={sizes}
            className="max-h-full max-w-full bg-transparent object-contain"
            fallbackClassName="bg-transparent"
            onLoadingComplete={() => setIncomingReady(true)}
            onError={() => {
              setIncoming(null);
              setIncomingReady(false);
            }}
          />
        </motion.div>
      ) : null}

      <span className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/20" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent px-4 pt-16 pb-4 sm:px-5 sm:pb-5">
        <TileOverlay
          label={label}
          emphasize={emphasize}
          fallbackLabel={fallbackLabel}
        />
      </div>
    </Link>
  );
}

export function FeaturedStrip({ images }: FeaturedStripProps) {
  const t = useTranslations("home");
  const reduceMotion = useReducedMotion();
  const pool = useMemo(() => images, [images]);
  const [visible, setVisible] = useState<GalleryImage[]>(() =>
    pickVisible(pool, VISIBLE_COUNT),
  );

  useEffect(() => {
    setVisible(pickVisible(pool, VISIBLE_COUNT));
  }, [pool]);

  useEffect(() => {
    if (reduceMotion || pool.length <= VISIBLE_COUNT) return;
    const id = window.setInterval(() => {
      setVisible((current) => swapOneSlot(pool, current));
    }, SHUFFLE_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion, pool]);

  if (visible.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-border/70 px-6 py-24 sm:px-10 sm:py-32 lg:px-16">
      <RevealOnScroll className="mx-auto max-w-[100rem]">
        <div className="mb-10 flex flex-col gap-6 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="type-label">{t("featuredEyebrow")}</p>
            <h2 className="type-title mt-4">{t("featuredHeadline")}</h2>
          </div>
          <Link
            href="/gallery"
            className="type-link group inline-flex items-center gap-3 text-foreground hover:text-accent"
          >
            {t("featuredCta")}
            <span
              aria-hidden
              className="block h-px w-8 bg-current transition-all duration-300 group-hover:w-14"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {visible.map((image, index) => (
            <div key={`slot-${index}`} className="min-h-0">
              <FeaturedTile
                image={image}
                emphasize={index === 0}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                fallbackLabel={t("featuredFallback")}
              />
            </div>
          ))}
        </div>
      </RevealOnScroll>
    </section>
  );
}
