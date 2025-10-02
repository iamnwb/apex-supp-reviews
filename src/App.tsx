import { Routes, Route } from "react-router-dom";
import { RequireAdmin } from "@/components/RouteGuards";
import Layout from "@/components/layout/Layout";

import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminLogin from "@/pages/admin/AdminLogin";
import ReviewList from "@/pages/admin/ReviewList";
import ReviewForm from "@/pages/admin/ReviewForm";
import ManageCategories from "@/pages/admin/ManageCategories";
import ManageImages from "@/pages/admin/ManageImages";

import Index from "@/pages/Index";
import Reviews from "@/pages/Reviews";
import ReviewDetail from "@/pages/ReviewDetail";
import Categories from "@/pages/Categories";
import CategoryPage from "@/pages/CategoryPage";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Index />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/reviews/:slug" element={<ReviewDetail />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/:slug" element={<CategoryPage />} />
        <Route path="/contact" element={<Contact />} />
        {/* fallback */}
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Public login page for admins */}
      <Route path="/login" element={<AdminLogin />} />

      {/* Protected admin pages */}
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminDashboard />
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/reviews"
        element={
          <RequireAdmin>
            <ReviewList />
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/reviews/new"
        element={
          <RequireAdmin>
            <ReviewForm />
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/reviews/edit/:id"
        element={
          <RequireAdmin>
            <ReviewForm />
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/categories"
        element={
          <RequireAdmin>
            <ManageCategories />
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/images"
        element={
          <RequireAdmin>
            <ManageImages />
          </RequireAdmin>
        }
      />
    </Routes>
  );
}

export default App;
