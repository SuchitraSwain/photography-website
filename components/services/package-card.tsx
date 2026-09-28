import type { ServicePackage } from "@/lib/types/content";
import { cn } from "@/lib/utils";

type PackageCardProps = {
  pkg: ServicePackage;
};

export function PackageCard({ pkg }: PackageCardProps) {
  return (
    <article
      className={cn(
        "border border-border p-8 md:p-10",
        pkg.featured && "border-accent ring-1 ring-accent/40",
      )}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-[family-name:var(--font-display)] text-3xl font-medium tracking-tight">
          {pkg.name}
        </h2>
        <p className="text-sm font-medium tracking-wide text-brass">
          {pkg.priceLabel}
        </p>
      </div>

      {pkg.featured ? (
        <p className="mt-3 text-xs font-medium tracking-[0.2em] text-accent uppercase">
          Featured
        </p>
      ) : null}

      <p className="mt-6 max-w-prose text-base leading-relaxed text-foreground/90">
        {pkg.description}
      </p>

      <div className="mt-10 grid gap-10 sm:grid-cols-2">
        <div>
          <h3 className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
            Includes
          </h3>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-foreground/90">
            {pkg.includes.map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden className="text-muted-foreground">
                  —
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {pkg.addOns.length > 0 ? (
          <div>
            <h3 className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
              Add-ons
            </h3>
            <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
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
