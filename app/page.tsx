'use client';

// ===================================================================
// Nexus v3.0 — Root Login Portal
// Premium glassmorphism with animated gradient mesh background.
// Preserves: Supabase LinkedIn OAuth 2.0 auth & auto-session redirect.
// ===================================================================
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Sparkles, ArrowUpRight } from 'lucide-react';
import { NexusIcon } from '@/components/ui/Logo';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/authStore';
import { getAppBaseUrl } from '@/lib/utils';
import toast from 'react-hot-toast';

function LinkedInSvg() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white shrink-0" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export default function RootPageV2() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Persistent Auth Session Auto-Redirect
  useEffect(() => {
    const isLogout = typeof window !== 'undefined' && window.location.search.includes('logout=true');
    if (user?.id && !isLogout) {
      router.replace('/dashboard');
    }
  }, [user, router]);

  const handleLinkedInOAuth = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isRedirecting) return;

    setIsRedirecting(true);
    toast.loading('Connecting to LinkedIn OAuth…');

    const baseUrl = getAppBaseUrl();
    const callbackUrl = `${baseUrl}/auth/callback?redirectTo=/dashboard`;

    try {
      const supabase = createClient();
      console.log(`[Root Page] Initiating Supabase signInWithOAuth for provider 'linkedin_oidc' with callback url:`, callbackUrl);
      
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
        console.error('[Root Page] Supabase OAuth initiation failed:', error.message);
        toast.error(`LinkedIn redirect failed: ${error.message}`);
        setIsRedirecting(false);
        return;
      }

      if (data?.url) {
        console.log('[Root Page] Redirecting user to Supabase authorize endpoint:', data.url);
        window.location.href = data.url;
        return;
      }

      console.error('[Root Page] Supabase did not return redirect URL');
      toast.error('Could not initiate LinkedIn connection');
      setIsRedirecting(false);
    } catch (err: any) {
      console.error('[Root Page] Execution exception during OAuth initiation:', err);
      toast.error(`Authentication error: ${err.message || err}`);
      setIsRedirecting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden selection:bg-blue-500/30 selection:text-white"
      style={{ background: 'linear-gradient(145deg, #050a18 0%, #0a0f1e 40%, #0d1225 100%)' }}
    >
      {/* ── Animated gradient mesh background ─────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Primary glow orb — electric blue */}
        <div
          className="absolute animate-float"
          style={{
            top: '-5%',
            left: '25%',
            width: '700px',
            height: '500px',
            background: 'radial-gradient(ellipse, rgba(66, 99, 235, 0.12) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        {/* Secondary glow orb — purple */}
        <div
          className="absolute animate-float animation-delay-300"
          style={{
            top: '40%',
            right: '10%',
            width: '500px',
            height: '400px',
            background: 'radial-gradient(ellipse, rgba(139, 92, 246, 0.08) 0%, transparent 70%)',
            filter: 'blur(80px)',
            animationDirection: 'reverse',
          }}
        />
        {/* Tertiary glow — cyan accent */}
        <div
          className="absolute animate-float animation-delay-700"
          style={{
            bottom: '10%',
            left: '15%',
            width: '400px',
            height: '300px',
            background: 'radial-gradient(ellipse, rgba(34, 211, 238, 0.06) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
      </div>

      {/* ── Grid pattern overlay ──────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 40%, transparent 100%)',
        }}
      />

      {/* ── Main Glass Card Container ─────────────────────────── */}
      <main className="relative z-10 w-full max-w-[440px] mx-auto my-auto p-8 sm:p-10 space-y-8 text-center">
        {/* Glass card */}
        <div
          className="rounded-3xl p-8 sm:p-10 space-y-8 animate-fade-in"
          style={{
            background: 'rgba(255, 255, 255, 0.025)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            boxShadow: '0 24px 80px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.03)',
          }}
        >
          {/* Brand Emblem */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div
                className="rounded-2xl p-0.5"
                style={{
                  background: 'linear-gradient(135deg, rgba(66, 99, 235, 0.3), rgba(139, 92, 246, 0.2))',
                }}
              >
                <NexusIcon size={60} className="rounded-2xl" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2" style={{ borderColor: '#0a0f1e' }} />
              </span>
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-display font-bold tracking-tight text-white">Nexus</h2>
              <span
                className="text-[10px] font-semibold tracking-[0.3em] uppercase block"
                style={{ color: '#4263EB' }}
              >
                Meet · Connect · Grow
              </span>
            </div>
          </div>

          {/* Hero Copy */}
          <div className="space-y-3">
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold"
              style={{
                background: 'rgba(66, 99, 235, 0.08)',
                border: '1px solid rgba(66, 99, 235, 0.15)',
                color: '#7B93F5',
              }}
            >
              <Sparkles className="h-3.5 w-3.5" style={{ color: '#4263EB' }} />
              Event Room Networking
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight leading-[1.15]">
              Connect with the{' '}
              <span className="gradient-text-blue">right people</span>
              {' '}at live events.
            </h1>
            <p className="text-sm text-slate-400 max-w-[320px] mx-auto leading-relaxed">
              Instant location-based networking powered by verified LinkedIn profiles.
            </p>
          </div>

          {/* LinkedIn OAuth Button */}
          <div className="space-y-4 pt-1">
            <button
              type="button"
              onClick={handleLinkedInOAuth}
              disabled={isRedirecting}
              className="group w-full h-14 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 text-white active:scale-[0.98] transition-all duration-200 disabled:opacity-60"
              style={{
                background: 'linear-gradient(135deg, #4263EB 0%, #22D3EE 150%)',
                boxShadow: '0 8px 30px rgba(66, 99, 235, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.08) inset',
              }}
            >
              {isRedirecting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Authorizing with LinkedIn…
                </span>
              ) : (
                <>
                  <LinkedInSvg />
                  Continue with LinkedIn
                  <ArrowUpRight className="h-4 w-4 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
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
              Official LinkedIn OAuth 2.0 Security
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center text-[11px] text-slate-600 py-6">
        Nexus &copy; 2025 • Verified LinkedIn Event Platform
      </footer>
    </div>
  );
}
