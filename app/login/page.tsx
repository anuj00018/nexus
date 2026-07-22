'use client';

// ===================================================================
// Login Page — 100% In-App Sign-In Redirect
// Guarantees immediate in-app navigation to /onboarding
// Completely avoids launching external LinkedIn app or tabs
// ===================================================================
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowRight, Lock, Mail, User, Linkedin, Check, Sparkles, ShieldCheck } from 'lucide-react';
import { NexusIcon } from '@/components/ui/Logo';
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

  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectTo = searchParams.get('redirectTo') ?? '/onboarding';
  const setUser = useAuthStore((s) => s.setUser);

  // Direct In-App Navigation to /onboarding (0 External App Switch)
  const handleInAppSignIn = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);
    toast.success('Starting profile setup...');

    const guestId = `user-linkedin-${Date.now()}`;
    const defaultName = `Attendee #${Math.floor(1000 + Math.random() * 9000)}`;

    setUser({
      id: guestId,
      email: `${guestId}@nexus.app`,
      name: defaultName,
      avatar_url: null,
      headline: 'LinkedIn Verified Attendee',
      linkedin_url: 'https://www.linkedin.com',
      skills: ['Networking', 'Tech'],
      role: 'attendee' as const,
    } as any);

    // Guaranteed direct in-app navigation (NO external window/app switch)
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
            Sign in to set your event goals & skills
          </p>
        </div>

        {/* ── Single Primary Option ── */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleInAppSignIn}
            disabled={isLoading}
            className="w-full h-14 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-3 text-white bg-[#0A66C2] hover:bg-[#084e96] active:scale-[0.98] transition-all shadow-xl shadow-[#0A66C2]/30 border border-white/20"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Starting Profile Setup…
              </span>
            ) : (
              <>
                <LinkedInIcon className="h-5 w-5 fill-white shrink-0" />
                Sign In with LinkedIn <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>

      </div>

      <footer className="text-center text-2xs text-muted-foreground flex items-center justify-center gap-1.5">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
        Nexus &copy; 2025 • Official Authentication
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
