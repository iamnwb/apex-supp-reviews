import { useState, useEffect } from "react";
import { useParams, NavLink } from "react-router-dom";
import { ArrowLeft, Star, Clock, User, DollarSign, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getReviewBySlug } from "@/utils/reviews";
import { Review } from "@/types/review";

const ReviewDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReview = async () => {
      if (!slug) return;
      
      try {
        const reviewData = await getReviewBySlug(slug);
        setReview(reviewData);
      } catch (error) {
        console.error("Error loading review:", error);
      } finally {
        setLoading(false);
      }
    };

    loadReview();
  }, [slug]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : i < rating
            ? "text-yellow-400 fill-current opacity-50"
            : "text-gray-300"
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading review...</p>
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Review Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The review you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <NavLink to="/reviews">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Reviews
          </NavLink>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Button variant="ghost" asChild className="mb-6">
        <NavLink to="/reviews">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Reviews
        </NavLink>
      </Button>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Badge variant="secondary" className="capitalize">
            {review.category}
          </Badge>
          <div className="flex items-center space-x-1">
            {renderStars(review.rating)}
            <span className="font-semibold ml-2">{review.rating}/5</span>
          </div>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          {review.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-6 text-muted-foreground text-sm">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-2" />
            {review.author}
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            {review.readingTime}
          </div>
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 mr-2" />
            {review.price}
          </div>
          <span>{new Date(review.publishedAt).toLocaleDateString()}</span>
        </div>
        
        {/* Discount Banner */}
        {review.discountPercentage && review.discountText && (
          <div className="mt-6 p-4 rounded-2xl bg-[var(--discount-bg)] border border-[var(--discount-border)]">
            <p className="text-lg font-semibold text-primary text-center">
              💡 Save up to {review.discountPercentage}% on {review.discountText}
            </p>
          </div>
        )}
        
        {/* Primary CTA */}
        <div className="mt-6">
          <a
            href={review.buyNowUrl || `https://example-store.com/products/${review.slug}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="default" className="rounded-xl font-semibold py-4 px-8 text-lg bg-primary hover:bg-primary-hover">
              Buy Now - {review.price}
            </Button>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Product Image */}
          {review.image && (
            <div className="aspect-video mb-8 rounded-lg overflow-hidden">
              <img
                src={review.image}
                alt={review.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Review Content */}
          <div className="prose prose-gray max-w-none">
            {review.content.split('\n').map((paragraph, index) => {
              if (paragraph.startsWith('# ')) {
                return (
                  <h2 key={index} className="text-2xl font-bold text-foreground mt-8 mb-4">
                    {paragraph.substring(2)}
                  </h2>
                );
              }
              if (paragraph.startsWith('## ')) {
                return (
                  <h3 key={index} className="text-xl font-semibold text-foreground mt-6 mb-3">
                    {paragraph.substring(3)}
                  </h3>
                );
              }
              if (paragraph.trim() === '') {
                return <br key={index} />;
              }
              return (
                <p key={index} className="text-foreground mb-4 leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* Pros & Cons */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pros & Cons</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Pros */}
                <div>
                  <h4 className="font-medium text-primary mb-2 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Pros
                  </h4>
                  <ul className="space-y-1">
                    {review.pros.map((pro, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start">
                        <span className="text-primary mr-2">•</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cons */}
                <div>
                  <h4 className="font-medium text-destructive mb-2 flex items-center">
                    <XCircle className="w-4 h-4 mr-2" />
                    Cons
                  </h4>
                  <ul className="space-y-1">
                    {review.cons.map((con, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start">
                        <span className="text-destructive mr-2">•</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rating</span>
                  <span className="font-medium">{review.rating}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price Range</span>
                  <span className="font-medium">{review.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium capitalize">{review.category}</span>
                </div>
              </CardContent>
            </Card>

            {/* Simplified CTA */}
            <Card className="rounded-2xl border-0 shadow-[var(--shadow-card)]">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Get This Product</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {review.discountPercentage && review.discountText && (
                  <div className="p-3 rounded-xl bg-[var(--discount-bg)] border border-[var(--discount-border)]">
                    <p className="text-sm font-medium text-primary text-center">
                      💡 Save up to {review.discountPercentage}% on {review.discountText}
                    </p>
                  </div>
                )}
                
                <a
                  href={review.buyNowUrl || `https://example-store.com/products/${review.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button variant="default" className="w-full rounded-xl font-semibold py-3 bg-primary hover:bg-primary-hover">
                    Buy Now - {review.price}
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetail;