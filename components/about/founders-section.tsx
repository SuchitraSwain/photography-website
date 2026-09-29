"use client";

import Image from "next/image";

import {
  RevealOnScroll,
  StaggerItem,
  StaggerReveal,
} from "@/components/motion/reveal-on-scroll";

/**
 * Edit founders here — bios, titles, and Dicebear seeds / imageSrc.
 * Swap imageSrc for real headshots in /public/images/founders later.
 */
const FOUNDERS = [
  {
    name: "Sagar Zinzala",
    role: "Co-Founder",
    title: "Co-Founder & Photographer",
    /** Dicebear seed — change seed (and imageSrc) to regenerate the placeholder */
    seed: "Sagar",
    imageSrc: "https://api.dicebear.com/7.x/notionists/svg?seed=Sagar",
    imageAlt: "Portrait placeholder for Sagar Zinzala",
    bio: "Sagar is a software engineer by trade and a photographer by obsession. What started as a way to unwind from shipping code turned into a genuine craft — he brings the same precision he applies to systems design to composing a frame. Based in [CITY], drawn to natural light and unscripted moments.",
  },
  {
    name: "Suchitra Swain",
    role: "Co-Founder",
    title: "Co-Founder & Photographer",
    seed: "Suchitra",
    imageSrc: "https://api.dicebear.com/7.x/notionists/svg?seed=Suchitra",
    imageAlt: "Portrait placeholder for Suchitra Swain",
    bio: "Suchitra spends her days solving engineering problems and her weekends chasing golden hour. She co-founded ATELIER to prove that a technical mind and an artistic eye aren't opposites — they're the same instinct for noticing what matters. Focused on portraits and the quiet, in-between moments most people rush past.",
  },
];

export function FoundersSection() {
  return (
    <section className="mt-24 border-t border-border pt-16 md:mt-28 md:pt-20">
      <RevealOnScroll>
        <p className="type-label">Engineers turned photographers</p>
        <h2 className="type-title mt-4">The founders</h2>
        <p className="type-lead">
          Two engineers. One eye for light.
        </p>
      </RevealOnScroll>

      <StaggerReveal
        className="mt-10 grid gap-10 md:grid-cols-2 md:gap-8 lg:gap-12"
        stagger={0.1}
      >
        {FOUNDERS.map((founder) => (
          <StaggerItem key={founder.name}>
            <article className="group flex h-full flex-col">
              <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
                <Image
                  src={founder.imageSrc}
                  alt={founder.imageAlt}
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="object-cover object-top transition duration-[400ms] ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  unoptimized
                />
              </div>
              <div className="mt-6 flex flex-1 flex-col">
                <p className="type-label">{founder.role}</p>
                <h3 className="font-display mt-2 text-[clamp(1.6rem,2.6vw,2.2rem)] text-foreground">
                  {founder.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {founder.title}
                </p>
                <p className="type-body mt-5 text-foreground/90">
                  {founder.bio}
                </p>
              </div>
            </article>
          </StaggerItem>
        ))}
      </StaggerReveal>
    </section>
  );
}
