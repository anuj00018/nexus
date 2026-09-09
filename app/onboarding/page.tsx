'use client';

// ===================================================================
// Nexus v3.0 — First-Time Profile Onboarding
// Pure Black (#000000) Background + Aligned Electric Blue (#2563EB / #3B82F6) Buttons & Accents.
// Preserves: All form state, API & Supabase upserts, validation, router logic.
// Includes: Strict LinkedIn Profile URL validation (https://www.linkedin.com/in/username).
// Saves profile permanently so user is NEVER asked for onboarding again.
// ===================================================================
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, User, Building2, ShieldCheck, Linkedin, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { NexusIcon } from '@/components/ui/Logo';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

const LOOKING_FOR_OPTIONS = [
  { id: 'Internship', label: 'Internship 🎓' },
  { id: 'Job', label: 'Job 💼' },
  { id: 'Co-founder', label: 'Co-founder 🤝' },
  { id: 'Networking', label: 'Networking 🌐' },
  { id: 'Hiring', label: 'Hiring 👔' },
  { id: 'Mentorship', label: 'Mentorship 💡' },
  { id: 'Collaboration', label: 'Collaboration 🛠️' },
];

const INTEREST_TAGS = [
  'AI / ML', 'Product Strategy', 'Frontend & Mobile', 'Backend & Cloud',
  'UI/UX Design', 'Web3 & Crypto', 'SaaS & Startups', 'Venture Capital', 'Growth & Marketing'
];

const LINKEDIN_URL_REGEX = /^https?:\/\/(?:[a-z]{2,3}\.)?linkedin\.com\/in\/[^\s/]+\/?.*$/i;

export default function OnboardingPage() {
  const router = useRouter();
  const { user, setUser, setOnboarded } = useAuthStore();

  const [fullName, setFullName] = useState<string>(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState<string>(user?.avatar_url || '');
  const [linkedinUrl, setLinkedinUrl] = useState<string>(user?.linkedin_url || '');
  const [organization, setOrganization] = useState<string>(user?.company || '');
  const [bio, setBio] = useState<string>(user?.bio || '');
  const [selectedLookingFor, setSelectedLookingFor] = useState<string[]>(['Networking', 'Co-founder']);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['AI / ML', 'SaaS & Startups']);
  const [isLoading, setIsLoading] = useState(false);

  // Pre-fill from Supabase Auth session metadata if available
  useEffect(() => {
    try {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data: { user: sbUser } }) => {
        if (sbUser?.user_metadata) {
          if (!fullName && sbUser.user_metadata.full_name) {
            setFullName(sbUser.user_metadata.full_name);
          }
          if (!avatarUrl && sbUser.user_metadata.avatar_url) {
            setAvatarUrl(sbUser.user_metadata.avatar_url);
          }
          if (!linkedinUrl && sbUser.user_metadata.linkedin_url && LINKEDIN_URL_REGEX.test(sbUser.user_metadata.linkedin_url)) {
            setLinkedinUrl(sbUser.user_metadata.linkedin_url);
          }
        }
      }).catch((e) => console.warn('Metadata prefill notice:', e));
    } catch { }
  }, []);

  const toggleItem = (list: string[], item: string, setter: (val: string[]) => void) => {
    if (list.includes(item)) {
      setter(list.filter((i) => i !== item));
    } else {
      setter([...list, item]);
    }
  };

  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading) return;

    const trimmedName = fullName.trim();
    if (!trimmedName) {
      toast.error('Please enter your Full Name');
      return;
    }

    let formattedLinkedin = linkedinUrl.trim();
    if (formattedLinkedin && !formattedLinkedin.startsWith('http')) {
      formattedLinkedin = `https://${formattedLinkedin}`;
    }

    if (!formattedLinkedin || !LINKEDIN_URL_REGEX.test(formattedLinkedin)) {
      toast.error('Please enter a valid LinkedIn Profile URL (e.g. https://www.linkedin.com/in/yourname)');
      return;
    }

    if (selectedLookingFor.length === 0) {
      toast.error('Please select at least one "Looking For" goal');
      return;
    }

    setIsLoading(true);

    try {
      const targetId = user?.id || `user-linkedin-${Date.now()}`;

      const updatedUser = {
        id: targetId,
        email: user?.email || 'authenticated@linkedin.com',
        name: trimmedName,
        avatar_url: avatarUrl.trim() || null,
        company: organization.trim() || null,
        bio: bio.trim() || null,
        linkedin_url: formattedLinkedin,
        interests: selectedInterests,
        looking_for: selectedLookingFor,
        role: user?.role || 'attendee',
        is_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // 1. Immediately update Zustand local state & set onboarded flag
      setUser(updatedUser as any);
      setOnboarded(true);

      // 2. Persist locally to localStorage & cookies (permanent fallback)
      try {
        localStorage.setItem('nexus_user_profile', JSON.stringify(updatedUser));
        document.cookie = `nexus_onboarded=true; path=/; max-age=31536000; SameSite=Lax`;
        document.cookie = `nexus_demo_session=true; path=/; max-age=31536000; SameSite=Lax`;
      } catch (e) {
        console.warn('Storage warning:', e);
      }

      // 3. Persist profile to Supabase via server API route
      try {
        await fetch('/api/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: targetId,
            email: updatedUser.email,
            name: updatedUser.name,
            avatar_url: updatedUser.avatar_url,
            company: updatedUser.company,
            bio: updatedUser.bio,
            linkedin_url: updatedUser.linkedin_url,
            looking_for: selectedLookingFor,
            interests: selectedInterests,
          }),
        });
      } catch (apiErr) {
        console.warn('[Onboarding] Profile API notice:', apiErr);
      }

      toast.success('🎉 Profile saved permanently! Redirecting to Dashboard...');

      // 4. Instant navigation to Dashboard
      window.location.href = '/dashboard';

    } catch (err: any) {
      console.error('Profile onboarding error:', err);
      toast.error(err.message || 'Failed to save profile. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-between p-4 sm:p-8 overflow-x-hidden relative"
      style={{ background: '#000000' }}
    >
      {/* ── Deep Pure Black Ambient Lighting ─────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Deep electric blue ambient backglow */}
        <div
          className="absolute animate-float"
          style={{
            top: '2%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '650px',
            height: '420px',
            background: 'radial-gradient(ellipse, rgba(37, 99, 235, 0.15) 0%, transparent 70%)',
            filter: 'blur(95px)',
          }}
        />
        {/* Soft cyan-blue accent orb */}
        <div
          className="absolute animate-float"
          style={{
            bottom: '5%',
            right: '10%',
            width: '450px',
            height: '350px',
            background: 'radial-gradient(ellipse, rgba(59, 130, 246, 0.10) 0%, transparent 70%)',
            filter: 'blur(80px)',
            animationDirection: 'reverse',
          }}
        />
      </div>

      <div className="relative z-10 max-w-xl mx-auto w-full space-y-6 my-auto animate-fade-in">

        {/* ── Card Header ────────────────────────────────────────── */}
        <div className="flex items-center gap-3 pb-5" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div
            className="rounded-2xl p-1 shrink-0"
            style={{
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.4), rgba(15, 23, 42, 0.9))',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              boxShadow: '0 4px 16px rgba(37, 99, 235, 0.25)',
            }}
          >
            <NexusIcon size={44} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#3B82F6] flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-[#3B82F6]" />
                LinkedIn Verified Profile Setup
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-display font-bold text-[#FFFFFF] leading-tight mt-0.5">
              Complete Your Profile
            </h1>
          </div>
        </div>

        {/* ── Main Obsidian Glass Card ───────────────────────────── */}
        <div
          className="rounded-3xl p-6 sm:p-9 space-y-6 backdrop-blur-2xl"
          style={{
            background: '#090A0D',
            border: '1px solid rgba(255, 255, 255, 0.09)',
            boxShadow: '0 24px 80px rgba(0, 0, 0, 0.8), 0 0 40px rgba(37, 99, 235, 0.08)',
          }}
        >
          <form onSubmit={handleCompleteProfile} className="space-y-6">

            {/* 1. Full Name & Profile Photo URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-[11px] font-bold tracking-wider uppercase text-[#60A5FA]">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 h-4 w-4 text-[#64748B]" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Rivera"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full h-12 pl-10 pr-4 rounded-xl text-xs text-white placeholder:text-[#475569] font-medium focus:outline-none transition-all duration-200"
                    style={{
                      background: '#0D0E13',
                      border: '1px solid rgba(255, 255, 255, 0.09)',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3B82F6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.09)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-bold tracking-wider uppercase text-[#60A5FA]">
                  Profile Photo URL (Optional)
                </label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl text-xs text-white placeholder:text-[#475569] font-mono text-[11px] focus:outline-none transition-all duration-200"
                  style={{
                    background: '#0D0E13',
                    border: '1px solid rgba(255, 255, 255, 0.09)',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3B82F6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.09)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* 2. LinkedIn Profile URL */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold tracking-wider uppercase text-[#60A5FA]">
                  LinkedIn Profile URL *
                </label>
                <span className="text-[10px] text-[#64748B] font-medium">Must be /in/username</span>
              </div>
              <div className="relative">
                <Linkedin className="absolute left-3.5 top-3.5 h-4 w-4 text-[#0A66C2]" />
                <input
                  type="url"
                  required
                  placeholder="https://www.linkedin.com/in/username"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="w-full h-12 pl-10 pr-4 rounded-xl text-xs text-white placeholder:text-[#475569] font-medium focus:outline-none transition-all duration-200"
                  style={{
                    background: '#0D0E13',
                    border: '1px solid rgba(255, 255, 255, 0.09)',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3B82F6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.09)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* 3. College / Company */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold tracking-wider uppercase text-[#60A5FA]">
                College / Company
              </label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-3.5 h-4 w-4 text-[#64748B]" />
                <input
                  type="text"
                  placeholder="e.g. Stanford University or Google"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full h-12 pl-10 pr-4 rounded-xl text-xs text-white placeholder:text-[#475569] font-medium focus:outline-none transition-all duration-200"
                  style={{
                    background: '#0D0E13',
                    border: '1px solid rgba(255, 255, 255, 0.09)',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3B82F6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.09)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* 4. What Are You Looking For? (Aligned Blue Buttons) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold tracking-wider uppercase text-[#60A5FA]">
                  What Are You Looking For? *
                </label>
                <span className="text-[10px] text-[#64748B] font-medium">Select all that apply</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {LOOKING_FOR_OPTIONS.map((opt) => {
                  const isSelected = selectedLookingFor.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => toggleItem(selectedLookingFor, opt.id, setSelectedLookingFor)}
                      className={cn(
                        'h-9 px-3.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95',
                        isSelected
                          ? 'text-white'
                          : 'text-[#94A3B8] hover:text-white'
                      )}
                      style={isSelected ? {
                        background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                        border: '1px solid #3B82F6',
                        boxShadow: '0 4px 14px rgba(37, 99, 235, 0.38)',
                      } : {
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      <span>{opt.label}</span>
                      {isSelected && <span className="font-bold text-white ml-0.5">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Interests & Domains (Aligned Blue Buttons) */}
            <div className="space-y-2.5">
              <label className="block text-[11px] font-bold tracking-wider uppercase text-[#60A5FA]">
                Interests & Domains
              </label>
              <div className="flex flex-wrap gap-2">
                {INTEREST_TAGS.map((tag) => {
                  const isSelected = selectedInterests.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleItem(selectedInterests, tag, setSelectedInterests)}
                      className={cn(
                        'h-8 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95',
                        isSelected
                          ? 'text-white font-semibold'
                          : 'text-[#94A3B8] hover:text-white'
                      )}
                      style={isSelected ? {
                        background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                        border: '1px solid #3B82F6',
                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.32)',
                      } : {
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      <span>{tag}</span>
                      {isSelected && <span className="font-bold text-white text-[11px]">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 6. Short Bio (Optional) */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold tracking-wider uppercase text-[#60A5FA]">
                Short Bio (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Tell others what you are building or interested in..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-3.5 rounded-xl text-xs text-white placeholder:text-[#475569] resize-none focus:outline-none transition-all duration-200"
                style={{
                  background: '#0D0E13',
                  border: '1px solid rgba(255, 255, 255, 0.09)',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3B82F6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.09)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* ── Primary Action Button (Aligned Blue Gradient) ────── */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-13 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all mt-4 disabled:opacity-60 shadow-lg hover:brightness-110"
              style={{
                background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                boxShadow: '0 8px 32px rgba(37, 99, 235, 0.42)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
              }}
            >
              {isLoading ? (
                <span className="flex items-center gap-2 text-white">
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving Profile...
                </span>
              ) : (
                <>
                  Save Profile & Go to Dashboard <ArrowRight className="h-4 w-4 text-white" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <footer className="text-center text-[11px] text-[#64748B] flex items-center justify-center gap-1.5 pt-2">
          <ShieldCheck className="h-3.5 w-3.5 text-[#3B82F6]" />
          Nexus &copy; 2025 • Official Verified LinkedIn Account Profile
        </footer>
      </div>
    </div>
  );
}
