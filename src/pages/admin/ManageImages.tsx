import { useState, useEffect, useCallback } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAdmin } from '@/hooks/useAdmin';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Upload, Trash2, Download, Eye } from 'lucide-react';
import type { FileObject } from '@supabase/storage-js';

const ManageImages = () => {
  const { isAdminAuthenticated } = useAdmin();
  const [images, setImages] = useState<FileObject[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchImages = useCallback(async () => {
    try {
      const { data, error } = await supabase.storage
        .from('review-images')
        .list('', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        console.error('Error fetching images:', error);
        toast({
          title: "Error",
          description: "Failed to load images",
          variant: "destructive",
        });
      } else {
        setImages(data || []);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      toast({
        title: "Error",
        description: "Failed to load images",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    void fetchImages();
  }, [fetchImages]);

  const uploadImage = async (file: File) => {
    if (!file) return;

    // Import validation function
    const { validateFileUpload } = await import('@/utils/validation');
    
    // Validate file
    const validation = validateFileUpload(file);
    if (!validation.isValid) {
      toast({
        title: "Validation Error",
        description: validation.message,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('review-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Log admin action
      await supabase.rpc('log_admin_action', {
        p_action: 'image_upload',
        p_resource_type: 'review_image',
        p_details: { fileName, filePath, fileSize: file.size }
      });

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });

      // Refresh the images list
      await fetchImages();
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const toStoragePath = (file: FileObject): string => {
    if (file.name.includes('/')) {
      return file.name;
    }

    if (file.id) {
      const [, ...rest] = file.id.split('/');
      if (rest.length > 0) {
        return rest.join('/');
      }
    }

    return file.name;
  };

  const deleteImage = async (filePath: string) => {
    if (window.confirm(`Are you sure you want to delete "${filePath}"?`)) {
      try {
        const { error } = await supabase.storage
          .from('review-images')
          .remove([filePath]);

        if (error) {
          throw error;
        }

        // Log admin action
        await supabase.rpc('log_admin_action', {
          p_action: 'image_delete',
          p_resource_type: 'review_image',
          p_details: { fileName: filePath }
        });

        toast({
          title: "Success",
          description: "Image deleted successfully",
        });

        // Refresh the images list
        await fetchImages();
      } catch (error) {
        console.error('Error deleting image:', error);
        toast({
          title: "Error",
          description: "Failed to delete image",
          variant: "destructive",
        });
      }
    }
  };

  const getImageUrl = (file: FileObject) => {
    const path = toStoragePath(file);
    const { data } = supabase.storage
      .from('review-images')
      .getPublicUrl(path);
    return data.publicUrl;
  };

  const formatFileSize = (bytes: number) => {
    if (!Number.isFinite(bytes) || bytes <= 0) {
      return '0 Bytes';
    }

    const k = 1024;
    const units = ['Bytes', 'KB', 'MB', 'GB'];
    const unitIndex = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(k)));
    const prettySize = bytes / Math.pow(k, unitIndex);

    return `${prettySize.toFixed(unitIndex === 0 ? 0 : 2)} ${units[unitIndex]}`;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
            <h1 className="text-3xl font-bold text-foreground ml-4">Manage Images</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Upload Image Section */}
          <Card>
            <CardHeader>
              <CardTitle>Upload New Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      uploadImage(file);
                    }
                  }}
                  disabled={uploading}
                />
                {uploading && (
                  <div className="text-sm text-muted-foreground">
                    Uploading image...
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Images Grid */}
          <Card>
            <CardHeader>
              <CardTitle>All Images ({images.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {images.length === 0 ? (
                <p className="text-muted-foreground">No images found.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {images.map((image) => {
                    const storagePath = toStoragePath(image);
                    const publicUrl = getImageUrl(image);
                    const rawSize = image.metadata?.size;
                    const fileSize = typeof rawSize === 'number' ? rawSize : Number(rawSize ?? 0);
                    const mimeType = image.metadata?.mimetype ?? 'Unknown';
                    const displayName = storagePath.split('/').pop() ?? storagePath;

                    return (
                      <div key={image.id} className="border rounded-lg p-4 space-y-4">
                        <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                        <img
                          src={publicUrl}
                          alt={displayName}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                        />
                        </div>

                        <div className="space-y-2">
                          <h3 className="font-medium text-sm truncate" title={storagePath}>
                            {displayName}
                          </h3>
                          <div className="text-xs text-muted-foreground space-y-1">
                            <div>Size: {formatFileSize(fileSize)}</div>
                            <div>Type: {mimeType}</div>
                            <div>Uploaded: {formatDate(image.created_at)}</div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(publicUrl, '_blank')}
                            className="flex-1"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = publicUrl;
                              link.download = displayName;
                              link.click();
                            }}
                          >
                            <Download className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteImage(storagePath)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ManageImages;
