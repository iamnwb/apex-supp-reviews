import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAdmin } from '@/hooks/useAdmin';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Edit, Trash2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ReviewList = () => {
  const { isAdminAuthenticated } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: "Error",
        description: "Failed to load reviews",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setReviews(prev => prev.filter(review => review.id !== id));
      toast({
        title: "Success",
        description: "Review deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting review:', error);
      toast({
        title: "Error",
        description: "Failed to delete review",
        variant: "destructive",
      });
    }
  };

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Button variant="ghost" onClick={() => navigate('/admin')} className="mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-3xl font-bold text-foreground">Manage Reviews</h1>
            </div>
            <Link to="/admin/reviews/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add New Review
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>All Reviews ({reviews.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading reviews...</div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No reviews found. Create your first review!</p>
                <Link to="/admin/reviews/new">
                  <Button className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Review
                  </Button>
                </Link>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          {review.image && (
                            <img 
                              src={review.image} 
                              alt={review.title}
                              className="w-10 h-10 object-cover rounded"
                            />
                          )}
                          <div>
                            <div className="font-medium">{review.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {review.description.substring(0, 50)}...
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{review.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {'★'.repeat(review.rating)}
                          <span className="ml-1 text-sm text-muted-foreground">
                            ({review.rating}/5)
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{review.author}</TableCell>
                      <TableCell>
                        {new Date(review.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link to={`/admin/reviews/edit/${review.id}`}>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteReview(review.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ReviewList;