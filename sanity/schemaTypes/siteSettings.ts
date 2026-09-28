import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "brandName",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagline",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroImages",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "socialLinks",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              type: "url",
              validation: (rule) =>
                rule.required().uri({ allowRelative: false, scheme: ["http", "https", "mailto"] }),
            }),
          ],
        }),
      ],
    }),
    defineField({ name: "location", type: "string" }),
    defineField({
      name: "contactEmail",
      type: "string",
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: "seoDefaults",
      title: "SEO defaults",
      type: "object",
      fields: [
        defineField({ name: "titleTemplate", type: "string" }),
        defineField({ name: "description", type: "text" }),
        defineField({ name: "ogImage", type: "image" }),
      ],
    }),
  ],
});
