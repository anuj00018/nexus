'use client';

/**
 * Login Page
 * - If Supabase IS configured  → LinkedIn OAuth
 * - If Supabase NOT configured → Show setup guide + Try Demo button
 *   (so it never shows "site can't be reached")
 */
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AlertCircle, ArrowRight, Settings } from 'lucide-react';
import Link from 'next/link';
import { NexusIcon } from '@/components/ui/Logo';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

// ─── LinkedIn SVG Icon ────────────────────────────────────────────────
function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

// ─── Not configured — show setup instructions ─────────────────────────
function SetupRequired() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12">
      <NexusIcon size={56} className="mb-5 mx-auto" />

      <h1 className="text-xl font-bold text-foreground text-center mb-1">
        Nexus — Setup Required
      </h1>
      <p className="text-sm text-muted-foreground text-center mb-8 max-w-xs">
        LinkedIn login needs a Supabase project. Takes 3 minutes to set up.
      </p>

      {/* Steps */}
      <div className="w-full max-w-sm space-y-3 mb-8">
        {[
          { n: '1', text: 'Create a free project at supabase.com' },
          { n: '2', text: 'Go to Settings → API → copy URL + Anon Key' },
          { n: '3', text: 'Create .env.local in your nexus folder' },
          { n: '4', text: 'Enable LinkedIn in Auth → Providers' },
        ].map(step => (
          <div key={step.n} className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 border border-border">
            <span className="h-6 w-6 rounded-full bg-nexus-indigo/10 text-nexus-indigo text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              {step.n}
            </span>
            <p className="text-sm text-foreground">{step.text}</p>
          </div>
        ))}
      </div>

      {/* .env.local code */}
      <div className="w-full max-w-sm mb-8">
        <p className="text-xs font-mono text-muted-foreground mb-2">Add to .env.local:</p>
        <div className="bg-nexus-black rounded-xl p-4 font-mono text-xs text-emerald-400 leading-relaxed border border-border">
          <p>NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co</p>
          <p>NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...</p>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Then restart the server with <code className="bg-muted px-1 rounded text-xs">npm run dev</code>
        </p>
      </div>

      {/* Try demo instead */}
      <div className="w-full max-w-sm space-y-3">
        <Link
          href="/events/demo-1/nearby"
          className="w-full h-12 rounded-xl bg-nexus-black text-white font-semibold text-sm
                     flex items-center justify-center gap-2
                     hover:bg-nexus-black/90 active:scale-[0.98] transition-all duration-150"
        >
          Try Demo — No login needed
          <ArrowRight className="h-4 w-4" />
        </Link>
        <a
          href="https://supabase.com"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full h-12 rounded-xl border-2 border-border text-foreground font-semibold text-sm
                     flex items-center justify-center gap-2
                     hover:border-foreground/40 active:scale-[0.98] transition-all duration-150"
        >
          <Settings className="h-4 w-4" />
          Go to supabase.com
        </a>
      </div>
    </div>
  );
}

// ─── Configured — show LinkedIn login ────────────────────────────────
function LoginContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') ?? '/dashboard';

  useEffect(() => {
    if (searchParams.get('error') === 'auth_failed') {
      setError('Sign-in failed. Please try again.');
    }
  }, [searchParams]);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'linkedin_oidc',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`,
        scopes: 'openid profile email',
      },
    });

    if (error) {
      setError('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ── Centered content ───────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">

        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <NexusIcon size={64} className="mb-4" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Nexus</h1>
          <p className="text-sm text-muted-foreground mt-1 text-center">
            Discover who's at your event — connect in one tap
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="w-full max-w-sm mb-5 flex items-center gap-2.5 px-4 py-3
                          rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* ── LinkedIn Button ─────────────────────────────────────── */}
        <button
          id="linkedin-login-btn"
          type="button"
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full max-w-sm h-[52px] rounded-xl font-semibold text-[15px]
                     flex items-center justify-center gap-3 text-white
                     bg-[#0A66C2] hover:bg-[#084e96] active:scale-[0.98]
                     transition-all duration-150 select-none
                     disabled:opacity-60 disabled:cursor-not-allowed
                     shadow-lg shadow-[#0A66C2]/25"
          aria-label="Sign in with LinkedIn"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Connecting to LinkedIn…
            </>
          ) : (
            <>
              <LinkedInIcon className="h-5 w-5 fill-white shrink-0" />
              Continue with LinkedIn
            </>
          )}
        </button>

        {/* ── Founder 1-Click Instant Sign-In ────────────────────── */}
        <button
          type="button"
          onClick={() => {
            setIsLoading(true);
            window.location.href = redirectTo || '/dashboard';
          }}
          className="w-full max-w-sm mt-3 h-[48px] rounded-xl font-bold text-xs
                     flex items-center justify-center gap-2 text-foreground
                     bg-muted hover:bg-nexus-indigo/10 hover:text-nexus-indigo border border-border
                     transition-all duration-150 active:scale-[0.98]"
        >
          ⚡ Founder Instant Sign-In (Anuj Vardham)
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 w-full max-w-sm my-5">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground shrink-0">No password needed</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* What we use */}
        <div className="w-full max-w-sm rounded-xl bg-muted/40 border border-border p-4">
          <p className="text-xs font-medium text-foreground mb-2.5">We only access:</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {[
              'Your name & photo',
              'Professional headline',
              'LinkedIn profile URL',
              'Email address',
            ].map(item => (
              <div key={item} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-xs text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Try demo link */}
        <p className="mt-5 text-center">
          <Link
            href="/events/demo-1/nearby"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
          >
            Just want to try? → See demo
          </Link>
        </p>
      </div>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="px-6 pb-8 text-center">
        <p className="text-xs text-muted-foreground">
          By signing in, you agree to our{' '}
          <a href="/terms" className="text-foreground underline underline-offset-2">Terms</a>
          {' '}and{' '}
          <a href="/privacy" className="text-foreground underline underline-offset-2">Privacy Policy</a>.
        </p>
      </footer>
    </div>
  );
}

// ─── Root export — picks correct screen based on config ───────────────
export default function LoginPage() {
  // Show setup guide if Supabase not configured — never shows broken OAuth
  if (!isSupabaseConfigured) {
    return <SetupRequired />;
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse w-16 h-16 rounded-xl bg-muted" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
