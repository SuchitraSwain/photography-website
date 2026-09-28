"use client";

import { PackageCard } from "@/components/services/package-card";
import {
  RevealOnScroll,
  StaggerItem,
  StaggerReveal,
} from "@/components/motion/reveal-on-scroll";
import type { ServicePackage } from "@/lib/types/content";

type ServicesViewProps = {
  packages: ServicePackage[];
};

export function ServicesView({ packages }: ServicesViewProps) {
  return (
    <>
      <RevealOnScroll>
        <p className="text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
          Packages
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-medium tracking-tight md:text-6xl">
          Services
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
          No two days look the same. No two frames should either.
        </p>
      </RevealOnScroll>

      <StaggerReveal className="mt-16 flex flex-col gap-8" stagger={0.1}>
        {packages.map((pkg) => (
          <StaggerItem key={pkg._id}>
            <PackageCard pkg={pkg} />
          </StaggerItem>
        ))}
      </StaggerReveal>
    </>
  );
}
