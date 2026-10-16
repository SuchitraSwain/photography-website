"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import {
  RevealOnScroll,
  StaggerItem,
  StaggerReveal,
} from "@/components/motion/reveal-on-scroll";

export function FoundersSection() {
  const t = useTranslations("about");
  const founders = [
    {
      name: "Sagar Zinzala",
      title: t("sagarTitle"),
      imageSrc: "/images/founders/sagar-v3.jpg",
      imageAlt: "Portrait of Sagar Zinzala",
      objectPosition: "object-center",
      bio: t("sagarBio"),
      pullQuote: t("sagarNote"),
    },
    {
      name: "Suchitra Swain",
      title: t("suchitraTitle"),
      imageSrc: "/images/founders/suchitra.jpg",
      imageAlt: "Portrait of Suchitra Swain",
      objectPosition: "object-center",
      bio: t("suchitraBio"),
      pullQuote: t("suchitraNote"),
    },
  ] as const;

  return (
    <section className="mt-24 border-t border-border/70 pt-16 md:mt-32 md:pt-20">
      <RevealOnScroll>
        <p className="type-label">{t("foundersHeadline")}</p>
        <h2 className="type-title mt-4">{t("foundersEyebrow")}</h2>
      </RevealOnScroll>

      <StaggerReveal
        className="mt-12 grid gap-12 md:grid-cols-2 md:gap-10"
        stagger={0.08}
      >
        {founders.map((founder) => (
          <StaggerItem key={founder.name}>
            <article className="group flex h-full flex-col">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[12px] bg-secondary">
                <Image
                  src={founder.imageSrc}
                  alt={founder.imageAlt}
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className={`object-cover transition duration-[400ms] ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100 ${founder.objectPosition}`}
                />
              </div>
              <div className="mt-6 flex flex-1 flex-col">
                <h3 className="font-display text-[clamp(1.5rem,2.4vw,2rem)] tracking-tight text-foreground">
                  {founder.name}
                </h3>
                <p className="mt-2 text-[0.875rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                  {founder.title}
                </p>
                <p className="mt-5 text-[1.12rem] leading-[1.7] text-muted-foreground">
                  {founder.bio}
                </p>
                <p className="mt-5 border-l-2 border-accent pl-4 text-base leading-relaxed text-foreground/90 italic">
                  {founder.pullQuote}
                </p>
              </div>
            </article>
          </StaggerItem>
        ))}
      </StaggerReveal>
    </section>
  );
}
