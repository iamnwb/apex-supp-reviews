import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface StickyReviewCtaProps {
  productName: string;
  priceRange?: string;
  primaryHref: string;
}

const STICKY_THRESHOLD = 0.6;

const StickyReviewCta = ({ productName, priceRange, primaryHref }: StickyReviewCtaProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollFraction =
        window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      setVisible(scrollFraction > STICKY_THRESHOLD);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
      <div className="flex w-full max-w-2xl flex-col gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur supports-[backdrop-filter]:bg-white/80 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1 text-left text-sm">
          <span className="font-semibold text-slate-900">{productName}</span>
          {priceRange && <span className="text-xs text-slate-500">From {priceRange}</span>}
        </div>
        <Button
          asChild
          className="h-11 rounded-xl bg-[#77C464] px-6 text-white shadow hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[#77C464]/40"
        >
          <a href={primaryHref}>
            Buy Now
          </a>
        </Button>
      </div>
    </div>
  );
};

export default StickyReviewCta;
