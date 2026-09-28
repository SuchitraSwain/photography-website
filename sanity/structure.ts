import type { StructureResolver } from "sanity/structure";

const singletonTypes = new Set(["siteSettings", "pageAbout"]);

export const structure: StructureResolver = (structureBuilder) =>
  structureBuilder
    .list()
    .title("Content")
    .items([
      structureBuilder
        .listItem()
        .title("Site Settings")
        .child(
          structureBuilder
            .document()
            .schemaType("siteSettings")
            .documentId("siteSettings"),
        ),
      structureBuilder
        .listItem()
        .title("About Page")
        .child(
          structureBuilder
            .document()
            .schemaType("pageAbout")
            .documentId("pageAbout"),
        ),
      ...structureBuilder
        .documentTypeListItems()
        .filter((item) => !singletonTypes.has(item.getId() ?? "")),
    ]);
