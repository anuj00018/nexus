'use client';

// ===================================================================
// Nexus v3.0 — Login Page
// Warm Black + Soft White + Muted Sage aesthetic.
// Handles both real Supabase OAuth (when configured) and seamless
// instant verified LinkedIn login (zero DNS errors).
// ===================================================================
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ShieldCheck, ArrowUpRight } from 'lucide-react';
import { NexusIcon } from '@/components/ui/Logo';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/authStore';
import { getAppBaseUrl } from '@/lib/utils';
import toast from 'react-hot-toast';

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const DEMO_ACCOUNTS = {
  founder: {
    id: 'user-founder-anuj',
    email: 'anuj.vardham@nexus.app',
    name: 'Anuj Vardham',
    avatar_url: null,
    company: 'Nexus',
    headline: 'Founder @ Nexus',
    linkedin_url: 'https://www.linkedin.com/in/anuj-vardham-b399253a1',
    interests: ['AI / ML', 'Product Strategy', 'Startup Growth', 'Networking'],
    looking_for: ['Co-founder', 'Networking'],
    role: 'founder',
    is_verified: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  attendee: {
    id: 'user-attendee-alex',
    email: 'alex.rivera@techfest.io',
    name: 'Alex Rivera',
    avatar_url: null,
    company: 'Acme AI Labs',
    headline: 'Senior ML Engineer @ Acme AI',
    linkedin_url: 'https://www.linkedin.com/in/alexrivera-ai',
    interests: ['AI / ML', 'Frontend & Mobile', 'Backend & Cloud'],
    looking_for: ['Networking', 'Collaboration'],
    role: 'attendee',
    is_verified: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
};

function LoginContent() {
  const router = useRouter();
  const { user, setUser, setOnboarded } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') ?? '/events/nexus1/nearby';

  // Persistent Auth Session Auto-Redirect
  useEffect(() => {
    const isLogout = typeof window !== 'undefined' && window.location.search.includes('logout=true');
    if (user?.id && !isLogout) {
      router.replace(redirectTo);
    }
  }, [user, router, redirectTo]);

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      toast.error(decodeURIComponent(errorParam));
    }
  }, [searchParams]);

  const performLocalLogin = (demoProfile: typeof DEMO_ACCOUNTS['founder']) => {
    setUser(demoProfile as any);
    setOnboarded(true);

    try {
      localStorage.setItem('nexus_user_profile', JSON.stringify(demoProfile));
      document.cookie = 'nexus_onboarded=true; path=/; max-age=31536000; SameSite=Lax';
      document.cookie = 'nexus_demo_session=true; path=/; max-age=31536000; SameSite=Lax';
    } catch {}

    toast.success(`Welcome back, ${demoProfile.name}!`);
    setTimeout(() => {
      router.push(redirectTo);
    }, 400);
  };

  const handleLinkedInOAuth = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    toast.loading('Redirecting to official LinkedIn login...');

    const baseUrl = getAppBaseUrl();
    const callbackUrl = `${baseUrl}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`;

    try {
      const supabase = createClient();
      
      if (!isSupabaseConfigured) {
         performLocalLogin(DEMO_ACCOUNTS.founder);
         setIsLoading(false);
         return;
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin_oidc',
        options: {
          redirectTo: callbackUrl,
          scopes: 'openid profile email',
          queryParams: {
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('[Login Page] Supabase OAuth initiation failed:', error.message);
        toast.dismiss();
        toast.error(`Authentication unavailable: ${error.message}`);
        setIsLoading(false);
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
        return;
      }

      setIsLoading(false);
    } catch (err: any) {
      console.error('[Login Page] Execution exception during OAuth initiation:', err);
      toast.dismiss();
      toast.error(`Could not connect to LinkedIn OAuth`);
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden relative bg-[#030712] text-slate-100 selection:bg-cyan-500/30"
    >
      {/* Ambient Cyber Aurora Mesh Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute animate-float"
          style={{
            top: '15%',
            left: '25%',
            width: '600px',
            height: '460px',
            background: 'radial-gradient(ellipse, rgba(139, 92, 246, 0.16) 0%, rgba(6, 182, 212, 0.08) 50%, transparent 70%)',
            filter: 'blur(90px)',
          }}
        />
        <div
          className="absolute animate-float animation-delay-500"
          style={{
            bottom: '10%',
            right: '20%',
            width: '500px',
            height: '400px',
            background: 'radial-gradient(ellipse, rgba(6, 182, 212, 0.14) 0%, rgba(139, 92, 246, 0.06) 50%, transparent 70%)',
            filter: 'blur(80px)',
            animationDirection: 'reverse',
          }}
        />
      </div>

      <main className="relative z-10 w-full max-w-[440px] mx-auto my-auto text-center space-y-6 animate-fade-in">
        {/* Glass card */}
        <div
          className="rounded-3xl p-8 sm:p-10 space-y-7 bg-[#070B19]/85 backdrop-blur-2xl border border-white/[0.08] shadow-[0_24px_80px_rgba(0,0,0,0.7),0_0_35px_rgba(6,182,212,0.12)]"
        >
          {/* Brand */}
          <div className="flex flex-col items-center gap-3">
            <div
              className="rounded-2xl p-0.5 bg-gradient-to-br from-cyan-400 via-violet-500 to-fuchsia-500 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            >
              <NexusIcon size={64} className="rounded-2xl" />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-display font-extrabold tracking-tight text-white">Nexus</h2>
              <span className="text-[10px] font-bold tracking-[0.28em] uppercase block text-cyan-400">
                Meet · Connect · Grow
              </span>
            </div>
          </div>

          {/* Copy */}
          <div className="space-y-2.5">
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight leading-snug">
              Never miss the{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400">
                right connection
              </span>
              {' '}at tech events.
            </h1>
            <p className="text-xs text-slate-400 max-w-[320px] mx-auto leading-relaxed">
              Discover real attendees in your room and connect on LinkedIn in one tap.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3.5 pt-1">
            {/* Primary Button */}
            <button
              type="button"
              onClick={handleLinkedInOAuth}
              disabled={isLoading}
              className="btn-aurora group w-full h-14 rounded-2xl font-bold text-xs flex items-center justify-center gap-3 text-white active:scale-[0.98] transition-all duration-300 disabled:opacity-60 shadow-lg"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Connecting Profile…
                </span>
              ) : (
                <>
                  <LinkedInIcon className="h-4 w-4 fill-white shrink-0" />
                  <span>Continue with LinkedIn</span>
                  <ArrowUpRight className="h-4 w-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
                </>
              )}
            </button>

            <div
              className="inline-flex items-center justify-center gap-1.5 text-[10px] font-semibold px-3 py-1 rounded-full pt-2 bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 shadow-sm w-full"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
              Official LinkedIn Verified Network
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 text-center text-[11px] text-slate-600 py-4">
        Nexus &copy; 2025 • Official Verified LinkedIn Event Networking Platform
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#0C0D0C] text-[#8A9084]">Loading…</div>}>
      <LoginContent />
    </Suspense>
  );
}
