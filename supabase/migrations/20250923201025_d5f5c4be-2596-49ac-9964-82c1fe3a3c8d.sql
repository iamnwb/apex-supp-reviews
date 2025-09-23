-- Drop the problematic ALL policy and recreate it properly
DROP POLICY "Admins can manage their own profile" ON public.admin_profiles;

-- Create separate policies for UPDATE and DELETE (not INSERT)
CREATE POLICY "Admins can update their own profile" 
ON public.admin_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can delete their own profile" 
ON public.admin_profiles 
FOR DELETE 
USING (auth.uid() = user_id);