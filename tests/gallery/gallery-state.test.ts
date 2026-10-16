import { describe, expect, it } from "vitest";

import {
  filterGalleryImages,
  getAdjacentImageIndex,
  GALLERY_VISIBLE_COUNT,
  pickGalleryImages,
} from "@/components/gallery/gallery-view";
import type { GalleryImage } from "@/lib/types/content";

const images = [
  { _id: "one", categorySlug: "weddings" },
  { _id: "two", categorySlug: "portraits" },
  { _id: "three", categorySlug: "weddings" },
] as GalleryImage[];

const manyImages = Array.from({ length: 25 }, (_, index) => ({
  _id: `img-${index}`,
  categorySlug: index % 2 === 0 ? "portraits" : "events",
})) as GalleryImage[];

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

  it("picks at most ten random images for the public gallery", () => {
    const picked = pickGalleryImages(manyImages, "all");
    expect(picked).toHaveLength(GALLERY_VISIBLE_COUNT);
    expect(new Set(picked.map((image) => image._id)).size).toBe(
      GALLERY_VISIBLE_COUNT,
    );
  });

  it("shows every image in a category tab", () => {
    const portraits = manyImages.filter(
      (image) => image.categorySlug === "portraits",
    );
    const picked = pickGalleryImages(manyImages, "portraits");
    expect(picked).toHaveLength(portraits.length);
    expect(picked.every((image) => image.categorySlug === "portraits")).toBe(
      true,
    );
  });
});
