// ===================================================================
// Next.js Middleware — Auth Session & Route Protection
// Protects /dashboard, /events, /profile, /onboarding, /admin
// Unauthenticated users are redirected directly to /login
// ===================================================================
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Strict protected routes — require authentication
const PROTECTED_ROUTES = ['/dashboard', '/events', '/profile', '/onboarding', '/admin', '/founder'];

// Admin routes — require founder role
const ADMIN_ROUTES = ['/admin', '/founder'];

// A valid LinkedIn profile URL — must match what onboarding itself validates.
// LinkedIn OIDC never returns a profile URL, so this must have been entered
// manually in onboarding. Anything else (null, empty, or a bare
// linkedin.com/homepage URL left over from the old buggy trigger) is invalid.
const LINKEDIN_URL_REGEX = /^https?:\/\/(?:[a-z]{2,3}\.)?linkedin\.com\/in\/[^\s/]+\/?.*$/i;

export async function middleware(request: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: any[]) {
          cookiesToSet.forEach(({ name, value }: any) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }: any) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;

  const isProtected = PROTECTED_ROUTES.some(r => pathname.startsWith(r));
  const isAdmin = ADMIN_ROUTES.some(r => pathname.startsWith(r));

  // Redirect unauthenticated users strictly to /login
  if ((isProtected || isAdmin) && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Onboarding route protection check for authenticated users
  if (user) {
    try {
      const onboardedCookie = request.cookies.get('nexus_onboarded')?.value === 'true';

      const { data: prefs } = await supabase
        .from('user_preferences')
        .select('onboarding_done')
        .eq('user_id', user.id)
        .single();

      // Also check for a real, valid LinkedIn profile URL. Users created
      // under the old buggy trigger may have onboarding_done = true but a
      // corrupted linkedin_url (the LinkedIn homepage/issuer URL instead of
      // a profile link). Treat those as NOT onboarded so they're routed
      // back through onboarding, where the existing strict validation
      // forces them to enter a real https://www.linkedin.com/in/username URL.
      const { data: profile } = await supabase
        .from('users')
        .select('linkedin_url')
        .eq('id', user.id)
        .single();

      const hasValidLinkedIn = Boolean(
        profile?.linkedin_url && LINKEDIN_URL_REGEX.test(profile.linkedin_url)
      );

      const isOnboarded = onboardedCookie || (Boolean(prefs?.onboarding_done) && hasValidLinkedIn);

      // 1. If onboarding is not completed (or linkedin_url is missing/invalid),
      //    redirect from protected app routes to /onboarding
      if (!isOnboarded && pathname !== '/onboarding' && (pathname.startsWith('/dashboard') || pathname.startsWith('/events') || pathname.startsWith('/profile'))) {
        const onboardingUrl = request.nextUrl.clone();
        onboardingUrl.pathname = '/onboarding';
        return NextResponse.redirect(onboardingUrl);
      }

      // 2. If onboarding is already completed, redirect away from /onboarding to /dashboard
      if (isOnboarded && pathname === '/onboarding') {
        const dashUrl = request.nextUrl.clone();
        dashUrl.pathname = '/dashboard';
        return NextResponse.redirect(dashUrl);
      }
    } catch {
      // Continue if DB check fails
    }
  }

  // Admin route check
  if (isAdmin && user) {
    try {
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profile || !['admin', 'founder'].includes(profile.role)) {
        const dashUrl = request.nextUrl.clone();
        dashUrl.pathname = '/dashboard';
        return NextResponse.redirect(dashUrl);
      }
    } catch {
      const dashUrl = request.nextUrl.clone();
      dashUrl.pathname = '/dashboard';
      return NextResponse.redirect(dashUrl);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
