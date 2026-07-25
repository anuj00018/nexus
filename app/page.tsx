'use client';

// ===================================================================
// Nexus Root Page — Clean Premium Startup Login Homepage
// Strictly contains:
// 1. Premium Nexus Logo
// 2. Large Hero Headline
// 3. One Short Subtitle
// 4. Continue with LinkedIn Button (Official OAuth 2.0)
// 5. Small Official LinkedIn OAuth Badge
// 6. Clean Minimal Footer
// Zero demo previews, zero fake cards, zero pre-auth event codes.
// ===================================================================
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';
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

export default function RootPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  // Persistent Auth Session Auto-Redirect
  useEffect(() => {
    if (user?.id) {
      router.replace('/dashboard');
    }
  }, [user, router]);

  const handleLinkedInOAuth = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    toast.loading('Redirecting to official LinkedIn login...');

    const baseUrl = getAppBaseUrl();
    const callbackUrl = `${baseUrl}/auth/callback?redirectTo=/dashboard`;

    // 1. Try Supabase Auth LinkedIn OIDC OAuth
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

    // 2. Direct Official LinkedIn OAuth Authorization URL
    const linkedinClientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID || '777xz1u7vj58kf';
    const redirectUri = `${baseUrl}/auth/callback`;
    const directLinkedInUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${linkedinClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${encodeURIComponent('/dashboard')}&scope=openid%20profile%20email`;

    window.location.href = directLinkedInUrl;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between p-6 sm:p-10 select-none">

      {/* Ambient Lighting Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-nexus-indigo/15 rounded-full blur-[130px]" />
      </div>

      <main className="relative z-10 w-full max-w-md mx-auto my-auto text-center space-y-8 animate-fade-in">

        {/* 1. Premium Nexus Logo */}
        <div className="flex flex-col items-center gap-3">
          <NexusIcon size={64} className="shadow-lg shadow-nexus-indigo/20 rounded-2xl" />
          <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-tight text-foreground">Nexus</h2>
            <span className="text-2xs font-extrabold tracking-widest uppercase text-nexus-indigo block">
              Meet.Connect.Grow
            </span>
          </div>
        </div>

        {/* 2. Large Hero Headline & 3. Short Subtitle */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
            Never miss the <span className="bg-gradient-to-r from-nexus-indigo via-purple-500 to-[#0A66C2] bg-clip-text text-transparent">right connection</span> at tech events.
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
            Discover real attendees in your room and connect on LinkedIn in one tap.
          </p>
        </div>

        {/* 4. Continue with LinkedIn Button */}
        <div className="space-y-4 pt-2">
          <button
            type="button"
            onClick={handleLinkedInOAuth}
            disabled={isLoading}
            className="w-full h-14 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-3 text-white bg-[#0A66C2] hover:bg-[#084e96] active:scale-[0.98] transition-all shadow-xl shadow-[#0A66C2]/30 border border-white/20"
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
                Continue with LinkedIn ↗
              </>
            )}
          </button>

          {/* 5. Small Official LinkedIn OAuth Badge */}
          <div className="inline-flex items-center gap-1.5 text-2xs text-muted-foreground font-semibold px-3 py-1 rounded-full bg-muted/60 border border-border/80">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            Official LinkedIn OAuth 2.0 Verified
          </div>
        </div>

      </main>

      {/* 6. Clean Minimal Footer */}
      <footer className="relative z-10 text-center text-2xs text-muted-foreground pt-6">
        Nexus &copy; 2025 • Official Verified LinkedIn Event Networking Platform
      </footer>

    </div>
  );
}
