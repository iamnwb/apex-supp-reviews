import { NavLink } from "react-router-dom";
import logo from "@/assets/fitnessupps-logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-24 overflow-hidden bg-[#F8FAFC]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white via-white/90 to-transparent" />
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 pb-16 pt-12 sm:px-6 lg:flex-row lg:items-start lg:justify-between lg:px-8">
        <div className="max-w-md text-slate-600">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="FitnessSupps Logo"
              width={150}
              height={52}
              loading="lazy"
              decoding="async"
              className="h-12 w-auto"
            />
          </div>
          <p className="mt-4 text-sm leading-relaxed">
            Science-backed reviews to help you choose supplements with clarity and confidence.
          </p>
          <p className="mt-6 text-xs text-slate-400">© {currentYear} FitnesSupps. All rights reserved.</p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap gap-4 text-sm text-slate-600">
          {[
            { label: "Reviews", href: "/reviews" },
            { label: "Categories", href: "/categories" },
            { label: "Contact", href: "/contact" },
            { label: "Disclosures", href: "/disclosures" },
            { label: "Privacy", href: "/privacy" },
          ].map((item) => (
            <NavLink
              key={item.label}
              to={item.href}
              className="rounded-full px-3 py-2 transition hover:text-[#77C464] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#77C464]/40"
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
