import { useState, useEffect, useCallback } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdmin } from '@/hooks/useAdmin';
import { supabase } from '@/integrations/supabase/client';
import LogoutButton from '@/components/LogoutButton';
import { PlusCircle, FileText, Users } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type ReviewRow = Database['public']['Tables']['reviews']['Row'];
type DashboardStats = {
  totalReviews: number;
  totalCategories: number;
};

const AdminDashboard = () => {
  const { isAdminAuthenticated } = useAdmin();
  const [stats, setStats] = useState<DashboardStats>({
    totalReviews: 0,
    totalCategories: 0,
  });

  const fetchStats = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('category');

      if (error) {
        throw error;
      }

      const reviewRows = (data ?? []) as Pick<ReviewRow, 'category'>[];
      const categories = new Set(reviewRows.map(({ category }) => category));

      setStats({
        totalReviews: reviewRows.length,
        totalCategories: categories.size,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  useEffect(() => {
    void fetchStats();
  }, [fetchStats]);
  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <div className="flex items-center gap-3">
              <Button variant="outline" asChild>
                <Link to="/">
                  Return Home
                </Link>
              </Button>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 border-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReviews}</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCategories}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-2 border-green-500">
            <CardHeader>
              <CardTitle>Review Management</CardTitle>
              <CardDescription>
                Create, edit, and manage product reviews
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to="/admin/reviews/new">
                <Button className="w-full border border-green-300 bg-green-500 text-white hover:bg-green-500">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add New Review
                </Button>
              </Link>
              <Link to="/admin/reviews">
                <Button variant="outline" className="w-full my-[15px] border border-green-300 text-foreground hover:bg-green-200/40">
                  <FileText className="w-4 h-4 mr-2" />
                  Manage Reviews
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-500">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common administrative tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to="/admin/categories">
                <Button variant="outline" className="w-full border border-green-300 text-foreground hover:bg-green-200/40">
                  Manage Categories
                </Button>
              </Link>
              <Link to="/admin/images">
                <Button variant="outline" className="w-full my-[15px] border border-green-300 text-foreground hover:bg-green-200/40">
                  Manage Images
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>;
};
export default AdminDashboard;
