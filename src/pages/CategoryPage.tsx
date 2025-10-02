import { useParams } from "react-router-dom";

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 text-center text-slate-600">
      <h1 className="text-3xl font-semibold text-slate-900">{category?.replace(/-/g, " ") ?? "Category"}</h1>
      <p className="mt-4 text-sm">
        Category-specific roundups will resume after the MDX review pipeline is fully live.
        Thanks for your patience while we migrate content.
      </p>
    </div>
  );
};

export default CategoryPage;
