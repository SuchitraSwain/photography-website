"use client";

import Link from "next/link";

import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";

export function CtaBand() {
  return (
    <section className="bg-foreground px-6 py-20 text-background sm:px-10 sm:py-24 lg:px-16">
      <RevealOnScroll className="mx-auto flex max-w-[100rem] flex-col items-start justify-between gap-10 md:flex-row md:items-end">
        <div className="max-w-xl">
          <p className="text-[0.7rem] font-medium tracking-[0.35em] text-background/55 uppercase">
            Next chapter
          </p>
          <h2 className="font-display mt-4 text-[clamp(2.2rem,4.5vw,3.75rem)] leading-[1.05] font-medium tracking-[-0.02em]">
            Let’s make something you’ll want to keep forever.
          </h2>
        </div>
        <Link
          href="/booking"
          className="inline-flex h-12 shrink-0 items-center justify-center bg-background px-8 text-[0.7rem] font-semibold tracking-[0.22em] text-foreground uppercase transition-transform duration-300 hover:scale-[1.03] motion-reduce:hover:scale-100"
        >
          Book a session
        </Link>
      </RevealOnScroll>
    </section>
  );
}
