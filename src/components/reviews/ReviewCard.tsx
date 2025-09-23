import { Star } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Review } from "@/types/review";

interface ReviewCardProps {
  review: Review;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : i < rating
            ? "text-yellow-400 fill-current opacity-50"
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <Card className="h-full hover:shadow-card transition-all duration-300 group overflow-hidden">
      <div className="aspect-video bg-muted overflow-hidden">
        {review.image ? (
          <img
            src={review.image}
            alt={review.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <span className="text-2xl font-bold text-muted-foreground">
              {review.title.charAt(0)}
            </span>
          </div>
        )}
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="capitalize">
            {review.category}
          </Badge>
          <div className="flex items-center space-x-1">
            {renderStars(review.rating)}
            <span className="text-sm text-muted-foreground ml-2">
              {review.rating}
            </span>
          </div>
        </div>
        
        <NavLink to={`/reviews/${review.slug}`}>
          <h3 className="font-semibold text-lg leading-tight hover:text-primary transition-colors line-clamp-2">
            {review.title}
          </h3>
        </NavLink>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
          {review.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{review.readingTime}</span>
          <span>{new Date(review.publishedAt).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;