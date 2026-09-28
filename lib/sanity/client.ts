import { createClient } from "next-sanity";

import {
  getSanityApiVersion,
  getSanityDataset,
  getSanityProjectId,
} from "@/lib/sanity/env";

export const sanityClient = createClient({
  projectId: getSanityProjectId() ?? "placeholder",
  dataset: getSanityDataset(),
  apiVersion: getSanityApiVersion(),
  // Next.js owns caching via `next: { revalidate }`; the Sanity CDN would add a
  // second, independent stale window that webhook revalidation cannot clear.
  useCdn: false,
});
