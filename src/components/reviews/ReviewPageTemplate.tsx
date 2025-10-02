import { ReactNode, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookmarkCheck, HelpCircle, Info } from "lucide-react";
import StickyReviewCta from "./StickyReviewCta";

export type ReviewPageProps = {
  title: string;
  category?: { label: string; href: string };
  heroSummary?: ReactNode;
  quickVerdict?: ReactNode;
  pros?: ReactNode;
  cons?: ReactNode;
  howItWorks?: ReactNode;
  ingredients?: ReactNode;
  benefits?: ReactNode;
  safety?: ReactNode;
  dosage?: ReactNode;
  price?: ReactNode;
  comparisons?: ReactNode;
  faqs?: ReactNode;
  references?: ReactNode;
  bottomCta?: {
    title?: string;
    message?: string;
    primaryHref: string;
    secondaryHref?: string;
    productName?: string;
    priceRange?: string;
  };
  quickVerdictData?: {
    verdict: string;
    score: number;
    topPros: string[];
    watchOut?: string;
    priceRange?: string;
    primaryHref: string;
  };
};

const defaultParagraph = (
  <p className="text-sm leading-relaxed text-slate-600">
    Content coming soon. Our editorial team is preparing detailed research for this section.
  </p>
);

const ReviewPageTemplate = ({
  title,
  category,
  heroSummary,
  quickVerdict,
  pros,
  cons,
  howItWorks,
  ingredients,
  benefits,
  safety,
  dosage,
  price,
  comparisons,
  faqs,
  references,
  bottomCta,
  quickVerdictData,
}: ReviewPageProps) => {
  const sections = useMemo(
    () =>
      [
        {
          id: "quick-verdict",
          label: "Quick verdict",
          content: quickVerdict ?? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Quick verdict</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {quickVerdictData?.verdict ?? "We’re finalising lab data and pricing trends. Check back soon for the full verdict."}
                  </p>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-[#F1FAF1] px-4 py-3 text-[#2E7D32]">
                  <span className="text-sm font-semibold">Score</span>
                  <span className="text-2xl font-bold">
                    {quickVerdictData?.score ?? 0}/10
                  </span>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Top pros</h3>
                  <ul className="mt-3 space-y-2 text-sm text-slate-600">
                    {(quickVerdictData?.topPros ?? ["Strong amino profile", "Clinically dosed", "Transparent label"]).slice(0, 3).map((pro, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#77C464]" aria-hidden />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Watch out for</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {quickVerdictData?.watchOut ?? "Flavor can be sweet for some palates."}
                  </p>
                  <p className="mt-3 text-xs uppercase tracking-wide text-slate-400">
                    Price range: {quickVerdictData?.priceRange ?? "TBC"}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  className="h-11 flex-1 rounded-xl bg-[#77C464] text-white hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[#77C464]/40"
                >
                  <a href={quickVerdictData?.primaryHref ?? "#"}>Buy Now</a>
                </Button>
                <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-xs text-slate-500">
                  <Info className="h-3.5 w-3.5 text-[#77C464]" />
                  <span>Evidence checked</span>
                  <a href="#references" className="font-semibold text-[#77C464] hover:underline">
                    View references
                  </a>
                </div>
              </div>
            </div>
          ),
        },
        {
          id: "pros-cons",
          label: "Pros & Cons",
          content: (
            <div className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Pros</h2>
                {pros ?? defaultParagraph}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Cons</h2>
                {cons ?? defaultParagraph}
              </div>
            </div>
          ),
        },
        {
          id: "how-it-works",
          label: "How it works",
          content: (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">How it works</h2>
              {howItWorks ?? defaultParagraph}
            </section>
          ),
        },
        {
          id: "ingredients",
          label: "Ingredients & evidence",
          content: (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Ingredients &amp; evidence</h2>
              {ingredients ?? defaultParagraph}
            </section>
          ),
        },
        {
          id: "benefits",
          label: "Benefits",
          content: (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Benefits &amp; who it suits</h2>
              {benefits ?? defaultParagraph}
            </section>
          ),
        },
        {
          id: "safety",
          label: "Safety",
          content: (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Side effects &amp; safety</h2>
              {safety ?? defaultParagraph}
            </section>
          ),
        },
        {
          id: "dosage",
          label: "Dosage",
          content: (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Dosage &amp; timing</h2>
              {dosage ?? defaultParagraph}
            </section>
          ),
        },
        {
          id: "price",
          label: "Price",
          content: (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Price &amp; value</h2>
              {price ?? defaultParagraph}
            </section>
          ),
        },
        {
          id: "comparisons",
          label: "Comparisons",
          content: (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Comparisons &amp; alternatives</h2>
              {comparisons ?? defaultParagraph}
            </section>
          ),
        },
        {
          id: "faqs",
          label: "FAQs",
          content: (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Frequently asked questions</h2>
              {faqs ?? defaultParagraph}
            </section>
          ),
        },
        {
          id: "references",
          label: "References",
          content: (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">References</h2>
              {references ?? (
                <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-600">
                  <li>Add peer-reviewed citations to support claims.</li>
                </ol>
              )}
            </section>
          ),
        },
      ].filter(Boolean),
    [
      quickVerdict,
      pros,
      cons,
      howItWorks,
      ingredients,
      benefits,
      safety,
      dosage,
      price,
      comparisons,
      faqs,
      references,
      quickVerdictData,
    ]
  );

  return (
    <div className="bg-[#F8FAFC]">
      <header className="relative overflow-hidden px-4 pb-16 pt-20 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(119,196,100,0.1),_rgba(255,255,255,0.6)_60%)]" />
        <div className="relative mx-auto flex max-w-4xl flex-col gap-4 text-center">
          {category && (
            <NavLink
              to={category.href}
              className="mx-auto inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#77C464] shadow-sm ring-1 ring-[#77C464]/20 backdrop-blur focus:outline-none focus-visible:ring-2 focus-visible:ring-[#77C464]/40"
            >
              {category.label}
            </NavLink>
          )}
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl lg:text-[2.75rem]" style={{ letterSpacing: "-0.015em" }}>
            {title}
          </h1>
          <div className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            {heroSummary ?? (
              <p>
                Concise overview of this supplement covering what it is, who it serves, and the overall recommendation.
              </p>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-20 sm:px-6 lg:grid-cols-[260px,1fr] lg:px-8">
        {/* Mobile TOC */}
        <div className="lg:hidden">
          <details className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-slate-900">
              Review guide
              <BookmarkCheck className="h-4 w-4 text-[#77C464]" />
            </summary>
            <nav className="mt-4 space-y-3 text-sm text-slate-600">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block rounded-lg px-3 py-2 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#77C464]/40"
                >
                  {section.label}
                </a>
              ))}
            </nav>
          </details>
        </div>

        {/* Desktop TOC */}
        <aside className="sticky top-28 hidden max-h-[calc(100vh-8rem)] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:block">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <BookmarkCheck className="h-4 w-4 text-[#77C464]" />
            Review guide
          </div>
          <nav className="mt-4 space-y-2 text-sm text-slate-600">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="block rounded-lg px-3 py-2 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#77C464]/40"
              >
                {section.label}
              </a>
            ))}
          </nav>
        </aside>

        <div className="space-y-14">
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              {section.content}
            </section>
          ))}

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Still comparing?</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {bottomCta?.message ?? "See pricing from trusted retailers and check our current top recommendations."}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="h-11 flex-1 rounded-xl bg-[#77C464] text-white hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[#77C464]/40"
              >
                <a href={bottomCta?.primaryHref ?? "#"}>
                  {bottomCta?.title ?? "Check Price"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-11 flex-1 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-[#77C464]/40"
              >
                <a href={bottomCta?.secondaryHref ?? "/reviews"}>See Best Offer</a>
              </Button>
            </div>
          </section>
        </div>
      </div>
      <StickyReviewCta
        productName={bottomCta?.productName ?? title}
        priceRange={bottomCta?.priceRange ?? quickVerdictData?.priceRange}
        primaryHref={quickVerdictData?.primaryHref ?? bottomCta?.primaryHref ?? "#"}
      />
    </div>
  );
};

export default ReviewPageTemplate;
