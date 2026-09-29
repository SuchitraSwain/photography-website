import type { ServicePackage } from "@/lib/types/content";
import { cn } from "@/lib/utils";

type PackageCardProps = {
  pkg: ServicePackage;
};

export function PackageCard({ pkg }: PackageCardProps) {
  return (
    <article
      className={cn(
        "surface-card p-8 md:p-10",
        pkg.featured && "surface-card-featured",
      )}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-display text-[clamp(1.6rem,2.6vw,2.2rem)] text-foreground">
          {pkg.name}
        </h2>
        <p className="font-mono-nav text-[0.74rem] tracking-[0.12em] text-foreground/90 uppercase">
          {pkg.priceLabel}
        </p>
      </div>

      {pkg.featured ? (
        <p className="type-label mt-3 text-accent">Featured</p>
      ) : null}

      <p className="type-lead mt-6 max-w-prose">{pkg.description}</p>

      <div className="mt-10 grid gap-10 sm:grid-cols-2">
        <div>
          <h3 className="type-label">Includes</h3>
          <ul className="mt-4 space-y-2 text-[0.95rem] leading-relaxed text-foreground/90">
            {pkg.includes.map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden className="text-accent">
                  —
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {pkg.addOns.length > 0 ? (
          <div>
            <h3 className="type-label">Add-ons</h3>
            <ul className="mt-4 space-y-2 text-[0.95rem] leading-relaxed text-muted-foreground">
              {pkg.addOns.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </article>
  );
}
