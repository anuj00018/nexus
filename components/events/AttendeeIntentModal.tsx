'use client';

// ===================================================================
// Attendee Intent & Skills Selection Modal ("Why are you here?")
// Deep navy glassmorphism modal styling.
// Neat, modern selector for Hackathon, Job/Internship, Co-founder, etc.
// Preserves: All intent/skills state, custom skill addition, onSave callback.
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
  },
  {
    id: 'jobs',
    title: 'Job / Internship Search 💼',
    desc: 'Open to software engineering, tech, product, or design roles',
    icon: Briefcase,
  },
  {
    id: 'cofounder',
    title: 'Co-Founder & Startup 🤝',
    desc: 'Building a startup, looking for co-founders or tech partners',
    icon: Users,
  },
  {
    id: 'investing',
    title: 'Investing & Mentorship 💡',
    desc: 'Looking to invest, mentor, or advise tech talent',
    icon: Lightbulb,
  },
  {
    id: 'networking',
    title: 'Tech Networking 🌐',
    desc: 'General networking with developers, founders, and creators',
    icon: Globe,
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: 'rgba(5, 10, 24, 0.85)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl overflow-hidden flex flex-col max-h-[90vh]"
        style={{
          background: 'rgba(10, 15, 30, 0.95)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 24px 80px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <div className="flex items-center gap-2.5">
            <div
              className="p-2 rounded-xl text-white shadow-xs"
              style={{ background: 'linear-gradient(135deg, #4263EB, #3451D1)' }}
            >
              <Target className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white leading-tight">What brings you here today?</h3>
              <p className="text-[11px] text-slate-400">Select your goal so attendees match with you</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white transition-colors hover:bg-white/[0.06]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Intent Grid */}
          <div>
            <label className="block text-[10px] font-bold tracking-wider uppercase mb-2.5" style={{ color: '#4263EB' }}>
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
                      'w-full text-left p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3'
                    )}
                    style={isSelected ? {
                      background: 'rgba(66, 99, 235, 0.12)',
                      border: '1px solid rgba(66, 99, 235, 0.3)',
                    } : {
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="p-2 rounded-xl border shrink-0"
                        style={{
                          background: 'rgba(66, 99, 235, 0.08)',
                          border: '1px solid rgba(66, 99, 235, 0.15)',
                          color: '#7B93F5',
                        }}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-bold text-xs text-white leading-tight">{opt.title}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{opt.desc}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="p-1 rounded-full text-white shrink-0 mt-0.5" style={{ background: '#4263EB' }}>
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
            <label className="block text-[10px] font-bold tracking-wider uppercase mb-2 flex items-center justify-between" style={{ color: '#4263EB' }}>
              <span>2. Select Your Core Skills</span>
              <span className="text-slate-500 font-normal normal-case tracking-normal">Press Enter to add custom</span>
            </label>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {SKILL_TAGS.map((tag) => {
                const isSelected = selectedSkills.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleSkill(tag)}
                    className="text-xs px-3 py-1.5 rounded-xl border font-semibold transition-all"
                    style={isSelected ? {
                      background: 'linear-gradient(135deg, #4263EB, #3451D1)',
                      color: '#ffffff',
                      borderColor: 'rgba(66, 99, 235, 0.4)',
                    } : {
                      background: 'rgba(255, 255, 255, 0.03)',
                      color: '#94a3b8',
                      borderColor: 'rgba(255, 255, 255, 0.06)',
                    }}
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
              className="w-full h-10 px-3.5 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none transition-all"
              style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
              onFocus={(e) => { e.target.style.borderColor = 'rgba(66, 99, 235, 0.4)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)'; }}
            />
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-4" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <button
            onClick={handleSave}
            className="w-full h-12 rounded-2xl text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
            style={{ background: 'linear-gradient(135deg, #4263EB 0%, #3451D1 100%)', boxShadow: '0 8px 24px rgba(66, 99, 235, 0.25)' }}
          >
            <Sparkles className="h-4 w-4" /> Save Goal & Skills
          </button>
        </div>
      </div>
    </div>
  );
}
