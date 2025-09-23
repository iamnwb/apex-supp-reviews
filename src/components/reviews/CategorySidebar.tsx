import { NavLink } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CategorySidebarProps {
  categories: string[];
  reviewCounts: Record<string, number>;
  currentCategory?: string;
}

const CategorySidebar = ({ categories, reviewCounts, currentCategory }: CategorySidebarProps) => {
  const categoryIcons: Record<string, string> = {
    protein: "🥛",
    "pre-workout": "⚡",
    vitamins: "💊",
    creatine: "💪",
    "fat-burner": "🔥",
    bcaa: "🧬",
  };

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="text-lg">Categories</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <NavLink
            to="/reviews"
            className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
              !currentCategory
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            }`}
          >
            <div className="flex items-center space-x-3">
              <span>📁</span>
              <span className="font-medium">All Reviews</span>
            </div>
            <Badge variant={!currentCategory ? "secondary" : "outline"}>
              {Object.values(reviewCounts).reduce((sum, count) => sum + count, 0)}
            </Badge>
          </NavLink>
          
          {categories.map((category) => (
            <NavLink
              key={category}
              to={`/categories/${category}`}
              className={({ isActive }) => `
                flex items-center justify-between p-3 rounded-lg transition-colors
                ${isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
                }
              `}
            >
              <div className="flex items-center space-x-3">
                <span>{categoryIcons[category] || "📦"}</span>
                <span className="font-medium capitalize">
                  {category.replace("-", " ")}
                </span>
              </div>
              <Badge variant={currentCategory === category ? "secondary" : "outline"}>
                {reviewCounts[category] || 0}
              </Badge>
            </NavLink>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategorySidebar;