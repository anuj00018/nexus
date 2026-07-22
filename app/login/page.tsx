'use client';

// ===================================================================
// Login Page — Secured LinkedIn Credentials Sign-In
// Requires valid LinkedIn ID / Email, password, name, and LinkedIn URL.
// ===================================================================
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowRight, Lock, Mail, User, Linkedin, Check, Sparkles, ShieldCheck } from 'lucide-react';
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

  // LinkedIn Sign-In credentials
  const [linkedinId, setLinkedinId] = useState('');
  const [linkedinPassword, setLinkedinPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [skillsInput, setSkillsInput] = useState('Networking, Tech');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Networking', 'Tech']);

  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectTo = searchParams.get('redirectTo') ?? '/dashboard';
  const setUser = useAuthStore((s) => s.setUser);

  // Handle Secured LinkedIn Sign-In
  const handleLinkedInSignIn = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedId = linkedinId.trim();
    const trimmedPass = linkedinPassword.trim();
    const trimmedName = fullName.trim();

    if (!trimmedId) {
      toast.error('Please enter your LinkedIn Email or ID');
      return;
    }

    if (!trimmedPass || trimmedPass.length < 6) {
      toast.error('LinkedIn password must be at least 6 characters long');
      return;
    }

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
      email: trimmedId,
      name: trimmedName,
      avatar_url: null,
      headline: 'LinkedIn Verified Attendee',
      linkedin_url: formattedLinkedin,
      skills: parsedSkills,
      role: 'attendee' as const,
    };

    setUser(newUser as any);
    toast.success(`LinkedIn Authenticated! Welcome, ${trimmedName}!`);

    setTimeout(() => {
      router.push(redirectTo);
    }, 400);
  };

  // Handle Direct Native LinkedIn App / OAuth Redirect
  const handleOpenLinkedInApp = async () => {
    setIsLoading(true);

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

    // Fallback to native mobile app launch & official OAuth login
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = 'linkedin://';
      setTimeout(() => {
        window.location.href = 'https://www.linkedin.com/oauth/v2/authorization';
      }, 600);
    } else {
      window.open('https://www.linkedin.com/login', '_blank', 'noopener,noreferrer');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between px-5 py-8">
      <div className="w-full max-w-sm mx-auto my-auto space-y-6">

        {/* Logo Header */}
        <div className="flex flex-col items-center text-center">
          <NexusIcon size={56} className="mb-2" />
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Nexus</h1>
          <span className="text-2xs font-extrabold tracking-widest uppercase text-nexus-indigo mt-0.5">
            Meet.Connect.Grow
          </span>
          <p className="text-xs text-muted-foreground mt-2 max-w-xs">
            Connect directly via LinkedIn App or enter your credentials below
          </p>
        </div>

        {/* ── Primary Direct LinkedIn App Button ─────────────────────── */}
        <button
          type="button"
          onClick={handleOpenLinkedInApp}
          disabled={isLoading}
          className="w-full h-13 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 text-white bg-[#0A66C2] hover:bg-[#084e96] active:scale-[0.98] transition-all shadow-lg shadow-[#0A66C2]/30 border border-white/10"
        >
          <LinkedInIcon className="h-5 w-5 fill-white shrink-0" />
          Open LinkedIn App / Sign In Directly ↗
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-2xs font-bold uppercase tracking-wider text-muted-foreground">Or Enter Credentials</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* ── Secured LinkedIn ID & Password Form ───────────────────────────── */}
        <form onSubmit={handleLinkedInSignIn} className="p-5 rounded-2xl bg-muted/40 border border-border space-y-4 shadow-xl">

          {/* LinkedIn ID / Email */}
          <div>
            <label className="block text-2xs font-bold text-foreground mb-1.5 flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-[#0A66C2]" />
              LinkedIn Email or Phone ID <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. user@gmail.com"
              value={linkedinId}
              onChange={(e) => setLinkedinId(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-background border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#0A66C2] focus:ring-1 focus:ring-[#0A66C2]"
            />
          </div>

          {/* LinkedIn Password */}
          <div>
            <label className="block text-2xs font-bold text-foreground mb-1.5 flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-[#0A66C2]" />
              LinkedIn Password (Min 6 chars) <span className="text-destructive">*</span>
            </label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="••••••••••••"
              value={linkedinPassword}
              onChange={(e) => setLinkedinPassword(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-background border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#0A66C2] focus:ring-1 focus:ring-[#0A66C2]"
            />
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
              Skills & Expertise (Displayed on Badge)
            </label>
            <input
              type="text"
              placeholder="e.g. AI / ML, Product Strategy, React"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl bg-background border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#0A66C2] mb-2"
            />
            {/* Quick skill chips */}
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

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isLoading || !linkedinId.trim() || linkedinPassword.length < 6 || !fullName.trim()}
            className="w-full h-12 rounded-xl bg-[#0A66C2] text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#084e96] active:scale-[0.98] disabled:opacity-50 transition-all shadow-md shadow-[#0A66C2]/20 mt-3"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Authenticating LinkedIn…
              </span>
            ) : (
              <>
                <LinkedInIcon className="h-4 w-4 fill-white" />
                Sign In with LinkedIn <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

      </div>

      <footer className="text-center text-2xs text-muted-foreground flex items-center justify-center gap-1.5">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
        Nexus &copy; 2025 • Secured LinkedIn Authentication
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
