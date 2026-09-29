"use client";

import { MagneticButton } from "@/components/effects/magnetic-button";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";

export function CtaBand() {
  return (
    <section className="border-y border-border/60 bg-[#0a101c] px-6 py-20 sm:px-10 sm:py-24 lg:px-16">
      <RevealOnScroll className="mx-auto flex max-w-[100rem] flex-col items-start justify-between gap-10 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <p className="font-mono-nav text-[0.7rem] tracking-[0.2em] text-muted-foreground uppercase">
            Next chapter
          </p>
          <h2 className="font-display mt-4 text-[clamp(2.2rem,4.5vw,3.75rem)] leading-[1.05] font-bold tracking-[-0.03em]">
            Your story deserves more than a snapshot. Let&apos;s make it a
            frame.
          </h2>
        </div>
        <MagneticButton href="/booking" className="pill-cta shrink-0">
          Start your booking
        </MagneticButton>
      </RevealOnScroll>
    </section>
  );
}
