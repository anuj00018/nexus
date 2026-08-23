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

// Helper to prevent Vercel Edge middleware timeouts (hard cap at 25s on Vercel)
function withTimeout<T>(promise: PromiseLike<T>, ms: number, fallback: T): Promise<T> {
  let timer: any;
  const timeoutPromise = new Promise<T>((resolve) => {
    timer = setTimeout(() => resolve(fallback), ms);
  });
  return Promise.race([
    promise
      .then((res) => {
        clearTimeout(timer);
        return res;
      })
      .catch(() => fallback),
    timeoutPromise,
  ]);
}

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

  const pathname = request.nextUrl.pathname;
  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  const isAdmin = ADMIN_ROUTES.some((r) => pathname.startsWith(r));

  // Cap getUser() to a 3-second max timeout so network latency never triggers 504 MIDDLEWARE_INVOCATION_TIMEOUT
  const userResult = await withTimeout(
    supabase.auth.getUser(),
    3000,
    { data: { user: null }, error: null }
  );
  const user = userResult?.data?.user ?? null;

  // Redirect unauthenticated users strictly to /login
  if ((isProtected || isAdmin) && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Onboarding route protection check for authenticated users
  const needsOnboardingCheck = 
    pathname === '/onboarding' || 
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/events') || 
    pathname.startsWith('/profile');

  if (user && needsOnboardingCheck) {
    try {
      const onboardedCookie = request.cookies.get('nexus_onboarded')?.value === 'true';
      let isOnboarded = onboardedCookie;

      if (!isOnboarded) {
        const dbFetch = Promise.all([
          supabase.from('user_preferences').select('onboarding_done').eq('user_id', user.id).single(),
          supabase.from('users').select('linkedin_url').eq('id', user.id).single(),
        ]);

        const [prefsRes, profileRes] = await withTimeout(
          dbFetch,
          2500,
          [{ data: null }, { data: null }] as any
        );

        const hasValidLinkedIn = Boolean(
          profileRes?.data?.linkedin_url && LINKEDIN_URL_REGEX.test(profileRes.data.linkedin_url)
        );
        isOnboarded = Boolean(prefsRes?.data?.onboarding_done) && hasValidLinkedIn;
      }

      // 1. If onboarding is not completed, redirect to /onboarding
      if (!isOnboarded && pathname !== '/onboarding' && (pathname.startsWith('/dashboard') || pathname.startsWith('/events') || pathname.startsWith('/profile'))) {
        const onboardingUrl = request.nextUrl.clone();
        onboardingUrl.pathname = '/onboarding';
        return NextResponse.redirect(onboardingUrl);
      }

      // 2. If onboarding is completed, redirect away from /onboarding to /dashboard
      if (isOnboarded && pathname === '/onboarding') {
        const dashUrl = request.nextUrl.clone();
        dashUrl.pathname = '/dashboard';
        return NextResponse.redirect(dashUrl);
      }
    } catch {
      // Continue if DB check fails or times out
    }
  }

  // Admin route check
  if (isAdmin && user) {
    try {
      const profileRes = await withTimeout(
        supabase.from('users').select('role').eq('id', user.id).single(),
        2500,
        { data: null }
      );
      const profile = profileRes?.data;

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
