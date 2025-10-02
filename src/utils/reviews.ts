import { supabase } from "@/integrations/supabase/client";
import { getMdxReviewSummaries } from "@/utils/mdxReviews";
import { Review } from "@/types/review";
import type { Database } from "@/integrations/supabase/types";
import type { PostgrestResponse } from "@supabase/supabase-js";

type ReviewRow = Database["public"]["Tables"]["reviews"]["Row"];

// ---- helpers ----
function calculateReadingTime(text: string): string {
  const wordsPerMinute = 200;
  const words = (text ?? "").trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

const SUPABASE_FETCH_TIMEOUT_MS = 15000;
function timeout(ms: number) {
  return new Promise<never>((_, reject) => setTimeout(() => reject(new Error("supabase-timeout")), ms));
}

// ---- data functions ----
export async function getAllReviews(): Promise<Review[]> {
  const fallbackReviews: Review[] = getMdxReviewSummaries();

  try {
    const t0 = performance.now?.() ?? Date.now();

    const supabasePromise = supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: supabaseReviews, error } = (await Promise.race([
      supabasePromise,
      timeout(SUPABASE_FETCH_TIMEOUT_MS),
    ])) as PostgrestResponse<ReviewRow>;

    console.log("Supabase reviews:", supabaseReviews, "Error:", error);

    const t1 = performance.now?.() ?? Date.now();
    console.log("Supabase reviews fetch time:", Math.round(t1 - t0), "ms");

    if (error) {
      console.error("Error fetching reviews from Supabase:", error);
      return fallbackReviews;
    }

    const reviewRows = (supabaseReviews ?? []) as ReviewRow[];

    const convertedSupabaseReviews: Review[] = reviewRows.map((review) => ({
      slug: review.slug,
      title: review.title,
      description: review.description,
      category: review.category,
      rating: review.rating,
      pros: review.pros ?? [],
      cons: review.cons ?? [],
      price: review.price,
      image: review.image ?? "",
      publishedAt: review.published_at ?? review.created_at ?? new Date().toISOString(),
      readingTime: review.reading_time ?? calculateReadingTime(review.content ?? ""),
      content: review.content ?? "",
      author: review.author,
      buyNowUrl: review.buy_now_url ?? undefined,
      discountPercentage: review.discount_percentage ?? undefined,
      discountText: review.discount_text ?? undefined,
    }));

    const allReviews = [...convertedSupabaseReviews, ...fallbackReviews];
    const seen = new Set<string>();
    const deduped = allReviews.filter(r => {
      if (!r?.slug) return false;
      if (seen.has(r.slug)) return false;
      seen.add(r.slug);
      return true;
    });
    return deduped.sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "supabase-timeout") {
      console.warn("Supabase reviews query timed out; returning cached fallback list.");
    } else {
      console.error("Error in getAllReviews:", err);
    }
    return fallbackReviews.sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }
}

export async function getReviewBySlug(slug: string): Promise<Review | null> {
  const reviews = await getAllReviews();
  return reviews.find((r) => r.slug === slug) || null;
}

export async function getReviewsByCategory(category: string): Promise<Review[]> {
  const reviews = await getAllReviews();
  return reviews.filter((r) => r.category === category);
}

export async function getCategories(): Promise<string[]> {
  const reviews = await getAllReviews();
  const categories = [...new Set(reviews.map((r) => r.category))];
  return categories.sort();
}
