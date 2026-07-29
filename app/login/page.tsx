'use client';

// ===================================================================
// Nexus v3.0 — Login Page
// Consistent with root page premium dark glassmorphism.
// Preserves: Supabase LinkedIn OAuth, URL params, Suspense boundary.
// ===================================================================
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ShieldCheck, ArrowUpRight } from 'lucide-react';
import { NexusIcon } from '@/components/ui/Logo';
import { createClient } from '@/lib/supabase/client';
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

function LoginContent() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') ?? '/dashboard';

  // Persistent Auth Session Auto-Redirect
  useEffect(() => {
    const isLogout = typeof window !== 'undefined' && window.location.search.includes('logout=true');
    if (user?.id && !isLogout) {
      router.replace('/dashboard');
    }
  }, [user, router]);

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      toast.error(`Authentication notice: ${decodeURIComponent(errorParam)}`);
    }
  }, [searchParams]);

  const handleLinkedInOAuth = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    toast.loading('Redirecting to official LinkedIn login...');

    const baseUrl = getAppBaseUrl();
    const callbackUrl = `${baseUrl}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`;

    try {
      const supabase = createClient();
      console.log(`[Login Page] Initiating Supabase signInWithOAuth for provider 'linkedin_oidc' with callback url:`, callbackUrl);

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
        toast.error(`LinkedIn redirect failed: ${error.message}`);
        setIsLoading(false);
        return;
      }

      if (data?.url) {
        console.log('[Login Page] Redirecting user to Supabase authorize endpoint:', data.url);
        window.location.href = data.url;
        return;
      }

      console.error('[Login Page] Supabase did not return redirect URL');
      toast.error('Could not initiate LinkedIn connection');
      setIsLoading(false);
    } catch (err: any) {
      console.error('[Login Page] Execution exception during OAuth initiation:', err);
      toast.error(`Authentication error: ${err.message || err}`);
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden relative"
      style={{ background: 'linear-gradient(145deg, #050a18 0%, #0a0f1e 40%, #0d1225 100%)' }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute animate-float"
          style={{
            top: '20%',
            left: '30%',
            width: '500px',
            height: '400px',
            background: 'radial-gradient(ellipse, rgba(66, 99, 235, 0.1) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      <main className="relative z-10 w-full max-w-[420px] mx-auto my-auto text-center space-y-8 animate-fade-in">
        {/* Glass card */}
        <div
          className="rounded-3xl p-8 sm:p-10 space-y-8"
          style={{
            background: 'rgba(255, 255, 255, 0.025)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            boxShadow: '0 24px 80px rgba(0, 0, 0, 0.4)',
          }}
        >
          {/* Brand */}
          <div className="flex flex-col items-center gap-3">
            <div
              className="rounded-2xl p-0.5"
              style={{ background: 'linear-gradient(135deg, rgba(66, 99, 235, 0.3), rgba(139, 92, 246, 0.2))' }}
            >
              <NexusIcon size={60} className="rounded-2xl" />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-display font-bold tracking-tight text-white">Nexus</h2>
              <span className="text-[10px] font-semibold tracking-[0.3em] uppercase block" style={{ color: '#4263EB' }}>
                Meet · Connect · Grow
              </span>
            </div>
          </div>

          {/* Copy */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight leading-[1.15]">
              Never miss the{' '}
              <span className="gradient-text-blue">right connection</span>
              {' '}at tech events.
            </h1>
            <p className="text-sm text-slate-400 max-w-[320px] mx-auto leading-relaxed">
              Discover real attendees in your room and connect on LinkedIn in one tap.
            </p>
          </div>

          {/* OAuth CTA */}
          <div className="space-y-4 pt-1">
            <button
              type="button"
              onClick={handleLinkedInOAuth}
              disabled={isLoading}
              className="group w-full h-14 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 text-white active:scale-[0.98] transition-all duration-200 disabled:opacity-60"
              style={{
                background: 'linear-gradient(135deg, #4263EB 0%, #22D3EE 150%)',
                boxShadow: '0 8px 30px rgba(66, 99, 235, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.08) inset',
              }}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Redirecting to LinkedIn…
                </span>
              ) : (
                <>
                  <LinkedInIcon className="h-5 w-5 fill-white shrink-0" />
                  Continue with LinkedIn
                  <ArrowUpRight className="h-4 w-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                </>
              )}
            </button>

            <div
              className="inline-flex items-center gap-1.5 text-[11px] font-medium px-3.5 py-1.5 rounded-full"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                color: '#64748b',
              }}
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              Official LinkedIn OAuth 2.0 Verified
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 text-center text-[11px] text-slate-600 py-6">
        Nexus &copy; 2025 • Official Verified LinkedIn Event Networking Platform
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: '#050a18', color: '#64748b' }}>Loading…</div>}>
      <LoginContent />
    </Suspense>
  );
}
