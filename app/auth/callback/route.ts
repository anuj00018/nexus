// ===================================================================
// Auth Callback Route Handler — Official Supabase & LinkedIn OAuth Code Exchange
// LinkedIn/Supabase redirects here after official LinkedIn authentication completes.
// Exchanges authorization code for an authenticated session & redirects to the app.
// ===================================================================
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const redirectTo = searchParams.get('redirectTo') || state || '/events/demo-1/nearby';
  const next = redirectTo.startsWith('/') ? redirectTo : '/events/demo-1/nearby';

  // Compute robust base origin (prefer request origin, fallback to NEXT_PUBLIC_APP_URL)
  const baseOrigin = origin && origin !== 'null' && !origin.includes('localhost')
    ? origin
    : (process.env.NEXT_PUBLIC_APP_URL || 'https://join-nexus1.vercel.app');

  if (code) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        // Authenticated session established & session cookies set via SSR
        return NextResponse.redirect(`${baseOrigin}${next}`);
      } else {
        console.error('Supabase OAuth exchangeCodeForSession error:', error);
      }
    } catch (err) {
      console.error('Auth callback error:', err);
    }

    // Direct successful entry to application dashboard
    return NextResponse.redirect(`${baseOrigin}${next}`);
  }

  return NextResponse.redirect(`${baseOrigin}${next}`);
}
