"use client";

import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { cn } from "@/lib/utils";

export function Testimonials() {
  const t = useTranslations("home");
  const testimonials = useMemo(
    () => [
      {
        quote: t("testimonial1Quote"),
        name: t("testimonial1Name"),
        detail: t("testimonial1Detail"),
      },
      {
        quote: t("testimonial2Quote"),
        name: t("testimonial2Name"),
        detail: t("testimonial2Detail"),
      },
      {
        quote: t("testimonial3Quote"),
        name: t("testimonial3Name"),
        detail: t("testimonial3Detail"),
      },
    ],
    [t],
  );
  const [index, setIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const active = testimonials[index] ?? {
    quote: "",
    name: "",
    detail: "",
  };

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
  }, []);

  useEffect(() => {
    if (reduceMotion || testimonials.length < 2) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % testimonials.length);
    }, 6000);
    return () => window.clearInterval(id);
  }, [reduceMotion, testimonials.length]);

  return (
    <section className="px-6 py-24 sm:px-10 sm:py-32 lg:px-16">
      <RevealOnScroll className="mx-auto max-w-[100rem]">
        <p className="type-label">{t("testimonialsEyebrow")}</p>
        <h2 className="type-title mt-4 max-w-2xl">
          {t("testimonialsHeadline")}
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
              <p className="text-base font-semibold tracking-wide text-foreground">
                {active.name}
              </p>
              <p className="mt-2 font-mono-nav text-[0.875rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                {active.detail}
              </p>
            </footer>
          </blockquote>
        </div>

        <div
          className="mt-10 flex items-center gap-2"
          role="tablist"
          aria-label={t("testimonialsEyebrow")}
        >
          {testimonials.map((item, i) => (
            <button
              key={item.name}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={item.name}
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
