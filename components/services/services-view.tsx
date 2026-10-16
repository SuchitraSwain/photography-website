"use client";

import { useTranslations } from "next-intl";

import { PackageCard } from "@/components/services/package-card";
import {
  RevealOnScroll,
  StaggerItem,
  StaggerReveal,
} from "@/components/motion/reveal-on-scroll";
import { Link } from "@/i18n/navigation";
import type { ServicePackage } from "@/lib/types/content";

type ServicesViewProps = {
  packages: ServicePackage[];
};

export function ServicesView({ packages }: ServicesViewProps) {
  const t = useTranslations("services");
  const process = [
    { step: "01", title: t("inquireTitle"), body: t("inquireBody") },
    { step: "02", title: t("planTitle"), body: t("planBody") },
    { step: "03", title: t("createTitle"), body: t("createBody") },
    { step: "04", title: t("deliverTitle"), body: t("deliverBody") },
  ] as const;

  return (
    <>
      <RevealOnScroll className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 right-0 font-display text-[min(22vw,9rem)] leading-none tracking-[-0.06em] text-foreground/[0.035] uppercase select-none"
        >
          Studio
        </div>
        <p className="type-label">
          Krishyam Production · {t("eyebrow")}
        </p>
        <h1 className="type-title mt-4 max-w-[16ch]">{t("headline")}</h1>
        <div className="mt-8 grid gap-8 border-t border-border/70 pt-8 md:grid-cols-[1.3fr_0.7fr] md:items-end">
          <p className="type-lead mt-0 max-w-xl">{t("ctaBody")}</p>
          <Link
            href="/gallery"
            className="type-link group inline-flex items-center gap-3 text-foreground hover:text-accent md:justify-end"
          >
            {t("startCollection")}
            <span
              aria-hidden
              className="block h-px w-8 bg-current transition-all duration-300 group-hover:w-12"
            />
          </Link>
        </div>
      </RevealOnScroll>

      <StaggerReveal
        className="mt-16 grid gap-4 sm:grid-cols-2 lg:gap-5"
        stagger={0.08}
      >
        {packages.map((pkg) => (
          <StaggerItem key={pkg._id} className="h-full">
            <PackageCard pkg={pkg} />
          </StaggerItem>
        ))}
      </StaggerReveal>

      <RevealOnScroll className="mt-24 border-t border-border/70 pt-14">
        <p className="type-label">{t("processEyebrow")}</p>
        <h2 className="type-title mt-4 max-w-[18ch]">
          {t("processHeadline")}
        </h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {process.map((item) => (
            <div key={item.step} className="border-t border-border/60 pt-5">
              <p className="font-mono-nav text-[0.875rem] font-semibold tracking-[0.14em] text-accent uppercase">
                {item.step}
              </p>
              <h3 className="font-display mt-3 text-xl tracking-[-0.02em] text-foreground">
                {item.title}
              </h3>
              <p className="mt-3 text-[1.05rem] leading-[1.7] text-muted-foreground">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </RevealOnScroll>

      <RevealOnScroll className="mt-24 overflow-hidden border border-border/70 bg-[#111b21]/55 px-8 py-12 sm:px-12 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
          <div>
            <p className="type-label">{t("ctaHeadline")}</p>
            <h2 className="type-title mt-4 max-w-[16ch]">{t("headline")}</h2>
            <p className="type-lead mt-5 max-w-xl">{t("ctaBody")}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-end">
            <Link
              href="/booking"
              className="pill-cta-accent inline-flex justify-center"
            >
              {t("ctaButton")}
            </Link>
            <Link href="/contact" className="pill-cta inline-flex justify-center">
              {t("startCollection")}
            </Link>
          </div>
        </div>
      </RevealOnScroll>
    </>
  );
}
