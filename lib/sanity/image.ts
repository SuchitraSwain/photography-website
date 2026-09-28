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

export function urlFor(source: SanityImageSource): string {
  return imageBuilder.image(source).auto("format").url();
}
