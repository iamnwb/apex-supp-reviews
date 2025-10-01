import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Shield, Zap } from "lucide-react";
import { NavLink } from "react-router-dom";
import bannerImage from "@/assets/homepage-banner.png";
const Index = () => {
  const features = [{
    icon: <Star className="h-8 w-8 text-primary" />,
    title: "Honest Reviews",
    description: "Unbiased, science-backed reviews from real users and experts"
  }, {
    icon: <Shield className="h-8 w-8 text-primary" />,
    title: "Trusted Source",
    description: "No sponsored content - just honest opinions you can trust"
  }, {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: "Latest Updates",
    description: "Stay updated with the newest supplements and formulations"
  }];
  return <div className="min-h-screen">
      {/* Banner Section */}
      <section className="relative h-96 bg-gradient-to-br from-primary/20 to-primary/10 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: `url(${bannerImage})`
      }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background py-0 my-0" />
      </section>

      {/* Hero Section */}
      <section className="absolute inset-0 flex items-start pt-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background/40 via-background/60 to-background">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center animate-fade-in backdrop-blur-sm bg-background/30 rounded-lg p-8 px-0 py-[20px]">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Your <span className="text-primary">Trusted Source</span> for
              <br />Supplement Reviews
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">Get honest, science-backed reviews of the latest fitness supplements. Make informed decisions for your fitness journey with our expert analysis.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Button variant="hero" size="lg" asChild>
                <NavLink to="/reviews">
                  Browse Reviews <ArrowRight className="ml-2 h-5 w-5" />
                </NavLink>
              </Button>
              <Button variant="hero" size="lg" asChild>
                <NavLink to="/categories">
                  View Categories <ArrowRight className="ml-2 h-5 w-5" />
                </NavLink>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 sm:px-6 lg:px-0 my-[2px] py-0">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 py-0 my-[3px]">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose FitnesSupps?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're committed to providing you with the most accurate and helpful 
              supplement information available.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => <div key={index} className="text-center p-6 rounded-lg hover:shadow-card transition-all duration-300 animate-fade-in" style={{
            animationDelay: `${index * 0.2}s`
          }}>
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>)}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Top Rated Supplements
            </h2>
            <p className="text-lg text-muted-foreground">
              Start with our highest-rated products, trusted by thousands
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background rounded-lg p-6 shadow-card hover:shadow-hero transition-all duration-300">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-4xl">🥛</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Premium Whey Protein</h3>
              <div className="flex items-center mb-3">
                {Array.from({
                length: 5
              }, (_, i) => <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />)}
                <span className="ml-2 text-sm text-muted-foreground">4.8/5</span>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                The gold standard for muscle building and recovery
              </p>
              <div className="flex gap-2">
                <Button variant="accent" size="sm" className="flex-1" asChild>
                  <a href="https://example-store.com/whey-protein" target="_blank" rel="noopener noreferrer">
                    Buy Now
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <NavLink to="/reviews/optimum-nutrition-whey-protein">
                    Review
                  </NavLink>
                </Button>
              </div>
            </div>

            <div className="bg-background rounded-lg p-6 shadow-card hover:shadow-hero transition-all duration-300">
              <div className="aspect-square bg-gradient-to-br from-orange-500/20 to-red-600/20 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-4xl">⚡</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Pre-Workout Energy</h3>
              <div className="flex items-center mb-3">
                {Array.from({
                length: 5
              }, (_, i) => <Star key={i} className={`w-4 h-4 ${i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"}`} />)}
                <span className="ml-2 text-sm text-muted-foreground">4.2/5</span>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                Clean energy and focus for intense workouts
              </p>
              <div className="flex gap-2">
                <Button variant="accent" size="sm" className="flex-1" asChild>
                  <a href="https://example-store.com/pre-workout" target="_blank" rel="noopener noreferrer">Buy Now</a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <NavLink to="/reviews/c4-pre-workout-review">
                    Review
                  </NavLink>
                </Button>
              </div>
            </div>

            <div className="bg-background rounded-lg p-6 shadow-card hover:shadow-hero transition-all duration-300">
              <div className="aspect-square bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-4xl">💊</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Vitamin D3</h3>
              <div className="flex items-center mb-3">
                {Array.from({
                length: 5
              }, (_, i) => <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />)}
                <span className="ml-2 text-sm text-muted-foreground">4.8/5</span>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                Essential for immune support and bone health
              </p>
              <div className="flex gap-2">
                <Button variant="accent" size="sm" className="flex-1" asChild>
                  <a href="https://example-store.com/vitamin-d3" target="_blank" rel="noopener noreferrer">Buy Now</a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <NavLink to="/reviews/vitamin-d3-benefits-review">
                    Review
                  </NavLink>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Find Your Perfect Supplement?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Browse our comprehensive reviews and make informed decisions about your fitness supplements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="accent" size="lg" asChild>
              <NavLink to="/reviews">
                Start Reading Reviews <ArrowRight className="ml-2 h-5 w-5" />
              </NavLink>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="https://example-store.com" target="_blank" rel="noopener noreferrer">
                Shop All Products
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>;
};
export default Index;