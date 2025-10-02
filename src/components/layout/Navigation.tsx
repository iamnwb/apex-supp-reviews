import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/hooks/useAdmin";
import logoImage from "@/assets/fitnessupps-logo.png";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAdminAuthenticated } = useAdmin();

  const baseNavLinks = [
    { name: "Home", href: "/" },
    { name: "Reviews", href: "/reviews" },
    { name: "Categories", href: "/categories" },
    { name: "Contact", href: "/contact" },
  ];

  const navLinks = baseNavLinks;
  const adminLink = { name: "Admin", href: "/admin" };

  useEffect(() => {
    const hero = document.querySelector("[data-hero-marker]");
    if (!hero) {
      setScrolled(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setScrolled(!entry.isIntersecting);
      },
      { rootMargin: "-120px 0px 0px 0px" }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 shadow-[0_1px_0_rgba(15,23,42,0.06)] backdrop-blur"
          : "bg-gradient-to-b from-white/70 via-white/40 to-transparent supports-[backdrop-filter]:bg-white/40 backdrop-blur"
      }`}
      data-scrolled={scrolled ? "true" : "false"}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo Section */}
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center">
              <img 
                src={logoImage} 
                alt="FitnessSupps Logo" 
                width={160}
                height={56}
                loading="eager"
                decoding="async"
                fetchpriority="high"
                className="h-12 w-auto sm:h-14"
              />
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-baseline gap-6">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.href}
                  className={({ isActive }) =>
                    `relative px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#77C464]/40 ${
                      isActive
                        ? "text-[#0F172A] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-[#77C464]"
                        : "text-slate-600 hover:text-[#0F172A]"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              {isAdminAuthenticated && (
                <NavLink
                  key={adminLink.name}
                  to={adminLink.href}
                  className={({ isActive }) =>
                    `relative px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#77C464]/40 ${
                      isActive
                        ? "text-[#0F172A] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-[#77C464]"
                        : "text-slate-600 hover:text-[#0F172A]"
                    }`
                  }
                >
                  {adminLink.name}
                </NavLink>
              )}
            </div>
            <Button asChild className="shadow-sm">
              <a href="https://example-store.com" target="_blank" rel="noopener noreferrer">
                Check Price
              </a>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-4 pt-4 pb-6 space-y-2 bg-white/95 shadow-lg backdrop-blur">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.href}
                  className={({ isActive }) =>
                    `block rounded-lg px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#77C464]/40 ${
                      isActive ? "bg-[#E8F7EB] text-[#0F172A]" : "text-slate-600 hover:bg-slate-100"
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </NavLink>
              ))}
              {isAdminAuthenticated && (
                <NavLink
                  key={adminLink.name}
                  to={adminLink.href}
                  className={({ isActive }) =>
                    `block rounded-lg px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#77C464]/40 ${
                      isActive ? "bg-[#E8F7EB] text-[#0F172A]" : "text-slate-600 hover:bg-slate-100"
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  {adminLink.name}
                </NavLink>
              )}
              <Button className="w-full" asChild>
                <a href="https://example-store.com" target="_blank" rel="noopener noreferrer">
                  Check Price
                </a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
