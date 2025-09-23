import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AdminContextType {
  isAdminAuthenticated: boolean;
  user: User | null;
  session: Session | null;
  adminProfile: any | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, displayName?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [adminProfile, setAdminProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Check if user is an admin
          const { data: profile, error } = await supabase
            .from('admin_profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .maybeSingle();
          
          if (profile && !error) {
            setAdminProfile(profile);
            setIsAdminAuthenticated(true);
            
            // Log admin login
            setTimeout(() => {
              supabase.rpc('log_admin_action', {
                p_action: 'admin_login',
                p_details: { timestamp: new Date().toISOString() }
              });
            }, 0);
          } else {
            setAdminProfile(null);
            setIsAdminAuthenticated(false);
          }
        } else {
          setAdminProfile(null);
          setIsAdminAuthenticated(false);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Check if user is an admin
      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('admin_profiles')
          .select('*')
          .eq('user_id', data.user.id)
          .maybeSingle();

        if (!profile || profileError) {
          await supabase.auth.signOut();
          return { success: false, error: 'Access denied. Admin privileges required.' };
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const signup = async (email: string, password: string, displayName?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const redirectUrl = `${window.location.origin}/admin`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            display_name: displayName
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Create admin profile
        const { error: profileError } = await supabase
          .from('admin_profiles')
          .insert({
            user_id: data.user.id,
            display_name: displayName || email.split('@')[0],
            role: 'admin'
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          return { success: false, error: 'Failed to create admin profile' };
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const logout = async () => {
    try {
      // Log admin logout
      if (user) {
        supabase.rpc('log_admin_action', {
          p_action: 'admin_logout',
          p_details: { timestamp: new Date().toISOString() }
        });
      }
      
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AdminContext.Provider value={{ 
      isAdminAuthenticated, 
      user, 
      session, 
      adminProfile, 
      login, 
      signup, 
      logout, 
      loading 
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};