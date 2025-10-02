import { ArrowRight, CheckCircle, FlaskConical, Shield, ShieldCheck, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";

const Index = () => {
  const features = [
    {
      icon: <Star className="h-8 w-8 text-primary" />,
      title: "Honest Reviews",
      description: "Unbiased, evidence-led breakdowns of every product we publish.",
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Transparent Process",
      description: "No pay-to-play placements. Editorial always discloses affiliations.",
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "Research Workflow",
      description: "Lab data, formulation analysis, and price tracking in one place.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <section className="relative overflow-hidden px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(119,196,100,0.08),_rgba(255,255,255,0.4)_60%)]" />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#77C464]">
            Supplement intelligence
          </p>
          <h1 className="font-bold text-slate-900" style={{ fontSize: "clamp(2.5rem,6vw,3.5rem)", letterSpacing: "-0.02em" }}>
            Honest reviews to power every rep
          </h1>
          <p className="max-w-2xl text-base text-slate-600 sm:text-lg">
            We’re rebuilding our review experience around fully versioned MDX research. While we migrate, explore the guides below or jump straight to the latest published review.
          </p>
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild className="h-12 w-full rounded-xl bg-[#77C464] px-6 text-base font-semibold text-white shadow-sm transition hover:shadow focus-visible:ring-2 focus-visible:ring-[#77C464]/40 sm:w-auto">
              <NavLink to="/reviews/gundry-bio-complete-3">Newest Review</NavLink>
            </Button>
            <Button
              variant="outline"
              asChild
              className="h-12 w-full rounded-xl border-slate-200 px-6 text-base font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-[#77C464]/40 sm:w-auto"
            >
              <NavLink to="/contact">Talk to the team</NavLink>
            </Button>
          </div>
          <ul className="mt-6 grid w-full grid-cols-1 gap-4 text-left text-sm text-slate-600 sm:grid-cols-3">
            <li className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <ShieldCheck className="h-4 w-4 text-[#77C464]" />
              Expert insights
            </li>
            <li className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <FlaskConical className="h-4 w-4 text-[#77C464]" />
              Evidence based
            </li>
            <li className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <CheckCircle className="h-4 w-4 text-[#77C464]" />
              Transparent sourcing
            </li>
          </ul>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#77C464]">Explore categories</p>
            <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">Start with your goal</h2>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {[{ name: "Protein", href: "/categories/protein", icon: "🥛", blurb: "Build and recover with top formulas." }, { name: "Creatine", href: "/categories/creatine", icon: "💪", blurb: "Increase strength and power output." }, { name: "Pre-Workout", href: "/categories/pre-workout", icon: "⚡", blurb: "Boost focus and energy before you train." }].map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className="group rounded-2xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#77C464]/40"
              >
                <span className="text-2xl" aria-hidden>
                  {item.icon}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{item.name}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.blurb}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#77C464]">
                  Explore
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </NavLink>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-muted/30">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#77C464]">Where we're heading</p>
          <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">Building the MDX review pipeline</h2>
          <p className="max-w-3xl text-sm text-slate-600 sm:text-base">
            All future reviews will ship as MDX with versioned research, citations, and componentised layouts. Legacy React pages have been retired while we wire in the new publishing workflow.
          </p>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why choose FitnessSupps?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We pair transparent lab testing with editorial guardrails so you can make fast, informed supplement decisions.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="text-center rounded-lg p-6 shadow-sm hover:shadow-md transition-all"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
