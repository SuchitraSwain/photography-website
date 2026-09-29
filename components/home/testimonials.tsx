"use client";

import { useEffect, useState } from "react";

import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { cn } from "@/lib/utils";

/**
 * Edit quotes here — carousel logic stays the same.
 */
const TESTIMONIALS = [
  {
    quote:
      "Every frame felt intentional. They disappeared into the day and still somehow caught the quiet moments we care about most.",
    name: "Maya & Jordan",
    detail: "Wedding · Hudson Valley",
  },
  {
    quote:
      "The portraits feel like us — unforced, elegant, and completely free of the stiff energy we dreaded.",
    name: "Elena Voss",
    detail: "Editorial portrait session",
  },
  {
    quote:
      "Our brand launch looked cinematic without losing the human energy in the room. Turnaround was remarkably fast.",
    name: "Northline Studio",
    detail: "Product launch coverage",
  },
] as const;

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const active = TESTIMONIALS[index] ?? TESTIMONIALS[0];

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
  }, []);

  useEffect(() => {
    if (reduceMotion || TESTIMONIALS.length < 2) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  return (
    <section className="px-6 py-24 sm:px-10 sm:py-32 lg:px-16">
      <RevealOnScroll className="mx-auto max-w-[100rem]">
        <p className="type-label">Kind words</p>
        <h2 className="type-title mt-4 max-w-2xl">
          What clients remember
        </h2>

        <div className="relative mt-14 min-h-[14rem] border-t border-border/80 pt-10 md:min-h-[12rem]">
          <blockquote
            key={active.name}
            className={cn("max-w-3xl motion-fade")}
          >
            <p className="font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.35] font-medium tracking-[-0.02em] text-foreground/95 italic">
              “{active.quote}”
            </p>
            <footer className="mt-8">
              <p className="text-sm font-medium tracking-wide text-foreground">
                {active.name}
              </p>
              <p className="type-label mt-1">{active.detail}</p>
            </footer>
          </blockquote>
        </div>

        <div
          className="mt-10 flex items-center gap-2"
          role="tablist"
          aria-label="Testimonials"
        >
          {TESTIMONIALS.map((item, i) => (
            <button
              key={item.name}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show testimonial from ${item.name}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index
                  ? "w-8 bg-foreground"
                  : "w-1.5 bg-foreground/25 hover:bg-foreground/50"
              }`}
            />
          ))}
        </div>
      </RevealOnScroll>
    </section>
  );
}
