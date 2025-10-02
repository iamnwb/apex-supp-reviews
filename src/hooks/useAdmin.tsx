import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { supabase } from '@/integrations/supabase/client';
import { type User, type Session } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

type AdminProfileRow = Database['public']['Tables']['admin_profiles']['Row'];
type AdminLogDetails = Database['public']['Tables']['admin_audit_logs']['Insert']['details'];

interface AdminContextType {
  isAdminAuthenticated: boolean;
  user: User | null;
  session: Session | null;
  adminProfile: AdminProfileRow | null;
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
  const [adminProfile, setAdminProfile] = useState<AdminProfileRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleSession = async (nextSession: Session | null) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);

      if (nextSession?.user) {
        const { data: profile, error } = await supabase
          .from('admin_profiles')
          .select('*')
          .eq('user_id', nextSession.user.id)
          .maybeSingle<AdminProfileRow>();

        if (error) {
          console.error('Failed to load admin profile', error);
        }

        if (profile && !error) {
          setAdminProfile(profile);
          setIsAdminAuthenticated(true);

          setTimeout(() => {
            void supabase.rpc('log_admin_action', {
              p_action: 'admin_login',
              p_details: { timestamp: new Date().toISOString() } satisfies AdminLogDetails,
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
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      void handleSession(session);
    });

    void supabase.auth.getSession().then(({ data }) => handleSession(data.session));

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
          .maybeSingle<AdminProfileRow>();

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
        void supabase.rpc('log_admin_action', {
          p_action: 'admin_logout',
          p_details: { timestamp: new Date().toISOString() } satisfies AdminLogDetails,
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
