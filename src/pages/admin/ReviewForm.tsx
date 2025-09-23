import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAdmin } from '@/hooks/useAdmin';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Navigate } from 'react-router-dom';
import { ArrowLeft, Upload } from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';

const ReviewForm = () => {
  const { isAdminAuthenticated } = useAdmin();
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    rating: 5,
    pros: [''],
    cons: [''],
    price: '',
    content: '',
    author: 'Admin',
    image: '',
    buyNowUrl: '',
    discountPercentage: 0,
    discountText: '',
  });

  useEffect(() => {
    if (id) {
      fetchReview();
    }
  }, [id]);

  const fetchReview = async () => {
    try {
      const { data: review, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (review) {
        setFormData({
          title: review.title,
          description: review.description,
          category: review.category,
          rating: review.rating,
          pros: review.pros || [''],
          cons: review.cons || [''],
          price: review.price,
          content: review.content,
          author: review.author,
          image: review.image || '',
          buyNowUrl: (review as any).buy_now_url || '',
          discountPercentage: (review as any).discount_percentage || 0,
          discountText: (review as any).discount_text || '',
        });
      }
    } catch (error) {
      console.error('Error fetching review:', error);
      toast({
        title: "Error",
        description: "Failed to load review",
        variant: "destructive",
      });
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `reviews/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('review-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('review-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageUrl = formData.image;
      
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const slug = generateSlug(formData.title);
      const readingTime = calculateReadingTime(formData.content);

      const reviewData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        rating: formData.rating,
        price: formData.price,
        content: formData.content,
        author: formData.author,
        slug,
        reading_time: readingTime,
        image: imageUrl,
        pros: formData.pros.filter(pro => pro.trim() !== ''),
        cons: formData.cons.filter(con => con.trim() !== ''),
        buy_now_url: formData.buyNowUrl,
        discount_percentage: formData.discountPercentage,
        discount_text: formData.discountText,
      };

      if (id) {
        const { error } = await supabase
          .from('reviews')
          .update(reviewData)
          .eq('id', id);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Review updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('reviews')
          .insert([reviewData]);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Review created successfully",
        });
      }

      navigate('/admin/reviews');
    } catch (error) {
      console.error('Error saving review:', error);
      toast({
        title: "Error",
        description: "Failed to save review",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addPro = () => {
    setFormData(prev => ({ ...prev, pros: [...prev.pros, ''] }));
  };

  const removePro = (index: number) => {
    setFormData(prev => ({
      ...prev,
      pros: prev.pros.filter((_, i) => i !== index)
    }));
  };

  const addCon = () => {
    setFormData(prev => ({ ...prev, cons: [...prev.cons, ''] }));
  };

  const removeCon = (index: number) => {
    setFormData(prev => ({
      ...prev,
      cons: prev.cons.filter((_, i) => i !== index)
    }));
  };

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <Button variant="ghost" onClick={() => navigate('/admin')} className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-foreground">
              {id ? 'Edit Review' : 'Create New Review'}
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>{id ? 'Edit Review' : 'Create New Review'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="protein">Protein</SelectItem>
                      <SelectItem value="pre-workout">Pre-Workout</SelectItem>
                      <SelectItem value="vitamins">Vitamins</SelectItem>
                      <SelectItem value="bcaa">BCAA</SelectItem>
                      <SelectItem value="creatine">Creatine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rating">Rating (1-5)</Label>
                  <Input
                    id="rating"
                    type="number"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="e.g., $29.99"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="buyNowUrl">Buy Now URL</Label>
                  <Input
                    id="buyNowUrl"
                    value={formData.buyNowUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, buyNowUrl: e.target.value }))}
                    placeholder="https://affiliate-link.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discountPercentage">Discount Percentage</Label>
                  <Input
                    id="discountPercentage"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discountPercentage}
                    onChange={(e) => setFormData(prev => ({ ...prev, discountPercentage: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 }))}
                    placeholder="25"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountText">Discount Text</Label>
                <Input
                  id="discountText"
                  value={formData.discountText}
                  onChange={(e) => setFormData(prev => ({ ...prev, discountText: e.target.value }))}
                  placeholder="Save up to 25% on Whey Protein"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                <div className="flex items-center gap-3">
                  <label htmlFor="image" className="px-4 py-2 border border-input rounded-md bg-background hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors">
                    Choose File
                  </label>
                  <span className="text-sm text-muted-foreground">
                    {imageFile ? imageFile.name : "No file chosen"}
                  </span>
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </div>
                {formData.image && (
                  <img src={formData.image} alt="Current" className="mt-2 h-20 w-20 object-cover rounded" />
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Pros</Label>
                  {formData.pros.map((pro, index) => (
                    <div key={index} className="flex gap-2 mt-2">
                      <Input
                        value={pro}
                        onChange={(e) => {
                          const newPros = [...formData.pros];
                          newPros[index] = e.target.value;
                          setFormData(prev => ({ ...prev, pros: newPros }));
                        }}
                        placeholder="Enter a pro"
                      />
                      <Button type="button" variant="outline" onClick={() => removePro(index)}>
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addPro} className="mt-2">
                    Add Pro
                  </Button>
                </div>

                <div>
                  <Label>Cons</Label>
                  {formData.cons.map((con, index) => (
                    <div key={index} className="flex gap-2 mt-2">
                      <Input
                        value={con}
                        onChange={(e) => {
                          const newCons = [...formData.cons];
                          newCons[index] = e.target.value;
                          setFormData(prev => ({ ...prev, cons: newCons }));
                        }}
                        placeholder="Enter a con"
                      />
                      <Button type="button" variant="outline" onClick={() => removeCon(index)}>
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addCon} className="mt-2">
                    Add Con
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Review Content</Label>
                <div className="min-h-[400px]">
                  <MDEditor
                    value={formData.content}
                    onChange={(value) => setFormData(prev => ({ ...prev, content: value || '' }))}
                    height={400}
                    preview="edit"
                    data-color-mode="light"
                  />
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  Use markdown formatting for headers (## H2, ### H3), **bold**, *italic*, lists, and links.
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : (id ? 'Update Review' : 'Create Review')}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate('/admin')}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ReviewForm;