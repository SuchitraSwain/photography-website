"use client";

import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import type { ServicePackage } from "@/lib/types/content";
import { cn } from "@/lib/utils";

type PackageCardProps = {
  pkg: ServicePackage;
};

export function PackageCard({ pkg }: PackageCardProps) {
  const t = useTranslations("services");
  const showNumber =
    pkg.priceLabel !== "Most Popular" &&
    pkg.priceLabel !== "Custom" &&
    pkg.priceLabel !== t("mostPopular") &&
    pkg.priceLabel !== t("custom");

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden border border-border/70 bg-[#111b21]/70 p-8 transition duration-500 hover:border-accent/35 sm:p-9",
        pkg.featured &&
          "border-accent/40 bg-accent/[0.06] shadow-[0_0_0_1px_hsl(var(--accent)/0.12)]",
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-8 -right-4 font-display text-[7rem] leading-none tracking-[-0.06em] text-foreground/[0.04] select-none"
      >
        {showNumber ? pkg.priceLabel : ""}
      </div>

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p
            className={cn(
              "font-mono-nav text-[0.875rem] font-semibold tracking-[0.14em] uppercase",
              pkg.featured ? "text-accent" : "text-muted-foreground",
            )}
          >
            {pkg.priceLabel}
          </p>
          <h2 className="font-display mt-3 text-[clamp(1.7rem,2.8vw,2.35rem)] leading-[1.05] tracking-[-0.03em] text-foreground">
            {pkg.name}
          </h2>
        </div>
      </div>

      <p className="relative mt-5 max-w-prose text-[1.12rem] leading-[1.7] text-muted-foreground">
        {pkg.description}
      </p>

      {pkg.includes.length > 0 ? (
        <div className="relative mt-8 flex-1 border-t border-border/60 pt-6">
          <h3 className="type-label">{t("included")}</h3>
          <ul className="mt-4 space-y-2.5 text-[0.95rem] leading-relaxed text-foreground/90">
            {pkg.includes.map((item) => (
              <li key={item} className="flex gap-3">
                <span
                  aria-hidden
                  className="mt-[0.55em] block h-px w-3 shrink-0 bg-accent"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {pkg.addOns.length > 0 ? (
        <div className="relative mt-6">
          <h3 className="type-label">{t("addOns")}</h3>
          <p className="mt-3 text-[0.9rem] leading-relaxed text-muted-foreground">
            {pkg.addOns.join(" · ")}
          </p>
        </div>
      ) : null}

      <div className="relative mt-8 pt-2">
        <Link
          href="/booking"
          className="type-link group/link inline-flex items-center gap-3 text-foreground hover:text-accent"
        >
          {t("startCollection")}
          <span
            aria-hidden
            className="block h-px w-8 bg-current transition-all duration-300 group-hover/link:w-12"
          />
        </Link>
      </div>
    </article>
  );
}
