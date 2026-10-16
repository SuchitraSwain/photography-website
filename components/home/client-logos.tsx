"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { SafeImage } from "@/components/media/safe-image";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { CLIENT_LOGOS } from "@/lib/content/clients";
import { cn } from "@/lib/utils";

export function ClientLogos() {
  const t = useTranslations("home");
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  if (CLIENT_LOGOS.length === 0) return null;

  const track = reduceMotion
    ? CLIENT_LOGOS
    : [...CLIENT_LOGOS, ...CLIENT_LOGOS, ...CLIENT_LOGOS];

  return (
    <section
      className="border-t border-border/70 px-6 py-16 sm:px-10 sm:py-20 lg:px-16"
      aria-label={t("clientsAria")}
    >
      <RevealOnScroll className="mx-auto max-w-[100rem]">
        <p className="type-label">{t("clientsEyebrow")}</p>
        <h2 className="type-title mt-3 text-[clamp(1.35rem,2.5vw,1.85rem)]">
          {t("clientsHeadline")}
        </h2>

        <div
          className={cn(
            "relative mt-12 overflow-hidden",
            !reduceMotion && "client-logos-mask",
          )}
        >
          <ul
            className={cn(
              "flex items-end gap-14 sm:gap-20",
              reduceMotion
                ? "flex-wrap justify-center sm:justify-start"
                : "w-max animate-client-marquee",
            )}
          >
            {track.map((client, index) => (
              <li
                key={`${client.name}-${index}`}
                className="flex w-36 shrink-0 flex-col items-center gap-3 sm:w-44"
              >
                <div className="flex h-28 w-full items-center justify-center sm:h-32">
                  <SafeImage
                    src={client.src}
                    alt={client.name}
                    width={client.width}
                    height={client.height}
                    className="max-h-28 w-auto max-w-full bg-transparent object-contain opacity-90 transition-opacity duration-300 hover:opacity-100 sm:max-h-32"
                    fallbackClassName="bg-transparent"
                    placeholder="empty"
                  />
                </div>
                <p className="font-mono-nav text-center text-[0.8rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase sm:text-[0.85rem]">
                  {client.name}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </RevealOnScroll>
    </section>
  );
}
