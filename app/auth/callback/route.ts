// ===================================================================
// Auth Callback Route Handler — Official Supabase & LinkedIn OAuth Code Exchange
// Exchanges authorization code for an authenticated session.
// First-time users redirect to /onboarding; returning users redirect to /dashboard.
// ===================================================================
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const redirectTo = searchParams.get('redirectTo') || state || '/dashboard';
  const next = redirectTo.startsWith('/') ? redirectTo : '/dashboard';

  const baseOrigin = origin && origin !== 'null' && !origin.includes('localhost')
    ? origin
    : (process.env.NEXT_PUBLIC_APP_URL || 'https://join-nexus1.vercel.app');

  if (code) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        const { data: { user: sbUser } } = await supabase.auth.getUser();

        if (sbUser) {
          const { data: prefs } = await supabase
            .from('user_preferences')
            .select('onboarding_done')
            .eq('user_id', sbUser.id)
            .single();

          // First-time login — route to /onboarding
          if (!prefs?.onboarding_done) {
            return NextResponse.redirect(`${baseOrigin}/onboarding`);
          }
        }

        // Returning user — route to /dashboard
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
