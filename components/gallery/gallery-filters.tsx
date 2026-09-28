import type { Category } from "@/lib/types/content";

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
            className={`rounded-full border px-4 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
              isActive
                ? "border-foreground bg-foreground text-background"
                : "border-border hover:border-foreground"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
