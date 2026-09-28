import { defineArrayMember, defineField, defineType } from "sanity";

export const servicePackage = defineType({
  name: "servicePackage",
  title: "Service Package",
  type: "document",
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "priceLabel",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "includes",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "addOns",
      title: "Add-ons",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({ name: "featured", type: "boolean", initialValue: false }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
  ],
});
