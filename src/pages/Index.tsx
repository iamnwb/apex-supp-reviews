import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Shield, Zap } from "lucide-react";
import { NavLink } from "react-router-dom";

const Index = () => {
  const features = [
    {
      icon: <Star className="h-8 w-8 text-primary" />,
      title: "Honest Reviews",
      description: "Unbiased, science-backed reviews from real users and experts"
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Trusted Source",
      description: "No sponsored content - just honest opinions you can trust"
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "Latest Updates",
      description: "Stay updated with the newest supplements and formulations"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-background to-muted/30 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Your <span className="text-primary">Trusted Source</span> for
              <br />Supplement Reviews
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Get honest, science-backed reviews of the latest fitness supplements. 
              Make informed decisions for your fitness journey with our expert analysis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Button variant="hero" size="lg" asChild>
                <NavLink to="/reviews">
                  Browse Reviews <ArrowRight className="ml-2 h-5 w-5" />
                </NavLink>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <NavLink to="/categories">
                  View Categories
                </NavLink>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why Choose FitnessSupps?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're committed to providing you with the most accurate and helpful 
              supplement information available.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="text-center p-6 rounded-lg hover:shadow-card transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted/30 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Find Your Perfect Supplement?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Browse our comprehensive reviews and make informed decisions about your fitness supplements.
          </p>
          <Button variant="accent" size="lg" asChild>
            <NavLink to="/reviews">
              Start Reading Reviews <ArrowRight className="ml-2 h-5 w-5" />
            </NavLink>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
