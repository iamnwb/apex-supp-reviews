import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type AuthState = {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
};

type AdminProfileRow = Database['public']['Tables']['admin_profiles']['Row'];

const AuthCtx = createContext<AuthState>({
  user: null,
  loading: true,
  isAdmin: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    isAdmin: false,
  });

  useEffect(() => {
    let canceled = false;

    const applySession = async (session: Session | null) => {
      const nextState = await resolveAuthState(session);
      if (!canceled) {
        setState(nextState);
      }
    };

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      await applySession(data.session);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      void applySession(session);
    });

    void init();
    return () => {
      canceled = true;
      subscription.unsubscribe();
    };
  }, []);

  async function resolveAuthState(session: Session | null): Promise<AuthState> {
    const user = session?.user ?? null;

    if (!user) {
      return { user: null, loading: false, isAdmin: false };
    }

    const { data, error } = await supabase
      .from('admin_profiles')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle<Pick<AdminProfileRow, 'user_id'>>();

    if (error) {
      console.error('Error determining admin access:', error);
    }

    return {
      user,
      loading: false,
      isAdmin: Boolean(data),
    };
  }

  return <AuthCtx.Provider value={state}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  return useContext(AuthCtx);
}
