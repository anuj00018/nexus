'use client';

/**
 * Quick Setup — Single screen, fills in 20 seconds.
 * No multi-step. Everything visible at once.
 * Goal → Interests (chips) → Privacy → Done.
 */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { NexusIcon } from '@/components/ui/Logo';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/authStore';
import { ROUTES } from '@/constants';
import { cn } from '@/lib/utils';
import type { AttendeeGoal, AvailabilityStatus, PrivacySetting } from '@/types';

// Streamlined goal list — most common ones
const GOALS = [
  { value: 'networking',  label: 'Networking',   emoji: '🤝' },
  { value: 'hiring',      label: 'Hiring',        emoji: '👔' },
  { value: 'job_seeking', label: 'Job Hunting',   emoji: '🔍' },
  { value: 'co_founder',  label: 'Co-founder',    emoji: '🚀' },
  { value: 'mentoring',   label: 'Mentoring',     emoji: '💡' },
  { value: 'learning',    label: 'Learning',      emoji: '📚' },
] as const;

const INTERESTS_QUICK = [
  { id: 'ai', label: 'AI / ML', emoji: '🤖' },
  { id: 'web', label: 'Web Dev', emoji: '🌐' },
  { id: 'design', label: 'Design', emoji: '🎨' },
  { id: 'startup', label: 'Startups', emoji: '🚀' },
  { id: 'data', label: 'Data', emoji: '📊' },
  { id: 'mobile', label: 'Mobile', emoji: '📱' },
  { id: 'crypto', label: 'Web3', emoji: '⛓️' },
  { id: 'product', label: 'Product', emoji: '📋' },
  { id: 'cloud', label: 'Cloud', emoji: '☁️' },
  { id: 'security', label: 'Security', emoji: '🔐' },
  { id: 'climate', label: 'Climate', emoji: '🌱' },
  { id: 'impact', label: 'Impact', emoji: '🌍' },
];

const PRIVACY_OPTS = [
  { value: 'everyone',            label: 'Everyone',  emoji: '🌍', desc: 'All attendees see you' },
  { value: 'matching_interests',  label: 'Matching',  emoji: '🎯', desc: 'Shown first to matches' },
  { value: 'invisible',           label: 'Ghost',     emoji: '👻', desc: 'You can browse only' },
] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const { setOnboarded } = useAuthStore();
  const [goals, setGoals] = useState<string[]>(['networking']);
  const [interests, setInterests] = useState<string[]>([]);
  const [privacy, setPrivacy] = useState<PrivacySetting>('everyone');
  const [isLoading, setIsLoading] = useState(false);

  const toggleGoal = (v: string) => {
    setGoals(g => g.includes(v) ? g.filter(x => x !== v) : g.length < 3 ? [...g, v] : g);
  };
  const toggleInterest = (v: string) => {
    setInterests(i => i.includes(v) ? i.filter(x => x !== v) : i.length < 5 ? [...i, v] : i);
  };

  const handleDone = async () => {
    if (goals.length === 0) { toast.error('Pick at least one goal'); return; }
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push(ROUTES.LOGIN); return; }

      await supabase.from('user_preferences').upsert({
        user_id: user.id,
        goals,
        privacy,
        availability: 'available',
        contact_preference: 'open',
        onboarding_done: true,
      });

      setOnboarded(true);
      toast.success('All set! 🎉');
      router.push(ROUTES.JOIN_EVENT);  // Go directly to Join Event
    } catch {
      toast.error('Error saving. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-5 py-8 pb-24">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <NexusIcon size={36} />
          <div>
            <h1 className="text-lg font-bold text-foreground leading-none">Quick setup</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Takes under 20 seconds</p>
          </div>
        </div>

        {/* ── Goals ─────────────────────────────────────────────── */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-foreground mb-3">
            Why are you here? <span className="text-muted-foreground font-normal">(pick up to 3)</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {GOALS.map(g => {
              const on = goals.includes(g.value);
              const disabled = !on && goals.length >= 3;
              return (
                <button key={g.value} type="button" onClick={() => toggleGoal(g.value)}
                  disabled={disabled}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-2 rounded-full border text-sm font-medium',
                    'transition-all duration-100 active:scale-95',
                    on ? 'bg-nexus-indigo border-nexus-indigo text-white'
                       : 'bg-background border-border text-foreground hover:border-foreground/40',
                    disabled && 'opacity-30 cursor-not-allowed'
                  )}>
                  <span>{g.emoji}</span>{g.label}
                  {on && <Check className="h-3 w-3 ml-0.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border mb-6" />

        {/* ── Interests ─────────────────────────────────────────── */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-foreground mb-3">
            Your interests <span className="text-muted-foreground font-normal">(up to 5)</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {INTERESTS_QUICK.map(i => {
              const on = interests.includes(i.id);
              const disabled = !on && interests.length >= 5;
              return (
                <button key={i.id} type="button" onClick={() => toggleInterest(i.id)}
                  disabled={disabled}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-2 rounded-full border text-sm font-medium',
                    'transition-all duration-100 active:scale-95',
                    on ? 'bg-nexus-indigo/10 border-nexus-indigo text-nexus-indigo'
                       : 'bg-background border-border text-foreground hover:border-foreground/40',
                    disabled && 'opacity-30 cursor-not-allowed'
                  )}>
                  <span>{i.emoji}</span>{i.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border mb-6" />

        {/* ── Privacy ───────────────────────────────────────────── */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-foreground mb-3">Who can see you?</p>
          <div className="flex gap-2">
            {PRIVACY_OPTS.map(p => (
              <button key={p.value} type="button" onClick={() => setPrivacy(p.value as PrivacySetting)}
                className={cn(
                  'flex-1 flex flex-col items-center gap-1 py-3 rounded-xl border-2 text-center',
                  'transition-all duration-100 active:scale-95',
                  privacy === p.value
                    ? 'border-nexus-indigo bg-nexus-indigo/5'
                    : 'border-border hover:border-foreground/20'
                )}>
                <span className="text-xl">{p.emoji}</span>
                <span className="text-xs font-semibold text-foreground">{p.label}</span>
                <span className="text-2xs text-muted-foreground">{p.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Done Button ───────────────────────────────────────── */}
        <button
          onClick={handleDone}
          disabled={isLoading || goals.length === 0}
          className="w-full h-14 rounded-xl bg-nexus-black text-white font-semibold text-base
                     flex items-center justify-center gap-2
                     hover:bg-nexus-black/90 active:scale-[0.98]
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-150 shadow-lg"
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          ) : (
            <>Find people at my event <ArrowRight className="h-5 w-5" /></>
          )}
        </button>

      </div>
    </div>
  );
}
