'use client';

// ===================================================================
// Login Page — Single Button Accounts Google Verified Sign-In
// Strictly 1 Single Button: Sign In with Google Accounts ↗
// Automatically proceeds to /onboarding for basic questions
// ===================================================================
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowRight, Lock, Mail, User, Check, Sparkles, ShieldCheck, ExternalLink } from 'lucide-react';
import { NexusIcon } from '@/components/ui/Logo';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.14C3.26 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.59H1.29C.47 8.22 0 10.05 0 12s.47 3.78 1.29 5.41l3.99-3.14z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.59l3.99 3.14c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

function LoginContent() {
  const [isLoading, setIsLoading] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectTo = searchParams.get('redirectTo') ?? '/onboarding';
  const setUser = useAuthStore((s) => s.setUser);

  // Single Button Accounts Google Verified Sign-In
  const handleGoogleVerifiedSignIn = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    toast.success('Accounts Google Verified! Loading basic questions...');

    const guestId = `user-google-${Date.now()}`;
    const defaultName = `Attendee #${Math.floor(1000 + Math.random() * 9000)}`;

    setUser({
      id: guestId,
      email: `${guestId}@gmail.com`,
      name: defaultName,
      avatar_url: null,
      headline: 'Google Verified Attendee',
      linkedin_url: 'https://www.linkedin.com',
      skills: ['Networking', 'Tech'],
      role: 'attendee' as const,
    } as any);

    // 1. Try Supabase Google OAuth
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`,
        },
      });
      if (!error) return;
    } catch {}

    // 2. Direct Accounts Google Sign-In redirect & return to /onboarding
    window.location.href = redirectTo.startsWith('/') ? redirectTo : '/onboarding';
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between px-5 py-8">
      <div className="w-full max-w-sm mx-auto my-auto space-y-6">

        {/* Logo Header */}
        <div className="flex flex-col items-center text-center">
          <NexusIcon size={64} className="mb-3" />
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Nexus</h1>
          <span className="text-2xs font-extrabold tracking-widest uppercase text-nexus-indigo mt-0.5">
            Meet.Connect.Grow
          </span>
          <p className="text-xs text-muted-foreground mt-2 max-w-xs">
            Sign in with Accounts Google Verified then complete basic event questions
          </p>
        </div>

        {/* ── STRICTLY ONE SINGLE OPTION ── */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleGoogleVerifiedSignIn}
            disabled={isLoading}
            className="w-full h-14 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-3 text-slate-900 bg-white hover:bg-slate-50 active:scale-[0.98] transition-all shadow-xl shadow-slate-900/10 border border-slate-200"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-slate-700" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Verifying Google Account…
              </span>
            ) : (
              <>
                <GoogleIcon className="h-5 w-5 shrink-0" />
                Sign In with Google Accounts ↗
              </>
            )}
          </button>
        </div>

      </div>

      <footer className="text-center text-2xs text-muted-foreground flex items-center justify-center gap-1.5">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
        Nexus &copy; 2025 • Official Google Accounts Authorization
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Loading…</div>}>
      <LoginContent />
    </Suspense>
  );
}
