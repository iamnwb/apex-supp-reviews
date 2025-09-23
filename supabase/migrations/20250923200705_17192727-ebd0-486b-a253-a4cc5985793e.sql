-- Fix admin signup circular dependency by allowing authenticated users to create their own admin profile
CREATE POLICY "Authenticated users can create their own admin profile" 
ON public.admin_profiles 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);