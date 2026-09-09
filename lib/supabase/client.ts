// ===================================================================
// Supabase Browser Client
// Guards against missing env vars — returns null/safe client if not configured.
// ===================================================================
import { createBrowserClient } from '@supabase/ssr';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL &&
  SUPABASE_ANON_KEY &&
  !SUPABASE_URL.includes('placeholder') &&
  !SUPABASE_ANON_KEY.includes('placeholder')
);

export function createClient() {
  if (!isSupabaseConfigured) {
    // Return a dummy client that won't throw — guarded by isSupabaseConfigured
    // before any actual network calls are made
    return createBrowserClient('https://placeholder.supabase.co', 'placeholder-key');
  }
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
