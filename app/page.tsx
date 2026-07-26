'use client';

// ===================================================================
// Nexus UI v2 — Root Login Portal
// Next-gen dark mode glassmorphism login interface.
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
    if (user?.id) {
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
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin_oidc',
        options: {
          redirectTo: callbackUrl,
          scopes: 'openid profile email',
        },
      });

      if (!error && data?.url && !data.url.includes('localhost:3000')) {
        window.location.href = data.url;
        return;
      }
    } catch {}

    const linkedinClientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID || '777xz1u7vj58kf';
    const redirectUri = `${baseUrl}/auth/callback`;
    const directLinkedInUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${linkedinClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${encodeURIComponent('/dashboard')}&scope=openid%20profile%20email`;

    window.location.href = directLinkedInUrl;
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6 sm:p-12 overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Ambient Radial Glowing Aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-indigo-600/20 via-purple-600/10 to-transparent blur-[120px] pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25 pointer-events-none" />

      {/* Main Glass Card Container */}
      <main className="relative z-10 w-full max-w-md mx-auto my-auto p-8 sm:p-10 rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-2xl shadow-2xl shadow-indigo-950/50 space-y-8 text-center animate-fade-in">
        {/* Brand Emblem */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <NexusIcon size={60} className="rounded-2xl shadow-xl shadow-indigo-500/20 ring-1 ring-indigo-500/30" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-900" />
            </span>
          </div>
          <div className="space-y-0.5">
            <h2 className="text-2xl font-black tracking-tight text-white">Nexus</h2>
            <span className="text-[10px] font-extrabold tracking-[0.25em] uppercase text-indigo-400 block">
              Meet · Connect · Grow
            </span>
          </div>
        </div>

        {/* Hero Copy */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[11px] font-bold text-indigo-300">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            Event Room Networking
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Connect with the <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-sky-400 bg-clip-text text-transparent">right attendees</span> at live events.
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
            Instant location-based networking powered by verified LinkedIn profiles.
          </p>
        </div>

        {/* Action Button & Verification Badge */}
        <div className="space-y-4 pt-2">
          <button
            type="button"
            onClick={handleLinkedInOAuth}
            disabled={isRedirecting}
            className="w-full h-14 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-3 text-white bg-[#0A66C2] hover:bg-[#084e96] active:scale-[0.98] transition-all duration-200 shadow-xl shadow-[#0A66C2]/25 border border-white/20"
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
                <ArrowUpRight className="h-4 w-4 opacity-70" />
              </>
            )}
          </button>

          <div className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 font-semibold px-3.5 py-1.5 rounded-full bg-slate-800/60 border border-slate-700/60">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            Official LinkedIn OAuth 2.0 Security
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center text-[11px] text-slate-500 pt-6">
        Nexus &copy; 2025 • Verified LinkedIn Event Platform
      </footer>
    </div>
  );
}
