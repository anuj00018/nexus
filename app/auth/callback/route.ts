// ===================================================================
// Auth Callback Route Handler
// Supabase calls this URL after LinkedIn OAuth completes.
// Exchanges the auth code for a session and redirects the user.
// ===================================================================
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // Where to redirect after login (passed as state param)
  const redirectTo = searchParams.get('redirectTo') ?? '/dashboard';
  const next = redirectTo.startsWith('/') ? redirectTo : '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Check if user has completed onboarding
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: prefs } = await supabase
          .from('user_preferences')
          .select('onboarding_done')
          .eq('user_id', user.id)
          .single();

        // First time user — send to onboarding
        if (!prefs?.onboarding_done) {
          return NextResponse.redirect(`${origin}/onboarding`);
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Clean fallback — redirect to onboarding
  return NextResponse.redirect(`${origin}/onboarding`);
}
