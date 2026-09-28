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
  useCdn: true,
});
