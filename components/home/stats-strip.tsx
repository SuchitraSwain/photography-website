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
        <p className="text-[0.7rem] font-medium tracking-[0.35em] text-muted-foreground uppercase">
          Selected work
        </p>
        <StaggerReveal className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {CREDIBILITY_STATS.map((stat) => (
            <StaggerItem key={stat.label}>
              <p className="font-display text-[clamp(2.5rem,5vw,3.75rem)] leading-none font-medium tracking-[-0.03em] text-foreground">
                {stat.value}
              </p>
              <p className="mt-3 text-[0.7rem] tracking-[0.22em] text-muted-foreground uppercase">
                {stat.label}
              </p>
            </StaggerItem>
          ))}
        </StaggerReveal>
      </RevealOnScroll>
    </section>
  );
}
