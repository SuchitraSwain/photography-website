"use client";

import { MagneticButton } from "@/components/effects/magnetic-button";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";

export function CtaBand() {
  return (
    <section className="bg-foreground px-6 py-20 text-background sm:px-10 sm:py-24 lg:px-16">
      <RevealOnScroll className="mx-auto flex max-w-[100rem] flex-col items-start justify-between gap-10 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <p className="text-[0.7rem] font-medium tracking-[0.35em] text-background/55 uppercase">
            Next chapter
          </p>
          <h2 className="font-display mt-4 text-[clamp(2.2rem,4.5vw,3.75rem)] leading-[1.05] font-medium tracking-[-0.02em]">
            Your story deserves more than a snapshot. Let&apos;s make it a
            frame.
          </h2>
        </div>
        <MagneticButton
          href="/booking"
          className="shrink-0 bg-background text-foreground focus-visible:outline-background"
        >
          Start your booking
        </MagneticButton>
      </RevealOnScroll>
    </section>
  );
}
