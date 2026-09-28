"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";

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
  const reduceMotion = useReducedMotion();
  const active = TESTIMONIALS[index] ?? TESTIMONIALS[0];

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
        <p className="text-[0.7rem] font-medium tracking-[0.35em] text-muted-foreground uppercase">
          Kind words
        </p>
        <h2 className="font-display mt-4 max-w-2xl text-[clamp(2.2rem,4.5vw,3.5rem)] leading-[1.1] font-medium tracking-[-0.02em]">
          What clients remember
        </h2>

        <div className="relative mt-14 min-h-[14rem] border-t border-border/80 pt-10 md:min-h-[12rem]">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={active.name}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-3xl"
            >
              <p className="font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.35] text-foreground/95 italic">
                “{active.quote}”
              </p>
              <footer className="mt-8">
                <p className="text-sm font-medium tracking-wide text-foreground">
                  {active.name}
                </p>
                <p className="mt-1 text-[0.7rem] tracking-[0.2em] text-muted-foreground uppercase">
                  {active.detail}
                </p>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
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
