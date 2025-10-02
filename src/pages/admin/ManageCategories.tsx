import { useState, useEffect, useCallback } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAdmin } from '@/hooks/useAdmin';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

interface CategoryWithCount {
  name: string;
  reviewCount: number;
}

const ManageCategories = () => {
  const { isAdminAuthenticated } = useAdmin();
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCategories = useCallback(async () => {
    try {
      const { data: reviews } = await supabase
        .from('reviews')
        .select('category');

      if (reviews) {
        const categoryMap = new Map<string, number>();
        reviews.forEach(review => {
          const count = categoryMap.get(review.category) || 0;
          categoryMap.set(review.category, count + 1);
        });

        const categoriesWithCount = Array.from(categoryMap.entries()).map(([name, reviewCount]) => ({
          name,
          reviewCount
        }));

        setCategories(categoriesWithCount.sort((a, b) => a.name.localeCompare(b.name)));
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  const addCategory = async () => {
    if (!newCategory.trim()) {
      toast({
        title: "Error",
        description: "Please enter a category name",
        variant: "destructive",
      });
      return;
    }

    if (categories.some(cat => cat.name.toLowerCase() === newCategory.toLowerCase())) {
      toast({
        title: "Error",
        description: "Category already exists",
        variant: "destructive",
      });
      return;
    }

    // For now, just add to local state. In a real app, you'd store categories in a separate table
    const newCat: CategoryWithCount = {
      name: newCategory.trim(),
      reviewCount: 0
    };

    setCategories([...categories, newCat].sort((a, b) => a.name.localeCompare(b.name)));
    setNewCategory('');
    
    toast({
      title: "Success",
      description: "Category added successfully",
    });
  };

  const deleteCategory = async (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    
    if (category && category.reviewCount > 0) {
      toast({
        title: "Error",
        description: `Cannot delete category "${categoryName}" as it has ${category.reviewCount} review(s)`,
        variant: "destructive",
      });
      return;
    }

    if (window.confirm(`Are you sure you want to delete the category "${categoryName}"?`)) {
      setCategories(prev => prev.filter(cat => cat.name !== categoryName));
      
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    }
  };

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <Link to="/admin">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground ml-4">Manage Categories</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Add Category Section */}
          <Card>
            <CardHeader>
              <CardTitle>Add New Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Enter category name"
                  onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                />
                <Button onClick={addCategory}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Categories List */}
          <Card>
            <CardHeader>
              <CardTitle>All Categories ({categories.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {categories.length === 0 ? (
                <p className="text-muted-foreground">No categories found.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category Name</TableHead>
                      <TableHead className="text-right">Reviews</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category.name}>
                        <TableCell className="font-medium">
                          {category.name}
                        </TableCell>
                        <TableCell className="text-right">
                          {category.reviewCount}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteCategory(category.name)}
                            disabled={category.reviewCount > 0}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ManageCategories;
