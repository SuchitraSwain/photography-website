import {
  createImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";

import {
  getSanityDataset,
  getSanityProjectId,
} from "@/lib/sanity/env";

const imageBuilder = createImageUrlBuilder({
  projectId: getSanityProjectId() ?? "placeholder",
  dataset: getSanityDataset(),
});

export type ImageUrlOptions = {
  /** Longest edge requested from the Sanity CDN before next/image resizes it. */
  width?: number;
  quality?: number;
};

export function urlFor(
  source: SanityImageSource,
  { width = 1600, quality = 80 }: ImageUrlOptions = {},
): string {
  return imageBuilder
    .image(source)
    .width(width)
    .quality(quality)
    .auto("format")
    .url();
}
