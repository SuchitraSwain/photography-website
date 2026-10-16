"use client";

import { useTranslations } from "next-intl";

import { MagneticButton } from "@/components/effects/magnetic-button";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";

export function CtaBand() {
  const t = useTranslations("home");

  return (
    <section className="border-y border-border/60 bg-[#111b21] px-6 py-20 sm:px-10 sm:py-24 lg:px-16">
      <RevealOnScroll className="mx-auto flex max-w-[100rem] flex-col items-start justify-between gap-10 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <p className="type-label">{t("ctaHeadline")}</p>
          <h2 className="type-title mt-4 max-w-[22ch]">{t("ctaBody")}</h2>
        </div>
        <MagneticButton href="/booking" className="pill-cta-accent shrink-0">
          {t("ctaButton")}
        </MagneticButton>
      </RevealOnScroll>
    </section>
  );
}
