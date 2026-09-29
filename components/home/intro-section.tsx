import Link from "next/link";

import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { foundersCredit } from "@/lib/site-config";

type IntroSectionProps = {
  tagline: string;
};

export function IntroSection({ tagline }: IntroSectionProps) {
  return (
    <section className="relative overflow-hidden px-6 py-28 sm:px-10 sm:py-36 lg:px-16">
      <div
        aria-hidden
        className="pointer-events-none absolute top-16 right-0 font-display text-[min(28vw,12rem)] leading-none tracking-[-0.06em] text-foreground/[0.04] uppercase select-none"
      >
        Studio
      </div>

      <RevealOnScroll className="relative mx-auto grid max-w-[100rem] gap-14 lg:grid-cols-[0.35fr_1fr] lg:gap-20">
        <div className="space-y-6">
          <p className="type-label">
            We debug by day. We shoot at golden hour.
          </p>
          <div className="editorial-rule w-16" />
        </div>

        <div>
          <h2 className="type-title max-w-4xl">{tagline}</h2>
          <div className="mt-12 grid gap-10 border-t border-border/80 pt-10 md:grid-cols-[1.4fr_0.6fr]">
            <p className="type-lead mt-0 max-w-xl">
              A two-person studio — {foundersCredit()} — shooting weddings,
              portraits, events, and editorial stories with patience and a bias
              toward natural light. Less posing, more presence.
            </p>
            <div className="md:pt-1 md:text-right">
              <Link
                href="/about"
                className="type-link group inline-flex items-center gap-3 text-foreground hover:text-accent"
              >
                Meet the founders
                <span
                  aria-hidden
                  className="block h-px w-8 bg-current transition-all duration-300 group-hover:w-12"
                />
              </Link>
            </div>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}
