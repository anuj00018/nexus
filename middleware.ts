// ===================================================================
// Next.js Middleware — Auth Session & Route Protection
//
// Architecture decision: Supabase SSR requires refreshing the auth
// token on every request via middleware. This ensures the session
// cookie is always fresh and Server Components get the correct user.
//
// Protected routes: /dashboard, /events, /profile, /onboarding, /admin
// Public routes: /, /login, /auth/*
// Admin routes: /admin/* — requires role = 'admin' or 'founder'
// ===================================================================
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Routes that require authentication (strict protected)
const PROTECTED_ROUTES = ['/onboarding'];

// Routes that require admin/founder role
const ADMIN_ROUTES = ['/admin'];
// Routes accessible only when NOT logged in
const AUTH_ONLY_ROUTES = ['/login'];

export async function middleware(request: NextRequest) {
  // Skip auth middleware if Supabase is not configured yet (local dev without .env.local)
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

  // Refresh session — MUST be called before any route checks
  const { data: { user } } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // ── Redirect unauthenticated users away from protected routes ──
  const isProtected = PROTECTED_ROUTES.some(r => pathname.startsWith(r));
  const isAdmin = ADMIN_ROUTES.some(r => pathname.startsWith(r));
  const isDemoRoute = pathname.includes('/events/demo-');

  if ((isProtected || isAdmin) && !user && !isDemoRoute) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }


  // ── Admin route: check role in DB ──────────────────────────────
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
      // Table not set up yet — redirect to dashboard
      const dashUrl = request.nextUrl.clone();
      dashUrl.pathname = '/dashboard';
      return NextResponse.redirect(dashUrl);
    }
  }

  // ── Redirect authenticated users away from login page ──────────
  const isAuthOnly = AUTH_ONLY_ROUTES.some(r => pathname.startsWith(r));
  if (isAuthOnly && user) {
    const dashUrl = request.nextUrl.clone();
    dashUrl.pathname = '/dashboard';
    return NextResponse.redirect(dashUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
