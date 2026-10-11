import { mockCategories } from "@/lib/mock/content";

export const GALLERY_CATEGORY_LABELS: Record<string, string> =
  Object.fromEntries(mockCategories.map((category) => [category.slug, category.title]));
