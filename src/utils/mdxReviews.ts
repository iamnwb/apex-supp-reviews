import type { ComponentType } from "react";
import reviewIndexRaw from "@/content/reviews/index.json?raw";

type ReviewIndexEntry = {
  slug: string;
  [key: string]: unknown;
};

type MDXModule = {
  default: ComponentType<Record<string, unknown>>;
};

type MdxReviewEntry = {
  slug: string;
  component: ComponentType<Record<string, unknown>>;
  frontmatter: Record<string, unknown>;
};

const reviewIndex = JSON.parse(reviewIndexRaw) as ReviewIndexEntry[];

const mdxModules = import.meta.glob("../content/reviews/*.mdx", {
  eager: true,
}) as Record<string, MDXModule>;

const mdxEntries: MdxReviewEntry[] = reviewIndex.map((meta) => {
  const modulePath = `../content/reviews/${meta.slug}.mdx`;
  const mod = mdxModules[modulePath];

  if (!mod) {
    throw new Error(`MDX module missing for slug: ${meta.slug}`);
  }

  return {
    slug: meta.slug,
    component: mod.default,
    frontmatter: meta as Record<string, unknown>,
  };
});

export const getMdxReviewBySlug = (slug: string): MdxReviewEntry | null =>
  mdxEntries.find((entry) => entry.slug === slug) ?? null;

export const listMdxReviews = (): MdxReviewEntry[] => [...mdxEntries];
