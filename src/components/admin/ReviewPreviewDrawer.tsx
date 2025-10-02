import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { getMdxReviewBySlug } from "@/utils/mdxReviews";

interface ReviewPreviewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  reviewSlug: string | null;
}

export const ReviewPreviewDrawer = ({ isOpen, onClose, reviewSlug }: ReviewPreviewDrawerProps) => {
  const entry = useMemo(() => (reviewSlug ? getMdxReviewBySlug(reviewSlug) : null), [reviewSlug]);
  const frontmatter = entry?.frontmatter ?? {};

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-3xl overflow-y-auto">
        <SheetHeader className="pb-6">
          <SheetTitle className="text-xl font-bold">Review Preview</SheetTitle>
          <SheetDescription>MDX-based review previews are read-only.</SheetDescription>
        </SheetHeader>

        {!entry ? (
          <div className="py-16 text-center text-sm text-slate-600">
            Select an MDX review to preview its frontmatter.
          </div>
        ) : (
          <div className="space-y-6">
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-slate-400">Title</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">{frontmatter.title as string}</h2>
              {frontmatter.subtitle ? (
                <p className="mt-3 text-sm text-slate-600">{frontmatter.subtitle as string}</p>
              ) : null}
            </section>

            <section className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">Frontmatter snapshot</p>
              <pre className="mt-3 overflow-x-auto rounded-lg bg-white p-4 text-left text-xs text-slate-700">
                {JSON.stringify(frontmatter, null, 2)}
              </pre>
              <p className="mt-3 text-xs text-slate-500">
                Edit the MDX file at <code className="rounded bg-slate-100 px-1 py-0.5">src/content/reviews/{reviewSlug}.mdx</code> to update this preview.
              </p>
            </section>

            <div className="flex justify-end">
              <Button onClick={onClose} variant="outline">
                Close
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
