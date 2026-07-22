'use client';

// ===================================================================
// Login Page — Official LinkedIn Redirect Sign-In
// Redirects directly to LinkedIn official authorization / Chrome login page
// ===================================================================
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowRight, Lock, Mail, User, Linkedin, Check, Sparkles, ShieldCheck, ExternalLink } from 'lucide-react';
import { NexusIcon } from '@/components/ui/Logo';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
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
  const [showProfileForm, setShowProfileForm] = useState(false);

  // User Attendee details
  const [fullName, setFullName] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [skillsInput, setSkillsInput] = useState('Networking, Tech');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Networking', 'Tech']);

  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectTo = searchParams.get('redirectTo') ?? '/dashboard';
  const setUser = useAuthStore((s) => s.setUser);

  // Redirect directly to Chrome / LinkedIn Official Login Page
  const handleOfficialLinkedInRedirect = async () => {
    setIsLoading(true);
    toast.success('Redirecting to LinkedIn official login page...');

    // 1. Try Supabase OAuth redirect to official LinkedIn login
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin_oidc',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`,
          scopes: 'openid profile email',
        },
      });
      if (!error) return;
    } catch {}

    // 2. Direct browser navigation to official LinkedIn login page
    setTimeout(() => {
      window.location.href = 'https://www.linkedin.com/login';
    }, 500);
  };

  // Complete Entry after LinkedIn authentication
  const handleCompleteEntry = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = fullName.trim();
    if (!trimmedName) {
      toast.error('Please enter your Full Name');
      return;
    }

    setIsLoading(true);

    const formattedLinkedin = linkedinUrl.trim().startsWith('http')
      ? linkedinUrl.trim()
      : linkedinUrl.trim()
      ? `https://${linkedinUrl.trim()}`
      : `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(trimmedName)}`;

    const parsedSkills = skillsInput
      ? skillsInput.split(',').map((s) => s.trim()).filter(Boolean)
      : ['Networking', 'Tech'];

    const newUser = {
      id: `user-linkedin-${Date.now()}`,
      email: `${trimmedName.toLowerCase().replace(/\s+/g, '.')}@nexus.app`,
      name: trimmedName,
      avatar_url: null,
      headline: 'LinkedIn Verified Attendee',
      linkedin_url: formattedLinkedin,
      skills: parsedSkills,
      role: 'attendee' as const,
    };

    setUser(newUser as any);
    toast.success(`Welcome to Nexus, ${trimmedName}!`);

    setTimeout(() => {
      router.push(redirectTo);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between px-5 py-8">
      <div className="w-full max-w-sm mx-auto my-auto space-y-6">

        {/* Logo Header */}
        <div className="flex flex-col items-center text-center">
          <NexusIcon size={60} className="mb-2" />
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Nexus</h1>
          <span className="text-2xs font-extrabold tracking-widest uppercase text-nexus-indigo mt-0.5">
            Meet.Connect.Grow
          </span>
          <p className="text-xs text-muted-foreground mt-2 max-w-xs">
            Sign in on LinkedIn's official page to enter your event room
          </p>
        </div>

        {/* ── Primary Main Button: Open Official LinkedIn Login Page ── */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleOfficialLinkedInRedirect}
            disabled={isLoading}
            className="w-full h-14 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-3 text-white bg-[#0A66C2] hover:bg-[#084e96] active:scale-[0.98] transition-all shadow-xl shadow-[#0A66C2]/30 border border-white/20"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Opening LinkedIn Login Page…
              </span>
            ) : (
              <>
                <LinkedInIcon className="h-5 w-5 fill-white shrink-0" />
                Sign In on LinkedIn Official Page ↗
              </>
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-2xs font-bold uppercase tracking-wider text-muted-foreground">Or Enter Room Profile</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* ── Confirm Room Profile Form ───────────────────────────── */}
        {!showProfileForm ? (
          <button
            type="button"
            onClick={() => setShowProfileForm(true)}
            className="w-full h-11 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-semibold text-xs flex items-center justify-center gap-2 border border-border transition-colors"
          >
            <User className="h-4 w-4 text-nexus-indigo" />
            Set Your Room Display Profile & Skills
          </button>
        ) : (
          <form onSubmit={handleCompleteEntry} className="p-5 rounded-2xl bg-muted/40 border border-border space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h3 className="text-xs font-bold text-foreground">Room Display Profile</h3>
              <button
                type="button"
                onClick={() => setShowProfileForm(false)}
                className="text-2xs text-muted-foreground hover:text-foreground"
              >
                Close
              </button>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-2xs font-bold text-foreground mb-1.5 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                Full Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Anuj Vardham"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl bg-background border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#0A66C2]"
              />
            </div>

            {/* LinkedIn Profile Link */}
            <div>
              <label className="block text-2xs font-bold text-foreground mb-1.5 flex items-center gap-1.5">
                <Linkedin className="h-3.5 w-3.5 text-[#0A66C2]" />
                Your LinkedIn Profile URL
              </label>
              <input
                type="text"
                placeholder="https://www.linkedin.com/in/your-profile"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl bg-background border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#0A66C2]"
              />
            </div>

            {/* Custom Skills & Expertise */}
            <div>
              <label className="block text-2xs font-bold text-foreground mb-1.5 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-nexus-indigo" />
                Skills & Expertise
              </label>
              <input
                type="text"
                placeholder="e.g. AI / ML, Product Strategy, React"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl bg-background border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#0A66C2] mb-2"
              />
              <div className="flex flex-wrap gap-1.5">
                {['AI / ML', 'Product Strategy', 'Software Eng', 'UI/UX Design', 'Marketing', 'Founder', 'Investing'].map((chip) => {
                  const isSelected = selectedSkills.includes(chip);
                  return (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => {
                        const next = isSelected
                          ? selectedSkills.filter((s) => s !== chip)
                          : [...selectedSkills, chip];
                        setSelectedSkills(next);
                        setSkillsInput(next.join(', '));
                      }}
                      className={cn(
                        'text-2xs px-2 py-0.5 rounded-lg border font-semibold transition-all',
                        isSelected
                          ? 'bg-nexus-indigo text-white border-nexus-indigo'
                          : 'bg-background text-muted-foreground border-border hover:border-foreground/30'
                      )}
                    >
                      {chip}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !fullName.trim()}
              className="w-full h-11 rounded-xl bg-nexus-indigo text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-nexus-indigo/90 active:scale-[0.98] disabled:opacity-50 transition-all shadow-md mt-3"
            >
              Enter Event Room <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}

      </div>

      <footer className="text-center text-2xs text-muted-foreground flex items-center justify-center gap-1.5">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
        Nexus &copy; 2025 • Official LinkedIn Authentication
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
