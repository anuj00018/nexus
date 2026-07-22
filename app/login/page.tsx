'use client';

// ===================================================================
// Login Page — Universal LinkedIn & Custom Profile Sign-In
// - Real LinkedIn OAuth via Supabase
// - Universal Custom Profile Sign-In for attendees (Name, Role, LinkedIn Link)
// - Founder Quick Access
// ===================================================================
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AlertCircle, ArrowRight, UserCheck, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { NexusIcon } from '@/components/ui/Logo';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function LoginContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCustomForm, setShowCustomForm] = useState(false);

  // Form inputs for custom attendee profile sign-in
  const [customName, setCustomName] = useState('');
  const [customHeadline, setCustomHeadline] = useState('');
  const [customLinkedin, setCustomLinkedin] = useState('');

  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectTo = searchParams.get('redirectTo') ?? '/dashboard';
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    if (searchParams.get('error') === 'auth_failed') {
      setError('Sign-in failed. Please try again or use Quick Profile Entry below.');
    }
  }, [searchParams]);

  // Real LinkedIn OAuth
  const handleLinkedInOAuth = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin_oidc',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`,
          scopes: 'openid profile email',
        },
      });

      if (error) {
        setShowCustomForm(true);
        setIsLoading(false);
      }
    } catch {
      setShowCustomForm(true);
      setIsLoading(false);
    }
  };

  // Custom Attendee Sign-In (Each attendee sets THEIR OWN name & LinkedIn link!)
  const handleCustomSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) {
      toast.error('Please enter your full name');
      return;
    }

    const newUser = {
      id: `user-${Date.now()}`,
      email: `${customName.toLowerCase().replace(/\s+/g, '.')}@attendee.nexus`,
      name: customName.trim(),
      avatar_url: null,
      headline: customHeadline.trim() || 'Tech Event Attendee',
      linkedin_url: customLinkedin.trim() || 'https://www.linkedin.com',
      skills: ['Networking', 'Tech', 'Startups'],
      role: 'attendee' as const,
    };

    setUser(newUser);
    toast.success(`Welcome to Nexus, ${customName.trim()}!`);
    router.push(redirectTo);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between px-6 py-10">
      <div className="w-full max-w-sm mx-auto my-auto space-y-6">

        {/* Logo & Headline */}
        <div className="flex flex-col items-center text-center">
          <NexusIcon size={60} className="mb-3" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Nexus</h1>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs">
            Discover professionals in your room — 1-Tap LinkedIn Connect
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* ── Main LinkedIn OAuth Button ─────────────────────────────── */}
        <button
          id="linkedin-login-btn"
          type="button"
          onClick={handleLinkedInOAuth}
          disabled={isLoading}
          className="w-full h-12 rounded-xl font-semibold text-sm
                     flex items-center justify-center gap-3 text-white
                     bg-[#0A66C2] hover:bg-[#084e96] active:scale-[0.98]
                     transition-all duration-150 shadow-md shadow-[#0A66C2]/20"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Connecting to LinkedIn…
            </span>
          ) : (
            <>
              <LinkedInIcon className="h-4 w-4 fill-white" />
              Continue with LinkedIn
            </>
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-2xs font-semibold uppercase tracking-wider text-muted-foreground">Or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* ── Custom Attendee Sign-In Form ───────────────────────────── */}
        {!showCustomForm ? (
          <button
            type="button"
            onClick={() => setShowCustomForm(true)}
            className="w-full h-11 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-semibold text-xs flex items-center justify-center gap-2 border border-border transition-colors"
          >
            <UserCheck className="h-4 w-4 text-nexus-indigo" />
            Quick Profile Entry (Create Your Profile)
          </button>
        ) : (
          <form onSubmit={handleCustomSignIn} className="p-4 rounded-2xl bg-muted/30 border border-border space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-foreground">Create Your Event Profile</h3>
              <button
                type="button"
                onClick={() => setShowCustomForm(false)}
                className="text-2xs text-muted-foreground hover:text-foreground"
              >
                Close
              </button>
            </div>

            <div>
              <label className="block text-2xs font-semibold text-muted-foreground mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                required
                className="w-full h-10 px-3 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:border-nexus-indigo"
              />
            </div>

            <div>
              <label className="block text-2xs font-semibold text-muted-foreground mb-1">
                Role / Headline
              </label>
              <input
                type="text"
                placeholder="e.g. AI Engineer / Co-founder"
                value={customHeadline}
                onChange={(e) => setCustomHeadline(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:border-nexus-indigo"
              />
            </div>

            <div>
              <label className="block text-2xs font-semibold text-muted-foreground mb-1">
                Your LinkedIn Profile URL
              </label>
              <input
                type="url"
                placeholder="https://www.linkedin.com/in/your-profile"
                value={customLinkedin}
                onChange={(e) => setCustomLinkedin(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:border-nexus-indigo"
              />
            </div>

            <button
              type="submit"
              className="w-full h-10 rounded-xl bg-nexus-indigo text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-nexus-indigo/90 transition-colors shadow-sm"
            >
              Enter Event Room <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>
        )}

        {/* Guest Demo Link */}
        <div className="text-center pt-2">
          <Link
            href="/events/demo-1/nearby"
            className="text-2xs text-muted-foreground hover:text-foreground underline underline-offset-4"
          >
            Just exploring? Join as Guest Demo User →
          </Link>
        </div>

      </div>

      <footer className="text-center text-2xs text-muted-foreground">
        Nexus &copy; 2025 • Smart Professional Event Networking
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
