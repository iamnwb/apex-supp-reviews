import { NavLink } from "react-router-dom";
import logo from "@/assets/fitnessupps-logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-footer mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src={logo} 
                alt="FitnessSupps Logo" 
                className="h-8 w-auto"
              />
            </div>
            <p className="text-muted-foreground max-w-md">
              Your trusted source for honest, science-backed supplement reviews. 
              Helping you make informed decisions about your fitness journey.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <NavLink to="/reviews" className="text-muted-foreground hover:text-primary transition-colors">
                  Latest Reviews
                </NavLink>
              </li>
              <li>
                <NavLink to="/categories" className="text-muted-foreground hover:text-primary transition-colors">
                  Categories
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <NavLink to="/categories/protein" className="text-muted-foreground hover:text-primary transition-colors">
                  Protein
                </NavLink>
              </li>
              <li>
                <NavLink to="/categories/pre-workout" className="text-muted-foreground hover:text-primary transition-colors">
                  Pre-Workout
                </NavLink>
              </li>
              <li>
                <NavLink to="/categories/vitamins" className="text-muted-foreground hover:text-primary transition-colors">
                  Vitamins
                </NavLink>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © {currentYear} FitnessSupps. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;