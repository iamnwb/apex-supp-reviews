import { useState, useEffect } from "react";
import { Star, Clock, User, DollarSign, CheckCircle, XCircle, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { getReviewBySlug } from "@/utils/reviews";
import { Review } from "@/types/review";
import { Link } from "react-router-dom";

interface ReviewPreviewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  reviewSlug: string | null;
  onDelete?: (reviewId: string) => void;
}

export const ReviewPreviewDrawer = ({ 
  isOpen, 
  onClose, 
  reviewSlug, 
  onDelete 
}: ReviewPreviewDrawerProps) => {
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadReview = async () => {
      if (!reviewSlug || !isOpen) return;
      
      setLoading(true);
      try {
        const reviewData = await getReviewBySlug(reviewSlug);
        setReview(reviewData);
      } catch (error) {
        console.error("Error loading review:", error);
      } finally {
        setLoading(false);
      }
    };

    loadReview();
  }, [reviewSlug, isOpen]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => {
      const filled = i < Math.floor(rating);
      const halfFilled = i < rating && i >= Math.floor(rating);
      
      return (
        <div key={i} className="relative">
          <Star
            className={`w-4 h-4 ${
              filled ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
          {halfFilled && (
            <Star
              className="w-4 h-4 text-yellow-400 fill-current absolute top-0 left-0"
              style={{
                clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)'
              }}
            />
          )}
        </div>
      );
    });
  };

  const handleClose = () => {
    setReview(null);
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="w-full sm:max-w-4xl overflow-y-auto">
        <SheetHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-xl font-bold">Review Preview</SheetTitle>
              <SheetDescription>
                Admin preview - This is how the review appears to users
              </SheetDescription>
            </div>
            {review && (
              <div className="flex items-center gap-2">
                <Link to={`/admin/reviews/edit/${review.slug}`}>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </Link>
                {onDelete && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(review.slug)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </SheetHeader>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading review...</p>
            </div>
          </div>
        ) : !review ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Review not found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header */}
            <div className="border rounded-lg p-6 bg-muted/30">
              <div className="flex items-center gap-4 mb-4">
                <Badge variant="secondary" className="capitalize">
                  {review.category}
                </Badge>
                <div className="flex items-center space-x-1">
                  {renderStars(review.rating)}
                  <span className="font-semibold ml-2">{review.rating}/5</span>
                </div>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
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
                <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-sm font-semibold text-primary text-center">
                    💡 Save up to {review.discountPercentage}% on {review.discountText}
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Product Image */}
                {review.image && (
                  <div className="aspect-video rounded-lg overflow-hidden border">
                    <img
                      src={review.image}
                      alt={review.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Review Content */}
                <Card>
                  <CardHeader>
                    <CardTitle>Review Content</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      {review.content.split('\n').map((paragraph, index) => {
                        if (paragraph.startsWith('# ')) {
                          return (
                            <h2 key={index} className="text-xl font-bold text-foreground mt-6 mb-3">
                              {paragraph.substring(2)}
                            </h2>
                          );
                        }
                        if (paragraph.startsWith('## ')) {
                          return (
                            <h3 key={index} className="text-lg font-semibold text-foreground mt-4 mb-2">
                              {paragraph.substring(3)}
                            </h3>
                          );
                        }
                        if (paragraph.trim() === '') {
                          return <br key={index} />;
                        }
                        return (
                          <p key={index} className="text-foreground mb-3 leading-relaxed">
                            {paragraph}
                          </p>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-4">
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

                {/* CTA Preview */}
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg">Buy Now CTA</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" disabled>
                      Buy Now - {review.price}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      (Preview only - not functional)
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};