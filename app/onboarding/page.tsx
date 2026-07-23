'use client';

// ===================================================================
// Nexus First-Time Profile Onboarding Setup
// Displays only once after first LinkedIn OAuth login.
// Collects Full Name, Photo, Headline, Organization, Skills,
// Interests, "Looking For", and Bio. Saves to Supabase.
// ===================================================================
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check, ShieldCheck, User, Building2, Sparkles, Briefcase, Tag, Heart, Target } from 'lucide-react';
import toast from 'react-hot-toast';
import { NexusIcon } from '@/components/ui/Logo';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/authStore';
import { ROUTES } from '@/constants';
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

const SKILL_TAGS = [
  'React', 'AI / ML', 'Python', 'Node.js', 'UI/UX Design',
  'Product Strategy', 'Cloud & DevOps', 'Mobile Apps', 'Marketing', 'Sales'
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, setUser, setOnboarded } = useAuthStore();

  const [fullName, setFullName] = useState<string>(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState<string>(user?.avatar_url || '');
  const [headline, setHeadline] = useState<string>(user?.headline || '');
  const [organization, setOrganization] = useState<string>(user?.company || '');
  const [bio, setBio] = useState<string>(user?.bio || '');
  const [selectedLookingFor, setSelectedLookingFor] = useState<string[]>(['Networking', 'Co-founder']);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['AI / ML', 'SaaS & Startups']);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['React', 'AI / ML']);
  const [customSkillInput, setCustomSkillInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Pre-fill from Supabase Auth session if user exists
  useEffect(() => {
    try {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data: { user: sbUser } }) => {
        if (sbUser) {
          if (!fullName && sbUser.user_metadata?.full_name) {
            setFullName(sbUser.user_metadata.full_name);
          }
          if (!avatarUrl && sbUser.user_metadata?.avatar_url) {
            setAvatarUrl(sbUser.user_metadata.avatar_url);
          }
          if (!headline && sbUser.user_metadata?.headline) {
            setHeadline(sbUser.user_metadata.headline);
          }
        }
      });
    } catch {}
  }, []);

  const toggleItem = (list: string[], item: string, setter: (val: string[]) => void) => {
    if (list.includes(item)) {
      setter(list.filter((i) => i !== item));
    } else {
      setter([...list, item]);
    }
  };

  const handleAddCustomSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && customSkillInput.trim()) {
      e.preventDefault();
      const val = customSkillInput.trim();
      if (!selectedSkills.includes(val)) {
        setSelectedSkills([...selectedSkills, val]);
      }
      setCustomSkillInput('');
    }
  };

  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error('Please enter your Full Name');
      return;
    }
    if (selectedLookingFor.length === 0) {
      toast.error('Please select at least one "Looking For" goal');
      return;
    }

    setIsLoading(true);

    const updatedUser = {
      id: user?.id || `user-linkedin-${Date.now()}`,
      email: user?.email || 'authenticated@linkedin.com',
      name: fullName.trim(),
      avatar_url: avatarUrl.trim() || null,
      headline: headline.trim() || 'Tech Professional',
      company: organization.trim() || 'Tech Network',
      bio: bio.trim() || null,
      linkedin_url: user?.linkedin_url || 'https://www.linkedin.com',
      skills: selectedSkills,
      interests: selectedInterests,
      looking_for: selectedLookingFor,
      role: (user?.role as any) || 'attendee',
      is_verified: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setUser(updatedUser as any);
    setOnboarded(true);

    // Save profile into Supabase
    try {
      const supabase = createClient();
      const { data: { user: sbUser } } = await supabase.auth.getUser();

      const targetId = sbUser?.id || updatedUser.id;

      await supabase.from('users').upsert({
        id: targetId,
        name: updatedUser.name,
        avatar_url: updatedUser.avatar_url,
        headline: updatedUser.headline,
        company: updatedUser.company,
        bio: updatedUser.bio,
        skills: updatedUser.skills,
        linkedin_url: updatedUser.linkedin_url,
        is_verified: true,
      }, { onConflict: 'id' });

      await supabase.from('user_preferences').upsert({
        user_id: targetId,
        goals: selectedLookingFor,
        onboarding_done: true,
        availability: 'available',
      }, { onConflict: 'user_id' });
    } catch (err) {
      console.warn('Supabase onboarding save warning:', err);
    }

    toast.success('🎉 Profile completed! Joining event room...');
    router.push(ROUTES.EVENT_NEARBY('demo-1'));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between p-5 py-8">
      <div className="max-w-lg mx-auto w-full space-y-6 my-auto">

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border pb-5">
          <NexusIcon size={48} />
          <div>
            <span className="text-2xs font-extrabold tracking-widest uppercase text-nexus-indigo">
              LinkedIn Verified Profile Setup
            </span>
            <h1 className="text-xl font-extrabold text-foreground leading-tight">Build Your Nexus Profile</h1>
          </div>
        </div>

        <form onSubmit={handleCompleteProfile} className="space-y-5">

          {/* 1. Basic Info: Name & Photo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-2xs font-extrabold tracking-wider uppercase text-nexus-indigo">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Rivera"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-11 pl-10 pr-3.5 rounded-xl bg-background border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-nexus-indigo font-semibold"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-2xs font-extrabold tracking-wider uppercase text-nexus-indigo">
                Profile Photo URL (Optional)
              </label>
              <input
                type="text"
                placeholder="https://..."
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-background border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-nexus-indigo font-mono text-2xs"
              />
            </div>
          </div>

          {/* 2. Headline & College / Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-2xs font-extrabold tracking-wider uppercase text-nexus-indigo">
                Headline
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="e.g. AI Engineer @ Google"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full h-11 pl-10 pr-3.5 rounded-xl bg-background border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-nexus-indigo font-semibold"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-2xs font-extrabold tracking-wider uppercase text-nexus-indigo">
                College / Company
              </label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="e.g. Stanford / Google"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full h-11 pl-10 pr-3.5 rounded-xl bg-background border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-nexus-indigo font-semibold"
                />
              </div>
            </div>
          </div>

          {/* 3. Looking For (Multi-Select) */}
          <div className="space-y-2">
            <label className="block text-2xs font-extrabold tracking-wider uppercase text-nexus-indigo flex items-center justify-between">
              <span>What Are You Looking For? *</span>
              <span className="text-muted-foreground font-normal">Select all that apply</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {LOOKING_FOR_OPTIONS.map((opt) => {
                const isSelected = selectedLookingFor.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleItem(selectedLookingFor, opt.id, setSelectedLookingFor)}
                    className={cn(
                      'text-xs px-3 py-1.5 rounded-xl border font-semibold transition-all',
                      isSelected
                        ? 'bg-nexus-indigo text-white border-nexus-indigo shadow-sm'
                        : 'bg-muted/50 text-muted-foreground border-border hover:text-foreground'
                    )}
                  >
                    {opt.label} {isSelected && '✓'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Skills (Multi-Select + Custom) */}
          <div className="space-y-2">
            <label className="block text-2xs font-extrabold tracking-wider uppercase text-nexus-indigo flex items-center justify-between">
              <span>Top Skills & Expertise</span>
              <span className="text-muted-foreground font-normal">Press Enter to add custom</span>
            </label>
            <div className="flex flex-wrap gap-1.5 mb-1.5">
              {SKILL_TAGS.map((tag) => {
                const isSelected = selectedSkills.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleItem(selectedSkills, tag, setSelectedSkills)}
                    className={cn(
                      'text-xs px-3 py-1 rounded-xl border font-medium transition-all',
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-muted/40 text-muted-foreground border-border hover:text-foreground'
                    )}
                  >
                    {tag} {isSelected && '✓'}
                  </button>
                );
              })}
            </div>
            <input
              type="text"
              placeholder="Type custom skill & press Enter..."
              value={customSkillInput}
              onChange={(e) => setCustomSkillInput(e.target.value)}
              onKeyDown={handleAddCustomSkill}
              className="w-full h-10 px-3.5 rounded-xl bg-background border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-nexus-indigo"
            />
          </div>

          {/* 5. Interests (Multi-Select) */}
          <div className="space-y-2">
            <label className="block text-2xs font-extrabold tracking-wider uppercase text-nexus-indigo">
              Interests & Domains
            </label>
            <div className="flex flex-wrap gap-1.5">
              {INTEREST_TAGS.map((tag) => {
                const isSelected = selectedInterests.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleItem(selectedInterests, tag, setSelectedInterests)}
                    className={cn(
                      'text-xs px-3 py-1 rounded-xl border font-medium transition-all',
                      isSelected
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-muted/40 text-muted-foreground border-border hover:text-foreground'
                    )}
                  >
                    {tag} {isSelected && '✓'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. Bio (Optional) */}
          <div className="space-y-1.5">
            <label className="block text-2xs font-extrabold tracking-wider uppercase text-nexus-indigo">
              Short Bio (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Tell others what you are currently building or working on..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3 rounded-xl bg-background border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-nexus-indigo resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-13 rounded-2xl bg-nexus-indigo text-white font-extrabold text-sm flex items-center justify-center gap-2 hover:bg-nexus-indigo/90 active:scale-[0.98] transition-all shadow-lg shadow-nexus-indigo/20 mt-4"
          >
            {isLoading ? 'Saving Profile...' : <>Save Profile & Join Event Room <ArrowRight className="h-4 w-4" /></>}
          </button>
        </form>

      </div>
    </div>
  );
}
