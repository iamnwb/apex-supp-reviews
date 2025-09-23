import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCategories, getAllReviews } from "@/utils/reviews";

const Categories = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [reviewCounts, setReviewCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [allCategories, allReviews] = await Promise.all([
          getCategories(),
          getAllReviews()
        ]);
        
        setCategories(allCategories);
        
        // Count reviews per category
        const counts = allReviews.reduce((acc, review) => {
          acc[review.category] = (acc[review.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        setReviewCounts(counts);
      } catch (error) {
        console.error("Error loading categories:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const categoryInfo: Record<string, { icon: string; description: string; color: string }> = {
    protein: {
      icon: "🥛",
      description: "Whey, casein, plant-based and specialty protein powders",
      color: "from-blue-500/20 to-blue-600/20"
    },
    "pre-workout": {
      icon: "⚡",
      description: "Energy boosters, focus enhancers, and pump products",
      color: "from-orange-500/20 to-red-600/20"
    },
    vitamins: {
      icon: "💊",
      description: "Essential vitamins, minerals, and micronutrients",
      color: "from-green-500/20 to-green-600/20"
    },
    creatine: {
      icon: "💪",
      description: "Creatine monohydrate, HCL, and specialty blends",
      color: "from-purple-500/20 to-purple-600/20"
    },
    "fat-burner": {
      icon: "🔥",
      description: "Thermogenics, metabolism boosters, and cutting aids",
      color: "from-red-500/20 to-pink-600/20"
    },
    bcaa: {
      icon: "🧬",
      description: "Branched-chain amino acids and EAA supplements",
      color: "from-cyan-500/20 to-blue-600/20"
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Supplement Categories
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore our comprehensive reviews organized by supplement type. 
          Find exactly what you're looking for to optimize your fitness journey.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const info = categoryInfo[category] || {
            icon: "📦",
            description: "Specialized supplements and products",
            color: "from-gray-500/20 to-gray-600/20"
          };

          return (
            <NavLink
              key={category}
              to={`/categories/${category}`}
              className="group"
            >
              <Card className="h-full hover:shadow-card transition-all duration-300 group-hover:scale-105">
                <CardHeader>
                  <div className={`w-full h-32 bg-gradient-to-br ${info.color} rounded-lg flex items-center justify-center mb-4`}>
                    <span className="text-4xl">{info.icon}</span>
                  </div>
                  <CardTitle className="flex items-center justify-between">
                    <span className="capitalize text-xl">
                      {category.replace("-", " ")}
                    </span>
                    <Badge variant="secondary">
                      {reviewCounts[category] || 0}
                    </Badge>
                  </CardTitle>
                </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {info.description}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Reviews
                  </Button>
                  <Button variant="accent" size="sm" asChild>
                    <a 
                      href={`https://example-store.com/category/${category}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Shop Now
                    </a>
                  </Button>
                </div>
              </CardContent>
              </Card>
            </NavLink>
          );
        })}
      </div>

      {/* CTA Section */}
      <div className="text-center mt-16 py-12 bg-muted/30 rounded-lg">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Can't Find What You're Looking For?
        </h2>
        <p className="text-muted-foreground mb-6">
          We're constantly adding new reviews and categories. 
          Let us know what supplements you'd like us to review next.
        </p>
        <NavLink 
          to="/contact"
          className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors"
        >
          Contact Us
        </NavLink>
      </div>
    </div>
  );
};

export default Categories;