// ===================================================================
// Auth Callback Route Handler — Official Supabase & LinkedIn OAuth Code Exchange
// Exchanges authorization code for an authenticated session.
// First-time users redirect to /onboarding; returning users redirect to /dashboard.
// Includes detailed logging and explicit error parameter handling.
// ===================================================================
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  const redirectTo = searchParams.get('redirectTo') || state || '/dashboard';
  const next = redirectTo.startsWith('/') ? redirectTo : '/dashboard';

  const baseOrigin = origin && origin !== 'null' && !origin.includes('localhost')
    ? origin
    : (process.env.NEXT_PUBLIC_APP_URL || 'https://join-nexus1.vercel.app');

  console.log(`[OAuth Callback] GET request received. Code: ${code ? 'Yes' : 'No'}, State: ${state}, Error: ${error}, Description: ${errorDescription}`);

  // Explicitly handle database triggers or auth errors from Supabase
  if (error) {
    console.error(`[OAuth Callback] Error from provider: ${error}. Description: ${errorDescription}`);
    return NextResponse.redirect(`${baseOrigin}/login?error=${encodeURIComponent(errorDescription || error)}`);
  }

  if (code) {
    try {
      const supabase = await createClient();
      console.log(`[OAuth Callback] Exchanging authorization code for session...`);
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

      if (!exchangeError) {
        const { data: { user: sbUser } } = await supabase.auth.getUser();
        console.log(`[OAuth Callback] Session exchanged successfully. User ID: ${sbUser?.id}, Email: ${sbUser?.email}`);

        if (sbUser) {
          // Check if profile and preferences exist
          const { data: profile } = await supabase
            .from('users')
            .select('role')
            .eq('id', sbUser.id)
            .single();

          const { data: prefs } = await supabase
            .from('user_preferences')
            .select('onboarding_done')
            .eq('user_id', sbUser.id)
            .single();

          console.log(`[OAuth Callback] User profile: ${profile ? 'Found' : 'Not Found'}, Preferences Onboarding done: ${prefs?.onboarding_done}`);

          // Fallback initialization if profile or prefs missing for new users
          if (!profile) {
            console.log(`[OAuth Callback] Profile missing in DB. Initializing user profile fallback...`);
            const meta = sbUser.user_metadata || {};
            const fullName = meta.full_name || meta.name || sbUser.email?.split('@')[0] || 'Nexus User';
            const avatarUrl = meta.avatar_url || meta.picture || meta.avatar || null;
            const linkedinUrl = meta.linkedin_url || meta.provider_url || meta.profile || null;

            await supabase.from('users').upsert({
              id: sbUser.id,
              email: sbUser.email || '',
              name: fullName,
              avatar_url: avatarUrl,
              linkedin_url: linkedinUrl,
              updated_at: new Date().toISOString(),
            }, { onConflict: 'id' });
          }

          if (!prefs) {
            console.log(`[OAuth Callback] User preferences missing in DB. Initializing user_preferences fallback...`);
            await supabase.from('user_preferences').upsert({
              user_id: sbUser.id,
              onboarding_done: false,
            }, { onConflict: 'user_id' });
          }

          // First-time login or incomplete onboarding — route to /onboarding
          if (!prefs?.onboarding_done) {
            console.log(`[OAuth Callback] Onboarding incomplete or first-time login. Redirecting to /onboarding`);
            return NextResponse.redirect(`${baseOrigin}/onboarding`);
          }
        }

        console.log(`[OAuth Callback] Redirecting returning user to ${next}`);
        return NextResponse.redirect(`${baseOrigin}${next}`);
      } else {
        console.error('[OAuth Callback] Supabase session exchange error:', exchangeError);
        return NextResponse.redirect(`${baseOrigin}/login?error=${encodeURIComponent(exchangeError.message)}`);
      }
    } catch (err: any) {
      console.error('[OAuth Callback] System error during callback processing:', err);
      return NextResponse.redirect(`${baseOrigin}/login?error=${encodeURIComponent(err.message || 'Callback error')}`);
    }
  }

  console.warn('[OAuth Callback] No code or error parameter found in URL query.');
  return NextResponse.redirect(`${baseOrigin}/login?error=no_code`);
}
