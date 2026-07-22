'use client';

// ===================================================================
// Attendee Intent & Skills Selection Modal ("Why are you here?")
// Neat, modern selector for Hackathon, Job/Internship, Co-founder, etc.
// ===================================================================
import { useState } from 'react';
import { Target, Rocket, Briefcase, Users, Lightbulb, Globe, Check, Sparkles, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface IntentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (intent: string, skills: string[]) => void;
  initialIntent?: string;
  initialSkills?: string[];
}

const INTENT_OPTIONS = [
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

export function AttendeeIntentModal({
  isOpen,
  onClose,
  onSave,
  initialIntent = 'hackathon',
  initialSkills = ['AI / ML', 'React'],
}: IntentModalProps) {
  const [selectedIntent, setSelectedIntent] = useState<string>(initialIntent);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(initialSkills);
  const [customSkillInput, setCustomSkillInput] = useState<string>('');

  if (!isOpen) return null;

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

  const handleSave = () => {
    const chosenObj = INTENT_OPTIONS.find((i) => i.id === selectedIntent);
    const intentTitle = chosenObj ? chosenObj.title : 'Tech Networking 🌐';
    onSave(intentTitle, selectedSkills);
    toast.success('🎉 Networking Goal & Skills updated!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-background rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-nexus-indigo text-white shadow-xs">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-foreground leading-tight">What brings you here today?</h3>
              <p className="text-2xs text-muted-foreground">Select your goal so attendees match with you</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Intent Grid */}
          <div>
            <label className="block text-2xs font-extrabold tracking-wider uppercase text-nexus-indigo mb-2.5">
              1. Select Primary Event Goal
            </label>
            <div className="space-y-2">
              {INTENT_OPTIONS.map((opt) => {
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

          {/* Skills Selection */}
          <div>
            <label className="block text-2xs font-extrabold tracking-wider uppercase text-nexus-indigo mb-2 flex items-center justify-between">
              <span>2. Select Your Core Skills</span>
              <span className="text-muted-foreground font-normal">Press Enter to add custom</span>
            </label>
            <div className="flex flex-wrap gap-1.5 mb-3">
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
        </div>

        {/* Footer Action */}
        <div className="p-4 border-t border-border bg-muted/20">
          <button
            onClick={handleSave}
            className="w-full h-12 rounded-2xl bg-nexus-indigo text-white font-extrabold text-xs flex items-center justify-center gap-2 hover:bg-nexus-indigo/90 active:scale-[0.98] transition-all shadow-md"
          >
            <Sparkles className="h-4 w-4" /> Save Goal & Skills
          </button>
        </div>
      </div>
    </div>
  );
}
