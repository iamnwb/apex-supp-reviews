import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import ReviewCard from "@/components/reviews/ReviewCard";
import CategorySidebar from "@/components/reviews/CategorySidebar";
import { getAllReviews, getCategories } from "@/utils/reviews";
import { Review } from "@/types/review";

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [allReviews, allCategories] = await Promise.all([
          getAllReviews(),
          getCategories()
        ]);
        setReviews(allReviews);
        setCategories(allCategories);
      } catch (error) {
        console.error("Error loading reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredReviews = reviews.filter(review =>
    review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const reviewCounts = reviews.reduce((acc, review) => {
    acc[review.category] = (acc[review.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

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
        <h1 className="text-3xl font-bold text-foreground mb-4">All Reviews</h1>
        <p className="text-muted-foreground mb-6">
          Comprehensive reviews of the latest fitness supplements
        </p>
        
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search reviews..."
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
            categories={categories} 
            reviewCounts={reviewCounts}
          />
        </div>

        {/* Reviews Grid */}
        <div className="lg:col-span-3">
          {filteredReviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                {searchTerm ? "No reviews found matching your search." : "No reviews available."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredReviews.map((review) => (
                <ReviewCard key={review.slug} review={review} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;