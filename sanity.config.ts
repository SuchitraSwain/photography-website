import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import {
  getSanityDataset,
  getSanityProjectId,
} from "@/sanity/env";
import { schemaTypes } from "@/sanity/schemaTypes";
import { structure } from "@/sanity/structure";

export default defineConfig({
  name: "atelier",
  title: "ATELIER",
  projectId: getSanityProjectId() ?? "placeholder",
  dataset: getSanityDataset(),
  basePath: "/studio",
  plugins: [structureTool({ structure }), visionTool()],
  schema: { types: schemaTypes },
});
