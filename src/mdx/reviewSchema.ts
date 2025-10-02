import { z } from "zod";

const CitationListSchema = z.array(z.number().int().positive()).default([]);

export const IngredientSchema = z.object({
  name: z.string().min(1, "Ingredient name is required"),
  amount: z.number({ invalid_type_error: "Ingredient amount must be a number" }),
  units: z.string().min(1, "Ingredient units are required"),
  standardization: z.string().optional(),
  claimedBenefit: z.string().min(1, "Ingredient benefit is required"),
  evidenceLevel: z.enum(["Strong", "Mixed", "Limited"]),
  summary: z.string().min(1, "Ingredient summary is required"),
  citations: CitationListSchema,
});

const PriceRowSchema = z.object({
  size: z.string().min(1, "Price row size is required"),
  servings: z.string().min(1, "Price row servings are required"),
  rrp: z.string().min(1, "Price row RRP is required"),
  bestObserved: z.string().optional(),
  pricePerServing: z.string().optional(),
});

const AlternativeSchema = z.object({
  name: z.string().min(1, "Alternative name is required"),
  summary: z.string().min(1, "Alternative summary is required"),
  link: z.string().url("Alternative link must be a valid URL"),
  priceRange: z.string().optional(),
});

const FAQSchema = z.object({
  q: z.string().min(1, "FAQ question is required"),
  a: z.string().min(1, "FAQ answer is required"),
});

const ReferenceSchema = z.object({
  id: z.number().int().positive(),
  authors: z.string().min(1, "Reference authors are required"),
  year: z.number().int().min(1900, "Reference year must be >= 1900"),
  title: z.string().min(1, "Reference title is required"),
  journal: z.string().min(1, "Reference journal is required"),
  url: z.string().url("Reference URL must be valid"),
});

const urlField = (field: string) =>
  z.string({ required_error: `${field} is required` }).url(`${field} must be a valid URL`);

const ratingSchema = z
  .number({ invalid_type_error: "rating must be a number" })
  .min(0, "rating must be ≥ 0")
  .max(5, "rating must be ≤ 5")
  .transform((value) => Number(value.toFixed(1)))
  .superRefine((value, ctx) => {
    if (Number.isNaN(value)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "rating must be a valid number" });
    }
  });

export const ReviewFrontmatterSchema = z.object({
  title: z.string().min(1, "title is required"),
  subtitle: z.string().min(1, "subtitle is required"),
  brand: z.string().min(1, "brand is required"),
  productName: z.string().min(1, "productName is required"),
  category: z.string().min(1, "category is required"),
  rating: ratingSchema,
  priceRange: z.string().min(1, "priceRange is required"),
  skuUrl: urlField("skuUrl"),
  amazonUrl: urlField("amazonUrl"),
  brandUrl: urlField("brandUrl"),
  images: z.array(z.string().url("images must be valid URLs")).min(1, "at least one image is required"),
  lastUpdated: z
    .string({ required_error: "lastUpdated is required" })
    .datetime({ message: "lastUpdated must be an ISO timestamp" }),
  author: z.string().min(1, "author is required"),
  reviewerCredentials: z.array(z.string()).default([]),
  disclaimers: z.array(z.string()).default([]),
  keyClaims: z.array(z.string()).default([]),
  ingredients: z.array(IngredientSchema).min(1, "ingredients list cannot be empty"),
  pros: z.array(z.string()).default([]),
  cons: z.array(z.string()).default([]),
  bestFor: z.array(z.string()).default([]),
  avoidIf: z.array(z.string()).default([]),
  dosage: z.string().min(1, "dosage is required"),
  timing: z.string().min(1, "timing is required"),
  sideEffects: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
  priceTable: z.array(PriceRowSchema).default([]),
  alternatives: z.array(AlternativeSchema).default([]),
  faq: z.array(FAQSchema).default([]),
  references: z.array(ReferenceSchema).min(1, "at least one reference is required"),
  // optional extras tolerated by existing content
  categoryLabel: z.string().optional(),
  description: z.string().optional(),
  price: z.string().optional(),
  buyNowUrl: z.string().url().optional(),
  image: z.string().url().optional(),
  readingTime: z.string().optional(),
});

export const ReviewIndexEntrySchema = ReviewFrontmatterSchema.extend({
  slug: z.string().min(1, "slug is required"),
  readingTime: z.string().min(1, "readingTime is required"),
});

export type ReviewFrontmatter = z.infer<typeof ReviewFrontmatterSchema>;
export type ReviewIndexEntry = z.infer<typeof ReviewIndexEntrySchema>;
