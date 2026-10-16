"use client";

import { useTranslations } from "next-intl";

import { SafeImage } from "@/components/media/safe-image";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { Link } from "@/i18n/navigation";
import type { PageAbout } from "@/lib/types/content";

type AboutViewProps = {
  about: PageAbout;
};

function paragraphs(text: string) {
  return text.split(/\n\n+/).filter(Boolean);
}

export function AboutView({ about }: AboutViewProps) {
  const t = useTranslations("about");
  const bio = paragraphs(about.bio);
  const story = paragraphs(about.storyBody);

  return (
    <div className="space-y-24 md:space-y-32">
      {/* Hero */}
      <section className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <RevealOnScroll className="relative aspect-[4/3] overflow-hidden rounded-[12px] bg-secondary lg:aspect-[5/4]">
          <SafeImage
            src={about.portraitSrc}
            alt={about.portraitAlt}
            fill
            priority
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover object-center"
          />
        </RevealOnScroll>

        <RevealOnScroll delay={0.08} className="max-w-xl">
          <p className="type-label">{about.eyebrow}</p>
          <h1 className="type-title mt-4">{about.headline}</h1>
          <p className="mt-5 text-xl leading-relaxed text-foreground/90 md:text-2xl">
            {about.subhead}
          </p>
          <div className="mt-8 space-y-4 border-t border-border/80 pt-8">
            {bio.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="text-[1.05rem] leading-[1.75] text-muted-foreground"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </RevealOnScroll>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-3xl">
        <RevealOnScroll>
          <p className="type-label">{t("story")}</p>
          <h2 className="type-title mt-4">{about.storyHeadline}</h2>
          <div className="mt-8 space-y-5">
            {story.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="text-[1.05rem] leading-[1.75] text-muted-foreground"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </RevealOnScroll>
      </section>

      {/* Philosophy */}
      <section>
        <RevealOnScroll className="max-w-3xl">
          <p className="type-label">{t("philosophy")}</p>
          <h2 className="type-title mt-4">{about.philosophyHeadline}</h2>
        </RevealOnScroll>
        <ul className="mt-12 grid gap-px overflow-hidden rounded-[12px] border border-border/70 bg-border/70 sm:grid-cols-2">
          {about.beliefs.map((belief, index) => (
            <RevealOnScroll key={belief.title} delay={index * 0.04}>
              <li className="h-full bg-[#111b21] px-6 py-8 sm:px-8 sm:py-10">
                <p className="font-display text-lg font-bold tracking-tight text-foreground">
                  {belief.title}
                </p>
                <p className="mt-3 text-[0.98rem] leading-relaxed text-muted-foreground">
                  {belief.body}
                </p>
              </li>
            </RevealOnScroll>
          ))}
        </ul>
      </section>

      {/* What we create */}
      <section className="mx-auto max-w-3xl">
        <RevealOnScroll>
          <p className="type-label">{t("whatWeCreate")}</p>
          <p className="mt-6 text-[1.1rem] leading-[1.75] text-muted-foreground">
            {about.whatWeCreate}
          </p>
        </RevealOnScroll>
      </section>

      {/* CTA */}
      <RevealOnScroll>
        <section className="rounded-[16px] border border-border/70 bg-[#111b21] px-6 py-12 sm:px-10 sm:py-14">
          <h2 className="type-title max-w-2xl">{about.ctaHeadline}</h2>
          <p className="mt-5 max-w-xl text-[1.05rem] leading-relaxed text-muted-foreground">
            {about.ctaBody}
          </p>
          <Link
            href="/booking"
            className="pill-cta-accent mt-8 inline-flex items-center"
          >
            {t("cta")}
            <span aria-hidden className="ml-2">
              →
            </span>
          </Link>
        </section>
      </RevealOnScroll>
    </div>
  );
}
