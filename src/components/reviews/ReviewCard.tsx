import { Star } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Review } from "@/types/review";

interface ReviewCardProps {
  review: Review;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
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

  return (
    <Card className="h-full group overflow-hidden bg-card shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-500 border-0 rounded-2xl">
      {/* Discount Banner */}
      {review.discountPercentage && review.discountText && (
        <div className="bg-[var(--discount-bg)] border-b border-[var(--discount-border)] px-6 py-3">
          <p className="text-sm font-medium text-primary text-center">
            Save up to {review.discountPercentage}% on {review.discountText}
          </p>
        </div>
      )}
      
      <div className="aspect-[4/3] bg-muted overflow-hidden">
        {review.image ? (
          <img
            src={review.image}
            alt={review.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
            <span className="text-3xl font-light text-muted-foreground">
              {review.title.charAt(0)}
            </span>
          </div>
        )}
      </div>
      
      <CardHeader className="pb-4 pt-8 px-8">
        <div className="flex items-center justify-between mb-6">
          <Badge variant="secondary" className="capitalize font-medium text-xs px-3 py-1 rounded-full">
            {review.category}
          </Badge>
          <div className="flex items-center space-x-1">
            {renderStars(review.rating)}
            <span className="text-lg font-semibold text-foreground ml-3">
              {review.rating}
            </span>
          </div>
        </div>
        
        <NavLink to={`/reviews/${review.slug}`}>
          <h3 className="font-bold text-xl leading-tight hover:text-primary transition-colors line-clamp-2 mb-4">
            {review.title}
          </h3>
        </NavLink>
        
        <p className="text-muted-foreground text-base mb-6 line-clamp-3 leading-relaxed">
          {review.description}
        </p>
      </CardHeader>
      
      <CardContent className="pt-0 px-8 pb-8">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-6">
          <span className="flex items-center">
            <span className="w-1 h-1 bg-muted-foreground rounded-full mr-2"></span>
            {review.readingTime}
          </span>
          <span>{new Date(review.publishedAt).toLocaleDateString()}</span>
        </div>
        
        {/* Single Buy Now Button */}
        <a
          href={review.buyNowUrl || `https://example-store.com/products/${review.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Button variant="default" className="w-full rounded-xl font-semibold py-3 text-base bg-primary hover:bg-primary-hover">
            Buy Now - {review.price}
          </Button>
        </a>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;