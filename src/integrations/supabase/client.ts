import { createClient } from '@supabase/supabase-js';
import type { SupabaseClientOptions } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  throw new Error('Supabase environment variables are not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

const authOptions: SupabaseClientOptions<'public'>['auth'] = {
  persistSession: true,
  autoRefreshToken: true,// Codex Prompt: Add product rating visuals
// • Use icons for star ratings
// • Use comparison tables with color accents for better readability
// • Ensure tables are responsive on mobile
  ...(typeof window !== 'undefined' ? { storage: window.localStorage } : {}),
};

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: authOptions,
});
