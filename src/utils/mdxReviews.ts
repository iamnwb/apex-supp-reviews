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

export const getMdxReviewSummaries = () => {
  return mdxEntries.map((entry) => {
    const fm = entry.frontmatter as Record<string, unknown>;
    return {
      slug: entry.slug,
      title: (fm.title as string) ?? "",
      description: (fm.description as string) ?? "",
      category: (fm.category as string) ?? "",
      rating: (fm.rating as number) ?? 0,
      pros: (fm.pros as string[]) ?? [],
      cons: (fm.cons as string[]) ?? [],
      price: (fm.price as string) ?? "",
      image: (fm.image as string) ?? "",
      publishedAt: (fm.publishedAt as string) ?? new Date().toISOString(),
      readingTime: (fm.readingTime as string) ?? "5 min read",
      content: "",
      author: (fm.author as string) ?? "Admin",
      buyNowUrl: (fm.buyNowUrl as string) ?? undefined,
      discountPercentage: (fm.discountPercentage as number) ?? undefined,
      discountText: (fm.discountText as string) ?? undefined,
    };
  });
};
