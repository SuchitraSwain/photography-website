import { defineArrayMember, defineField, defineType } from "sanity";

export const pageAbout = defineType({
  name: "pageAbout",
  title: "About Page",
  type: "document",
  fields: [
    defineField({
      name: "headline",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "bio",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "philosophy",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "portrait",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "portraitAlt",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "press",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", type: "string" }),
            defineField({ name: "outlet", type: "string" }),
            defineField({ name: "url", type: "url" }),
            defineField({ name: "year", type: "string" }),
          ],
        }),
      ],
    }),
  ],
});
