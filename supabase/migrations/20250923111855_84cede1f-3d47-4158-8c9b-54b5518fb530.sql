-- Create reviews table
CREATE TABLE public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  pros TEXT[] NOT NULL DEFAULT '{}',
  cons TEXT[] NOT NULL DEFAULT '{}',
  price TEXT NOT NULL,
  image TEXT,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  reading_time TEXT,
  content TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'Admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (since reviews are public)
CREATE POLICY "Reviews are publicly readable" 
ON public.reviews 
FOR SELECT 
USING (true);

-- Create admin_users table for simple admin authentication
CREATE TABLE public.admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for admin users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Only allow admins to access admin_users table
CREATE POLICY "Only authenticated admins can access admin_users" 
ON public.admin_users 
FOR ALL 
USING (false);

-- Admin policies for reviews (will be controlled by admin authentication in the app)
CREATE POLICY "Admin can manage reviews" 
ON public.reviews 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default admin user (password: admin123 - change this!)
INSERT INTO public.admin_users (username, password_hash) 
VALUES ('admin', '$2a$10$rOvHrPwv6jI5.2jN5pYDOOX9YvZvZhZlQI8p5wKwvQ5tYlXn0QqAy');

-- Create storage bucket for review images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('review-images', 'review-images', true);

-- Create storage policies for review images
CREATE POLICY "Review images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'review-images');

CREATE POLICY "Admin can upload review images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'review-images');

CREATE POLICY "Admin can update review images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'review-images');

CREATE POLICY "Admin can delete review images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'review-images');