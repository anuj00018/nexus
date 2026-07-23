'use client';

// ===================================================================
// Post Sign-In Setup ("Why are you here?" & Skills Selection)
// Displays immediately after LinkedIn Sign-In
// ===================================================================
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check, Rocket, Briefcase, Users, Lightbulb, Globe, Sparkles, Target } from 'lucide-react';
import toast from 'react-hot-toast';
import { NexusIcon } from '@/components/ui/Logo';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/authStore';
import { ROUTES } from '@/constants';
import { cn } from '@/lib/utils';

const WHY_HERE_OPTIONS = [
  {
    id: 'hackathon',
    title: 'Hackathon & Teammates 🚀',
    desc: 'Looking for developers, designers, or hackers to build projects',
    icon: Rocket,
    color: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  },
  {
    id: 'jobs',
    title: 'Job / Internship Search 💼',
    desc: 'Open to software engineering, tech, product, or design roles',
    icon: Briefcase,
    color: 'bg-nexus-indigo/10 text-nexus-indigo border-nexus-indigo/20',
  },
  {
    id: 'cofounder',
    title: 'Co-Founder & Startup 🤝',
    desc: 'Building a startup, looking for co-founders or tech partners',
    icon: Users,
    color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  },
  {
    id: 'investing',
    title: 'Investing & Mentorship 💡',
    desc: 'Looking to invest, mentor, or advise tech talent',
    icon: Lightbulb,
    color: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  },
  {
    id: 'networking',
    title: 'Tech Networking 🌐',
    desc: 'General networking with developers, founders, and creators',
    icon: Globe,
    color: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  },
];

const SKILL_TAGS = [
  'React', 'AI / ML', 'Python', 'Node.js', 'UI/UX Design',
  'Product Strategy', 'Cloud & DevOps', 'Mobile Apps', 'Marketing', 'Sales'
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, setUser, setOnboarded } = useAuthStore();
  const [selectedIntent, setSelectedIntent] = useState<string>('hackathon');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['AI / ML', 'React']);
  const [customSkillInput, setCustomSkillInput] = useState<string>('');
  const [fullName, setFullName] = useState<string>(user?.name || '');
  const [linkedinUrl, setLinkedinUrl] = useState<string>(user?.linkedin_url || '');
  const [isLoading, setIsLoading] = useState(false);

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
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

  const handleDone = async () => {
    setIsLoading(true);
    const chosenObj = WHY_HERE_OPTIONS.find((i) => i.id === selectedIntent);
    const intentTitle = chosenObj ? chosenObj.title : 'Tech Networking 🌐';

    const updatedName = fullName.trim() || user?.name || `Attendee #${Math.floor(1000 + Math.random() * 9000)}`;
    const updatedLinkedin = linkedinUrl.trim().startsWith('http')
      ? linkedinUrl.trim()
      : linkedinUrl.trim()
      ? `https://${linkedinUrl.trim()}`
      : user?.linkedin_url || 'https://www.linkedin.com';

    if (user) {
      setUser({
        ...user,
        name: updatedName,
        headline: intentTitle,
        linkedin_url: updatedLinkedin,
        skills: selectedSkills,
      } as any);
    }

    try {
      const supabase = createClient();
      const { data: { user: sbUser } } = await supabase.auth.getUser();
      if (sbUser) {
        await supabase.from('user_preferences').upsert({
          user_id: sbUser.id,
          goals: [intentTitle],
          availability: 'available',
          onboarding_done: true,
        });
      }
    } catch {}

    setOnboarded(true);
    toast.success('🎉 Profile setup complete!');
    router.push(ROUTES.JOIN_EVENT);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between p-5 py-8">
      <div className="max-w-md mx-auto w-full my-auto space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <NexusIcon size={44} />
          <div>
            <span className="text-2xs font-extrabold tracking-widest uppercase text-nexus-indigo">
              Post Sign-In Profile Setup
            </span>
            <h1 className="text-xl font-extrabold text-foreground leading-tight">What brings you here today?</h1>
          </div>
        </div>

        {/* ── 1. Select Why You Are Here ───────────────────────────── */}
        <div className="space-y-3">
          <label className="block text-2xs font-extrabold tracking-wider uppercase text-nexus-indigo">
            1. Why are you attending this event?
          </label>
          <div className="space-y-2">
            {WHY_HERE_OPTIONS.map((opt) => {
              const isSelected = selectedIntent === opt.id;
              const Icon = opt.icon;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedIntent(opt.id)}
                  className={cn(
                    'w-full text-left p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3',
                    isSelected
                      ? 'bg-nexus-indigo/10 border-nexus-indigo shadow-sm'
                      : 'bg-background border-border hover:border-foreground/30'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn('p-2 rounded-xl border shrink-0', opt.color)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-foreground leading-tight">{opt.title}</p>
                      <p className="text-2xs text-muted-foreground mt-0.5">{opt.desc}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="p-1 rounded-full bg-nexus-indigo text-white shrink-0 mt-0.5">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 2. Select Skills & Expertise ──────────────────────────── */}
        <div className="space-y-2">
          <label className="block text-2xs font-extrabold tracking-wider uppercase text-nexus-indigo flex items-center justify-between">
            <span>2. Select Your Top Skills</span>
            <span className="text-muted-foreground font-normal">Press Enter to add custom</span>
          </label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {SKILL_TAGS.map((tag) => {
              const isSelected = selectedSkills.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleSkill(tag)}
                  className={cn(
                    'text-xs px-3 py-1.5 rounded-xl border font-semibold transition-all',
                    isSelected
                      ? 'bg-nexus-indigo text-white border-nexus-indigo'
                      : 'bg-muted/60 text-muted-foreground border-border hover:text-foreground'
                  )}
                >
                  {tag} {isSelected && '✓'}
                </button>
              );
            })}
          </div>

          <input
            type="text"
            placeholder="Type a custom skill & press Enter..."
            value={customSkillInput}
            onChange={(e) => setCustomSkillInput(e.target.value)}
            onKeyDown={handleAddCustomSkill}
            className="w-full h-10 px-3.5 rounded-xl bg-background border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-nexus-indigo"
          />
        </div>

        {/* ── 3. Verified Name & LinkedIn Profile Link ──────────────────────────── */}
        <div className="space-y-2.5">
          <label className="block text-2xs font-extrabold tracking-wider uppercase text-nexus-indigo">
            3. Your Verified Badge Information
          </label>

          <input
            type="text"
            placeholder="Full Name (e.g. Anuj Vardham)"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full h-10 px-3.5 rounded-xl bg-background border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-nexus-indigo"
          />

          <input
            type="text"
            placeholder="LinkedIn Profile URL (e.g. https://www.linkedin.com/in/your-name)"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            className="w-full h-10 px-3.5 rounded-xl bg-background border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-nexus-indigo"
          />
        </div>

        {/* Action Button */}
        <button
          onClick={handleDone}
          disabled={isLoading}
          className="w-full h-13 rounded-2xl bg-nexus-indigo text-white font-extrabold text-sm flex items-center justify-center gap-2 hover:bg-nexus-indigo/90 active:scale-[0.98] transition-all shadow-lg shadow-nexus-indigo/20 mt-4"
        >
          {isLoading ? 'Saving setup...' : <>Complete Setup & Enter Room <ArrowRight className="h-4 w-4" /></>}
        </button>

      </div>
    </div>
  );
}
