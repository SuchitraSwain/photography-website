import Link from "next/link";

import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";

type IntroSectionProps = {
  tagline: string;
};

export function IntroSection({ tagline }: IntroSectionProps) {
  return (
    <section className="px-6 py-24 sm:px-10 sm:py-32 lg:px-14">
      <RevealOnScroll className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[1fr_2fr] md:gap-16">
        <p className="text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
          The studio
        </p>

        <div>
          <h2 className="max-w-4xl font-[family-name:var(--font-display)] text-4xl leading-tight font-medium tracking-tight text-foreground sm:text-6xl">
            {tagline}.
          </h2>
          <div className="mt-10 grid gap-8 border-t border-border pt-8 sm:grid-cols-2">
            <p className="max-w-xl leading-relaxed text-muted-foreground">
              We document weddings, portraits, events, and editorial stories
              with a calm eye—leaving room for light, gesture, and the moments
              that unfold without direction.
            </p>
            <div className="sm:text-right">
              <Link
                href="/about"
                className="inline-block border-b border-foreground pb-1 text-sm font-medium text-foreground transition-opacity hover:opacity-60"
              >
                Meet ATELIER
              </Link>
            </div>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}
