import matter from 'gray-matter';
import { Review, ReviewMetadata } from '@/types/review';

// Simple reading time calculation function
function calculateReadingTime(text: string): string {
  const wordsPerMinute = 200; // Average reading speed
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

// Mock reviews data - In a real app, you'd read from MDX files
const mockReviews = [
  {
    slug: 'optimum-nutrition-whey-protein',
    frontmatter: {
      title: 'Optimum Nutrition Gold Standard 100% Whey Protein Review',
      description: 'A comprehensive review of ON Gold Standard Whey - the industry standard for protein supplements.',
      category: 'protein',
      rating: 4.5,
      pros: ['High-quality whey isolate', 'Great taste and mixability', 'Trusted brand', 'Good amino acid profile'],
      cons: ['Higher price point', 'Contains artificial sweeteners'],
      price: '$55-65',
      image: '/images/on-whey-protein.jpg',
      publishedAt: '2024-01-15',
      author: 'Mike Johnson'
    },
    content: `
# The Gold Standard of Whey Protein

Optimum Nutrition's Gold Standard 100% Whey has been a staple in the fitness community for decades. But does it live up to the hype in 2024?

## What Makes It Special

This whey protein blend combines whey protein isolate, whey protein concentrate, and whey peptides to deliver 24g of protein per serving. The formula is designed for rapid absorption and muscle recovery.

## Taste and Mixability

The Double Rich Chocolate flavor mixes incredibly well with just water, creating a smooth, creamy shake without any chalky residue. The taste is genuinely impressive for a protein powder.

## Value for Money

While not the cheapest option on the market, the quality justifies the price point. You're paying for a premium product with consistent quality control.

## Final Verdict

ON Gold Standard remains a reliable choice for serious athletes and fitness enthusiasts. The combination of quality, taste, and brand reputation makes it worth the investment.
    `
  },
  {
    slug: 'c4-pre-workout-review',
    frontmatter: {
      title: 'Cellucor C4 Original Pre-Workout Review',
      description: 'An in-depth look at one of the most popular pre-workout supplements on the market.',
      category: 'pre-workout',
      rating: 4.2,
      pros: ['Good energy boost', 'No crash', 'Variety of flavors', 'Affordable'],
      cons: ['Beta-alanine tingles', 'Underdosed creatine', 'Artificial ingredients'],
      price: '$25-35',
      image: '/images/c4-pre-workout.jpg',
      publishedAt: '2024-01-10',
      author: 'Sarah Chen'
    },
    content: `
# C4 Original: The Pre-Workout That Started It All

Cellucor's C4 Original pre-workout has been powering gym sessions since 2011. Let's see how this classic formula holds up today.

## Key Ingredients

- 150mg Caffeine
- 1.6g Beta-Alanine  
- 1g Creatine Nitrate
- 1g Arginine AKG

## Performance

The energy kick is noticeable within 15-20 minutes. Expect increased focus and endurance during your workout without the jittery feeling.

## Side Effects

The beta-alanine will cause a tingling sensation, especially if you're new to pre-workouts. This is normal and harmless.

## Best Use Cases

Perfect for moderate-intensity workouts and those new to pre-workout supplements. Not ideal for high-stim veterans.
    `
  },
  {
    slug: 'vitamin-d3-benefits-review',
    frontmatter: {
      title: 'Vitamin D3 Supplements: Complete Guide and Top Picks',
      description: 'Everything you need to know about Vitamin D3 supplementation and our top product recommendations.',
      category: 'vitamins',
      rating: 4.8,
      pros: ['Essential for health', 'Affordable', 'Well-researched', 'Multiple forms available'],
      cons: ['Need blood testing for dosing', 'Fat-soluble (overdose risk)'],
      price: '$10-25',
      image: '/images/vitamin-d3.jpg',
      publishedAt: '2024-01-05',
      author: 'Dr. Emily Rodriguez'
    },
    content: `
# The Sunshine Vitamin: Your Guide to Vitamin D3

Vitamin D3 is one of the most important supplements you can take, especially if you live in northern climates or spend most of your time indoors.

## Why Vitamin D3 Matters

- Bone health and calcium absorption
- Immune system support
- Mood regulation
- Muscle function

## Dosage Recommendations

Most adults need 1000-4000 IU daily, but the best approach is to test your blood levels first.

## Best Forms

Look for Vitamin D3 (cholecalciferol) rather than D2. Take with fat for better absorption.

## Top Products

1. **Thorne Vitamin D/K2** - Premium quality with K2 for synergy
2. **NOW Foods Vitamin D3** - Affordable and effective
3. **Sports Research Vitamin D3 + K2** - Great value with coconut oil base
    `
  }
];

export async function getAllReviews(): Promise<Review[]> {
  const reviews = mockReviews.map(({ slug, frontmatter, content }) => {
    const readTime = calculateReadingTime(content);
    
    return {
      slug,
      ...frontmatter,
      content,
      readingTime: readTime,
    } as Review;
  });

  // Sort by published date (newest first)
  return reviews.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function getReviewBySlug(slug: string): Promise<Review | null> {
  const reviews = await getAllReviews();
  return reviews.find(review => review.slug === slug) || null;
}

export async function getReviewsByCategory(category: string): Promise<Review[]> {
  const reviews = await getAllReviews();
  return reviews.filter(review => review.category === category);
}

export async function getCategories(): Promise<string[]> {
  const reviews = await getAllReviews();
  const categories = [...new Set(reviews.map(review => review.category))];
  return categories.sort();
}