'use client';

// ===================================================================
// Step 4 — Profile Details
// Bio, skills, contact preference, optional links
// ===================================================================
import { useState } from 'react';
import { Plus, X, Github, Globe, Linkedin } from 'lucide-react';
import { Input, Textarea } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface ProfileStepProps {
  bio: string;
  skills: string[];
  contactPreference: 'open' | 'selective' | 'closed';
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  onBioChange: (v: string) => void;
  onSkillsChange: (v: string[]) => void;
  onContactChange: (v: 'open' | 'selective' | 'closed') => void;
  onLinkedinChange: (v: string) => void;
  onGithubChange: (v: string) => void;
  onPortfolioChange: (v: string) => void;
  errors?: Partial<Record<string, string>>;
}

const CONTACT_OPTIONS = [
  { value: 'open', label: 'Open', description: 'Anyone can reach out', emoji: '🟢' },
  { value: 'selective', label: 'Selective', description: 'Matching interests only', emoji: '🟡' },
  { value: 'closed', label: 'Closed', description: 'Not accepting contacts', emoji: '🔴' },
] as const;

const SKILL_SUGGESTIONS = [
  'React', 'Python', 'TypeScript', 'Node.js', 'Machine Learning',
  'Product Management', 'UI/UX', 'Figma', 'AWS', 'Go', 'Rust',
  'Data Science', 'Blockchain', 'iOS', 'Android', 'DevOps',
];

export function ProfileStep({
  bio, skills, contactPreference,
  linkedinUrl, githubUrl, portfolioUrl,
  onBioChange, onSkillsChange, onContactChange,
  onLinkedinChange, onGithubChange, onPortfolioChange,
  errors = {},
}: ProfileStepProps) {
  const [skillInput, setSkillInput] = useState('');

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (!trimmed || skills.includes(trimmed) || skills.length >= 10) return;
    onSkillsChange([...skills, trimmed]);
    setSkillInput('');
  };

  const removeSkill = (skill: string) => {
    onSkillsChange(skills.filter(s => s !== skill));
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(skillInput);
    }
    if (e.key === 'Backspace' && !skillInput && skills.length > 0) {
      removeSkill(skills[skills.length - 1]);
    }
  };

  const filteredSuggestions = SKILL_SUGGESTIONS.filter(
    s => !skills.includes(s) && s.toLowerCase().includes(skillInput.toLowerCase())
  ).slice(0, 6);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground mb-1">
          Tell your story
        </h2>
        <p className="text-muted-foreground">
          A great profile gets 3× more connections.
        </p>
      </div>

      {/* Bio */}
      <Textarea
        label="Bio"
        placeholder="I'm a full-stack developer building my first startup. Looking to meet investors and potential co-founders..."
        value={bio}
        onChange={e => onBioChange(e.target.value)}
        maxLength={300}
        showCount
        rows={3}
        error={errors.bio}
        helperText="Keep it genuine — people connect with authenticity."
      />

      {/* Skills */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">
          Skills <span className="text-muted-foreground font-normal">(up to 10)</span>
        </label>
        {/* Pills + input */}
        <div className={cn(
          'flex flex-wrap gap-2 p-3 rounded-lg border bg-background min-h-[44px]',
          'focus-within:ring-2 focus-within:ring-ring transition-all',
          'border-input'
        )}>
          {skills.map(skill => (
            <Badge key={skill} variant="accent" size="sm"
              removable onRemove={() => removeSkill(skill)}>
              {skill}
            </Badge>
          ))}
          {skills.length < 10 && (
            <input
              type="text"
              placeholder={skills.length === 0 ? 'Type a skill and press Enter...' : '+ Add skill'}
              value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyDown={handleSkillKeyDown}
              className="flex-1 min-w-[120px] bg-transparent text-sm outline-none
                         placeholder:text-muted-foreground text-foreground"
            />
          )}
        </div>
        {/* Suggestions */}
        {skillInput && filteredSuggestions.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {filteredSuggestions.map(s => (
              <button key={s} type="button" onClick={() => addSkill(s)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full
                           border border-dashed border-border text-xs text-muted-foreground
                           hover:border-nexus-indigo hover:text-nexus-indigo transition-colors">
                <Plus className="h-3 w-3" />{s}
              </button>
            ))}
          </div>
        )}
        {/* Quick suggestions when empty */}
        {!skillInput && skills.length === 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {SKILL_SUGGESTIONS.slice(0, 8).map(s => (
              <button key={s} type="button" onClick={() => addSkill(s)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full
                           border border-dashed border-border text-xs text-muted-foreground
                           hover:border-nexus-indigo hover:text-nexus-indigo transition-colors">
                <Plus className="h-3 w-3" />{s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Contact Preference */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">
          Contact Preference
        </label>
        <div className="flex gap-2">
          {CONTACT_OPTIONS.map(opt => (
            <button key={opt.value} type="button"
              onClick={() => onContactChange(opt.value)}
              className={cn(
                'flex-1 flex flex-col items-center gap-1 p-3 rounded-xl border-2 text-center',
                'transition-all duration-150 text-sm',
                contactPreference === opt.value
                  ? 'border-nexus-indigo bg-nexus-indigo/5'
                  : 'border-border hover:border-foreground/20'
              )}>
              <span className="text-xl">{opt.emoji}</span>
              <span className="font-semibold text-xs">{opt.label}</span>
              <span className="text-2xs text-muted-foreground leading-tight">{opt.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Optional Links */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">
          Links <span className="text-muted-foreground font-normal">(optional)</span>
        </p>
        <Input
          placeholder="https://linkedin.com/in/yourname"
          value={linkedinUrl}
          onChange={e => onLinkedinChange(e.target.value)}
          leftIcon={<Linkedin className="h-4 w-4" />}
          error={errors.linkedin_url}
        />
        <Input
          placeholder="https://github.com/yourname"
          value={githubUrl}
          onChange={e => onGithubChange(e.target.value)}
          leftIcon={<Github className="h-4 w-4" />}
          error={errors.github_url}
        />
        <Input
          placeholder="https://yourportfolio.com"
          value={portfolioUrl}
          onChange={e => onPortfolioChange(e.target.value)}
          leftIcon={<Globe className="h-4 w-4" />}
          error={errors.portfolio_url}
        />
      </div>
    </div>
  );
}
