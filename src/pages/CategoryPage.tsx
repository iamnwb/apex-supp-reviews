import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import ReviewCard from "@/components/reviews/ReviewCard";
import CategorySidebar from "@/components/reviews/CategorySidebar";
import { getReviewsByCategory, getCategories, getAllReviews } from "@/utils/reviews";
import { Review } from "@/types/review";

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!category) return;
      
      try {
        const [categoryReviews, categories, allReviewsData] = await Promise.all([
          getReviewsByCategory(category),
          getCategories(),
          getAllReviews()
        ]);
        
        setReviews(categoryReviews);
        setAllCategories(categories);
        setAllReviews(allReviewsData);
      } catch (error) {
        console.error("Error loading category data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [category]);

  const filteredReviews = reviews.filter(review =>
    review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const reviewCounts = allReviews.reduce((acc, review) => {
    acc[review.category] = (acc[review.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryInfo: Record<string, { icon: string; title: string; description: string }> = {
    protein: {
      icon: "🥛",
      title: "Protein Supplements",
      description: "Reviews of whey, casein, plant-based and specialty protein powders"
    },
    "pre-workout": {
      icon: "⚡",
      title: "Pre-Workout Supplements",
      description: "Energy boosters, focus enhancers, and pump products"
    },
    vitamins: {
      icon: "💊",
      title: "Vitamins & Minerals",
      description: "Essential vitamins, minerals, and micronutrient supplements"
    },
    creatine: {
      icon: "💪",
      title: "Creatine Supplements",
      description: "Creatine monohydrate, HCL, and specialty blends"
    },
    "fat-burner": {
      icon: "🔥",
      title: "Fat Burners",
      description: "Thermogenics, metabolism boosters, and cutting aids"
    },
    bcaa: {
      icon: "🧬",
      title: "BCAA & EAA",
      description: "Branched-chain amino acids and essential amino acid supplements"
    }
  };

  const currentCategoryInfo = categoryInfo[category || ""] || {
    icon: "📦",
    title: "Supplement Reviews",
    description: "Specialized supplements and products"
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-4xl">{currentCategoryInfo.icon}</span>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {currentCategoryInfo.title}
            </h1>
            <p className="text-muted-foreground">
              {currentCategoryInfo.description}
            </p>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search this category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <CategorySidebar 
            categories={allCategories} 
            reviewCounts={reviewCounts}
            currentCategory={category}
          />
        </div>

        {/* Reviews Grid */}
        <div className="lg:col-span-3">
          {filteredReviews.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">{currentCategoryInfo.icon}</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {searchTerm ? "No reviews found" : "No reviews yet"}
              </h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? "Try adjusting your search terms."
                  : "We're working on adding more reviews to this category."
                }
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-muted-foreground">
                  {filteredReviews.length} review{filteredReviews.length !== 1 ? 's' : ''} found
                  {searchTerm && ` for "${searchTerm}"`}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredReviews.map((review) => (
                  <ReviewCard key={review.slug} review={review} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;