-- Create admin roles system
CREATE TYPE public.admin_role AS ENUM ('super_admin', 'admin', 'moderator');

-- Create admin profiles table linked to Supabase auth
CREATE TABLE public.admin_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role admin_role NOT NULL DEFAULT 'admin',
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS on admin profiles
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check admin role
CREATE OR REPLACE FUNCTION public.is_admin_user(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE user_id = user_uuid
  );
$$;

-- Create function to get admin role
CREATE OR REPLACE FUNCTION public.get_admin_role(user_uuid UUID)
RETURNS admin_role
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.admin_profiles WHERE user_id = user_uuid;
$$;

-- RLS Policies for admin_profiles
CREATE POLICY "Admins can view all admin profiles" 
ON public.admin_profiles 
FOR SELECT 
USING (public.is_admin_user(auth.uid()));

CREATE POLICY "Admins can manage their own profile" 
ON public.admin_profiles 
FOR ALL 
USING (auth.uid() = user_id);

-- Update reviews table RLS policies to use proper admin check
DROP POLICY IF EXISTS "Admin can manage reviews" ON public.reviews;
CREATE POLICY "Admin can manage reviews" 
ON public.reviews 
FOR ALL 
USING (public.is_admin_user(auth.uid()));

-- Add trigger for admin profiles updated_at
CREATE TRIGGER update_admin_profiles_updated_at
  BEFORE UPDATE ON public.admin_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enhanced storage policies for admin-only access
CREATE POLICY "Admins can upload images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'review-images' AND public.is_admin_user(auth.uid()));

CREATE POLICY "Admins can update images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'review-images' AND public.is_admin_user(auth.uid()));

CREATE POLICY "Admins can delete images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'review-images' AND public.is_admin_user(auth.uid()));

-- Audit log table for security monitoring
CREATE TABLE public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on audit logs
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs" 
ON public.admin_audit_logs 
FOR SELECT 
USING (public.is_admin_user(auth.uid()));

-- Function to log admin actions
CREATE OR REPLACE FUNCTION public.log_admin_action(
  p_action TEXT,
  p_resource_type TEXT DEFAULT NULL,
  p_resource_id UUID DEFAULT NULL,
  p_details JSONB DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.admin_audit_logs (
    admin_user_id,
    action,
    resource_type,
    resource_id,
    details
  ) VALUES (
    auth.uid(),
    p_action,
    p_resource_type,
    p_resource_id,
    p_details
  );
END;
$$;