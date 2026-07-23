// ===================================================================
// Auth Callback Route Handler — Official Supabase & LinkedIn OAuth Code Exchange
// Exchanges authorization code for an authenticated session.
// First-time users redirect to /onboarding; returning users redirect to event/dashboard.
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
        // Check if user has completed onboarding
        const { data: { user: sbUser } } = await supabase.auth.getUser();

        if (sbUser) {
          const { data: prefs } = await supabase
            .from('user_preferences')
            .select('onboarding_done')
            .eq('user_id', sbUser.id)
            .single();

          // First-time login — send directly to /onboarding
          if (!prefs?.onboarding_done) {
            return NextResponse.redirect(`${baseOrigin}/onboarding`);
          }
        }

        // Returning user — send to destination room / dashboard
        return NextResponse.redirect(`${baseOrigin}${next}`);
      } else {
        console.error('Supabase OAuth exchangeCodeForSession error:', error);
      }
    } catch (err) {
      console.error('Auth callback error:', err);
    }

    return NextResponse.redirect(`${baseOrigin}${next}`);
  }

  return NextResponse.redirect(`${baseOrigin}${next}`);
}
