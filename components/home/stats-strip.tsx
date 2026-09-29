"use client";

import {
  RevealOnScroll,
  StaggerItem,
  StaggerReveal,
} from "@/components/motion/reveal-on-scroll";

/**
 * Edit these stats in one place — layout stays untouched.
 */
const CREDIBILITY_STATS = [
  { value: "150+", label: "Weddings shot" },
  { value: "12", label: "Countries" },
  { value: "10 yrs", label: "Behind the lens" },
  { value: "Vogue", label: "Featured in" },
] as const;

export function StatsStrip() {
  return (
    <section className="border-y border-border/70 bg-secondary/25 px-6 py-16 sm:px-10 sm:py-20 lg:px-16">
      <RevealOnScroll className="mx-auto max-w-[100rem]">
        <p className="type-label">Selected work</p>
        <StaggerReveal className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {CREDIBILITY_STATS.map((stat) => (
            <StaggerItem key={stat.label}>
              <p className="type-kpi">{stat.value}</p>
              <p className="type-label mt-3">{stat.label}</p>
            </StaggerItem>
          ))}
        </StaggerReveal>
      </RevealOnScroll>
    </section>
  );
}
