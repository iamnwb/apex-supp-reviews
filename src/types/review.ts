export interface Review {
  slug: string;
  title: string;
  description: string;
  category: string;
  rating: number;
  pros: string[];
  cons: string[];
  price: string;
  image: string;
  publishedAt: string;
  readingTime: string;
  content: string;
  author: string;
  buyNowUrl?: string;
  discountPercentage?: number;
  discountText?: string;
}
