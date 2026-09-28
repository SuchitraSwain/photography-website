import { describe, expect, it } from "vitest";

import {
  filterGalleryImages,
  getAdjacentImageIndex,
} from "@/components/gallery/gallery-view";
import type { GalleryImage } from "@/lib/types/content";

const images = [
  { _id: "one", categorySlug: "weddings" },
  { _id: "two", categorySlug: "portraits" },
  { _id: "three", categorySlug: "weddings" },
] as GalleryImage[];

describe("gallery state", () => {
  it("returns every image for the all filter", () => {
    expect(filterGalleryImages(images, "all")).toEqual(images);
  });

  it("returns images matching the selected category", () => {
    expect(filterGalleryImages(images, "weddings")).toEqual([
      images[0],
      images[2],
    ]);
  });

  it("wraps image navigation in both directions", () => {
    expect(getAdjacentImageIndex(0, -1, images.length)).toBe(2);
    expect(getAdjacentImageIndex(2, 1, images.length)).toBe(0);
  });
});
