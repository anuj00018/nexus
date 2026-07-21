// ===================================================================
// Supabase Browser Client
// Guards against missing env vars — returns null if not configured.
// ===================================================================
import { createBrowserClient } from '@supabase/ssr';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const isSupabaseConfigured = !!(SUPABASE_URL && SUPABASE_ANON_KEY);

export function createClient() {
  if (!isSupabaseConfigured) {
    // Return a dummy client that won't throw — guarded by isSupabaseConfigured
    // before any actual calls are made
    return createBrowserClient('https://placeholder.supabase.co', 'placeholder-key');
  }
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
