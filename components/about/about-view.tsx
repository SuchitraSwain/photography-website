"use client";

import { SafeImage } from "@/components/media/safe-image";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import type { PageAbout } from "@/lib/types/content";

type AboutViewProps = {
  about: PageAbout;
};

export function AboutView({ about }: AboutViewProps) {
  const bioParagraphs = about.bio.split(/\n\n+/).filter(Boolean);

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-16">
      <RevealOnScroll className="relative aspect-[3/4] overflow-hidden bg-secondary lg:sticky lg:top-24">
        <div className="absolute inset-0">
          <SafeImage
            src={about.portraitSrc}
            alt={about.portraitAlt}
            fill
            priority
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
          />
        </div>
      </RevealOnScroll>

      <RevealOnScroll delay={0.1}>
        <p className="text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
          Two engineers. One eye for light.
        </p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-medium tracking-tight md:text-5xl">
          {about.headline}
        </h1>

        <div className="mt-10 space-y-6 border-t border-border pt-10">
          {bioParagraphs.map((paragraph, index) => (
            <p
              key={index}
              className="max-w-prose text-base leading-relaxed text-foreground/90"
            >
              {paragraph}
            </p>
          ))}
        </div>

        <blockquote className="relative mt-12 border-l-2 border-accent pl-6">
          <span
            aria-hidden
            className="font-display absolute -top-3 left-4 text-5xl leading-none text-accent select-none"
          >
            &ldquo;
          </span>
          <p className="font-mono-nav text-[0.65rem] tracking-[0.18em] text-muted-foreground uppercase">
            Philosophy
          </p>
          <p className="mt-4 max-w-prose text-lg leading-relaxed text-foreground/95 italic">
            {about.philosophy}
          </p>
        </blockquote>

        {about.press.length > 0 ? (
          <section className="mt-16 border-t border-border pt-10">
            <h2 className="text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
              Press
            </h2>
            <ul className="mt-8 divide-y divide-border">
              {about.press.map((item) => (
                <li key={`${item.url}-${item.year}`} className="py-5 first:pt-0">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block"
                  >
                    <p className="font-display text-xl font-bold tracking-tight transition-colors group-hover:text-accent">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.outlet} · {item.year}
                    </p>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </RevealOnScroll>
    </div>
  );
}
