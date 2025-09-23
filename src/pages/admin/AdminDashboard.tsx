import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdmin } from '@/hooks/useAdmin';
import { supabase } from '@/integrations/supabase/client';
import { PlusCircle, FileText, Users, LogOut } from 'lucide-react';
const AdminDashboard = () => {
  const {
    isAdminAuthenticated,
    logout
  } = useAdmin();
  const [stats, setStats] = useState({
    totalReviews: 0,
    totalCategories: 0
  });
  useEffect(() => {
    fetchStats();
  }, []);
  const fetchStats = async () => {
    try {
      const {
        data: reviews
      } = await supabase.from('reviews').select('category');
      const totalReviews = reviews?.length || 0;
      const categories = new Set(reviews?.map(r => r.category));
      const totalCategories = categories.size;
      setStats({
        totalReviews,
        totalCategories
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };
  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <Button variant="outline" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReviews}</div>
            </CardContent>
          </Card>

          <Card>
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
          <Card>
            <CardHeader>
              <CardTitle>Review Management</CardTitle>
              <CardDescription>
                Create, edit, and manage product reviews
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to="/admin/reviews/new">
                <Button className="w-full">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add New Review
                </Button>
              </Link>
              <Link to="/admin/reviews">
                <Button variant="outline" className="w-full my-[15px]">
                  <FileText className="w-4 h-4 mr-2" />
                  Manage Reviews
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common administrative tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to="/admin/categories">
                <Button variant="outline" className="w-full">
                  Manage Categories
                </Button>
              </Link>
              <Link to="/admin/images">
                <Button variant="outline" className="w-full my-[15px]">
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