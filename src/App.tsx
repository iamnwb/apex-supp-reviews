import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import Reviews from "./pages/Reviews";
import ReviewDetail from "./pages/ReviewDetail";
import Categories from "./pages/Categories";
import CategoryPage from "./pages/CategoryPage";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import { AdminProvider } from "./hooks/useAdmin";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ReviewForm from "./pages/admin/ReviewForm";
import ReviewList from "./pages/admin/ReviewList";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AdminProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Admin routes without Layout */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/reviews" element={<ReviewList />} />
            <Route path="/admin/reviews/new" element={<ReviewForm />} />
            <Route path="/admin/reviews/edit/:id" element={<ReviewForm />} />
            
            {/* Public routes with Layout */}
            <Route path="/*" element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/reviews" element={<Reviews />} />
                  <Route path="/reviews/:slug" element={<ReviewDetail />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/categories/:category" element={<CategoryPage />} />
                  <Route path="/contact" element={<Contact />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AdminProvider>
  </QueryClientProvider>
);

export default App;
