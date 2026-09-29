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
        <p className="type-label">Packages</p>
        <h1 className="type-title mt-3">Services</h1>
        <p className="type-lead">
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
