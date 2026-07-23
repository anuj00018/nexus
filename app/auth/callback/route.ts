// ===================================================================
// Auth Callback Route Handler — Official Supabase OAuth Code Exchange
// Supabase redirects here after official LinkedIn authentication completes.
// Exchanges authorization code for an authenticated session & sets cookies.
// ===================================================================
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const redirectTo = searchParams.get('redirectTo') ?? '/events/demo-1/nearby';
  const next = redirectTo.startsWith('/') ? redirectTo : '/events/demo-1/nearby';

  // Compute robust base origin (prefer request origin, fallback to NEXT_PUBLIC_APP_URL)
  const baseOrigin = origin && origin !== 'null'
    ? origin
    : (process.env.NEXT_PUBLIC_APP_URL || 'https://join-nexus1.vercel.app');

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Authenticated session established & session cookies set via SSR
      return NextResponse.redirect(`${baseOrigin}${next}`);
    } else {
      console.error('Supabase OAuth exchangeCodeForSession error:', error);
      return NextResponse.redirect(`${baseOrigin}/login?error=${encodeURIComponent(error.message)}`);
    }
  }

  // Missing auth code in callback URL
  return NextResponse.redirect(`${baseOrigin}/login?error=missing_auth_code`);
}
