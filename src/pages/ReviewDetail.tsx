import { useParams } from "react-router-dom";
import { getMdxReviewBySlug } from "@/utils/mdxReviews";

const ReviewDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const mdxReview = slug ? getMdxReviewBySlug(slug) : null;

  if (!mdxReview) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center text-slate-600">
        <h1 className="text-3xl font-semibold text-slate-900">Review not available</h1>
        <p className="mt-4 text-sm">
          We couldn’t locate that review. Confirm the MDX file exists under
          <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5">src/content/reviews</code>
          and that the slug matches the route.
        </p>
      </div>
    );
  }

  const MdxComponent = mdxReview.component;
  return (
    <div className="bg-[#F8FAFC]">
      <MdxComponent />
    </div>
  );
};

export default ReviewDetail;
