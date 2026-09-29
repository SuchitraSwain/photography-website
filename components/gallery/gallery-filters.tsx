"use client";

import type { Category } from "@/lib/types/content";
import { cn } from "@/lib/utils";

type GalleryFiltersProps = {
  categories: Category[];
  activeFilter: string;
  onFilterChange: (slug: string) => void;
};

export function GalleryFilters({
  categories,
  activeFilter,
  onFilterChange,
}: GalleryFiltersProps) {
  const filters = [
    { label: "All", slug: "all" },
    ...categories.map(({ title, slug }) => ({ label: title, slug })),
  ];

  return (
    <div
      className="flex flex-wrap gap-2"
      role="group"
      aria-label="Filter gallery by category"
    >
      {filters.map(({ label, slug }) => {
        const isActive = activeFilter === slug;

        return (
          <button
            key={slug}
            type="button"
            aria-pressed={isActive}
            onClick={() => onFilterChange(slug)}
            className={cn(
              "font-mono-nav rounded-full border px-4 py-2 text-[0.72rem] tracking-[0.12em] uppercase transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              isActive
                ? "border-accent bg-accent text-background"
                : "border-white/15 text-muted-foreground hover:border-accent/50 hover:text-foreground",
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
