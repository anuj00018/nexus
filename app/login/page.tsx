'use client';

// ===================================================================
// Login Page — Universal LinkedIn & Attendee Sign-In
// - Direct LinkedIn Email / Profile Sign-In
// - Real OAuth fallback
// ===================================================================
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AlertCircle, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
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
  const [showLinkedInForm, setShowLinkedInForm] = useState(false);

  // Form inputs for user LinkedIn sign-in
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [headline, setHeadline] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');

  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectTo = searchParams.get('redirectTo') ?? '/dashboard';
  const setUser = useAuthStore((s) => s.setUser);

  // Handle direct sign in with user's name & LinkedIn profile
  const handleDirectSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    setIsLoading(true);

    const formattedLinkedin = linkedinUrl.trim().startsWith('http')
      ? linkedinUrl.trim()
      : linkedinUrl.trim()
      ? `https://${linkedinUrl.trim()}`
      : 'https://www.linkedin.com';

    const newUser = {
      id: `user-${Date.now()}`,
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@nexus.app`,
      name: name.trim(),
      avatar_url: null,
      headline: headline.trim() || 'Tech Professional',
      linkedin_url: formattedLinkedin,
      skills: ['Networking', 'Tech', 'Startups'],
      role: 'attendee' as const,
    };

    setUser(newUser);
    toast.success(`Welcome to Nexus, ${name.trim()}!`);
    setTimeout(() => {
      router.push(redirectTo);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between px-6 py-10">
      <div className="w-full max-w-sm mx-auto my-auto space-y-6">

        {/* Logo & Headline */}
        <div className="flex flex-col items-center text-center">
          <NexusIcon size={64} className="mb-3" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Nexus</h1>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs">
            Discover professionals in your room — 1-Tap LinkedIn Connect
          </p>
        </div>

        {/* ── Main LinkedIn Button ─────────────────────────────── */}
        {!showLinkedInForm ? (
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setShowLinkedInForm(true)}
              className="w-full h-12 rounded-xl font-semibold text-sm
                         flex items-center justify-center gap-3 text-white
                         bg-[#0A66C2] hover:bg-[#084e96] active:scale-[0.98]
                         transition-all duration-150 shadow-md shadow-[#0A66C2]/20"
            >
              <LinkedInIcon className="h-5 w-5 fill-white" />
              Sign In with LinkedIn
            </button>

            <button
              type="button"
              onClick={() => setShowLinkedInForm(true)}
              className="w-full h-11 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-semibold text-xs flex items-center justify-center gap-2 border border-border transition-colors"
            >
              Create / Enter Your Event Profile
            </button>
          </div>
        ) : (
          /* ── Direct LinkedIn & Profile Sign-In Form ───────────── */
          <form onSubmit={handleDirectSignIn} className="p-5 rounded-2xl bg-muted/40 border border-border space-y-3.5 shadow-lg animate-fade-in">
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <div className="flex items-center gap-2">
                <LinkedInIcon className="h-4 w-4 text-[#0A66C2]" />
                <h3 className="text-xs font-bold text-foreground">LinkedIn Sign-In</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowLinkedInForm(false)}
                className="text-2xs text-muted-foreground hover:text-foreground"
              >
                Back
              </button>
            </div>

            <div>
              <label className="block text-2xs font-semibold text-muted-foreground mb-1">
                Your Full Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full h-10 px-3 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:border-[#0A66C2]"
              />
            </div>

            <div>
              <label className="block text-2xs font-semibold text-muted-foreground mb-1">
                LinkedIn Email / Username
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:border-[#0A66C2]"
              />
            </div>

            <div>
              <label className="block text-2xs font-semibold text-muted-foreground mb-1">
                Role / Professional Headline
              </label>
              <input
                type="text"
                placeholder="e.g. Founder @ Tech / Software Engineer"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:border-[#0A66C2]"
              />
            </div>

            <div>
              <label className="block text-2xs font-semibold text-muted-foreground mb-1">
                Your LinkedIn Profile URL
              </label>
              <input
                type="text"
                placeholder="https://www.linkedin.com/in/your-profile"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-background border border-border text-xs text-foreground focus:outline-none focus:border-[#0A66C2]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !name.trim()}
              className="w-full h-11 rounded-xl bg-[#0A66C2] text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#084e96] active:scale-[0.98] disabled:opacity-50 transition-all shadow-md mt-2"
            >
              {isLoading ? (
                <span>Entering Room…</span>
              ) : (
                <>
                  Sign In & Enter Event Room <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Demo Fast Link */}
        <div className="text-center pt-2">
          <Link
            href="/events/demo-1/nearby"
            className="text-2xs text-muted-foreground hover:text-foreground underline underline-offset-4"
          >
            Just exploring? Continue as Guest Demo User →
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
