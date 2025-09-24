-- Fix critical security vulnerability: Restrict admin profile creation
-- Only super-admins can create new admin profiles, with bootstrap exception for first admin

-- Drop the insecure INSERT policy
DROP POLICY "Authenticated users can create their own admin profile" ON public.admin_profiles;

-- Create secure function to check if user can create admin profile
CREATE OR REPLACE FUNCTION public.can_create_admin_profile()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT 
    -- Allow if no admin profiles exist yet (bootstrap case)
    NOT EXISTS (SELECT 1 FROM public.admin_profiles)
    OR
    -- Allow if current user is a super-admin
    EXISTS (
      SELECT 1 FROM public.admin_profiles 
      WHERE user_id = auth.uid() AND role = 'super_admin'
    );
$$;

-- Create secure INSERT policy
CREATE POLICY "Secure admin profile creation" 
ON public.admin_profiles 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id 
  AND public.can_create_admin_profile()
);