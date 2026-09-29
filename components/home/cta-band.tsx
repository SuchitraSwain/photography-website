"use client";

import { MagneticButton } from "@/components/effects/magnetic-button";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";

export function CtaBand() {
  return (
    <section className="border-y border-border/60 bg-[#0a101c] px-6 py-20 sm:px-10 sm:py-24 lg:px-16">
      <RevealOnScroll className="mx-auto flex max-w-[100rem] flex-col items-start justify-between gap-10 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <p className="type-label">Next chapter</p>
          <h2 className="type-title mt-4 max-w-[18ch]">
            Your story deserves more than a snapshot. Let&apos;s make it a
            frame.
          </h2>
        </div>
        <MagneticButton href="/booking" className="pill-cta-accent shrink-0">
          Start your booking
        </MagneticButton>
      </RevealOnScroll>
    </section>
  );
}
