'use client';

// ===================================================================
// Step 5 — Profile Preview & Confirm
// Shows what your profile card looks like to others before finishing
// ===================================================================
import { Linkedin, Github, Globe, Star } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ATTENDEE_GOALS, AVAILABILITY_OPTIONS } from '@/constants';
import type { AttendeeGoal, AvailabilityStatus } from '@/types';
import type { Interest } from '@/types';

interface PreviewStepProps {
  name: string;
  avatarUrl?: string | null;
  headline?: string | null;
  company?: string | null;
  bio: string;
  skills: string[];
  goals: AttendeeGoal[];
  interests: Interest[];
  selectedInterestIds: string[];
  availability: AvailabilityStatus;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
}

export function PreviewStep({
  name, avatarUrl, headline, company, bio, skills,
  goals, interests, selectedInterestIds, availability,
  linkedinUrl, githubUrl, portfolioUrl,
}: PreviewStepProps) {
  const selectedInterests = interests.filter(i => selectedInterestIds.includes(i.id));
  const goalLabels = goals.map(g => ATTENDEE_GOALS.find(ag => ag.value === g));
  const availOpt = AVAILABILITY_OPTIONS.find(a => a.value === availability);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-foreground mb-1">
          Your profile preview
        </h2>
        <p className="text-muted-foreground">
          This is how other attendees will see you. Looks great!
        </p>
      </div>

      {/* Profile Card Preview */}
      <div className="rounded-2xl border-2 border-nexus-indigo/30 bg-card shadow-card overflow-hidden">
        {/* Header banner */}
        <div className="h-20 bg-gradient-to-r from-nexus-indigo/20 via-purple-500/10 to-nexus-indigo/5" />

        <div className="px-5 pb-5">
          {/* Avatar + status */}
          <div className="flex items-end justify-between -mt-10 mb-4">
            <div className="relative">
              <Avatar
                src={avatarUrl}
                alt={name}
                size="2xl"
                status={availability}
                className="ring-4 ring-background"
                priority
              />
            </div>
            {availOpt && (
              <Badge variant={availability === 'available' ? 'available' : availability === 'busy' ? 'busy' : 'coffee'} size="sm" dot>
                {availOpt.label}
              </Badge>
            )}
          </div>

          {/* Name & headline */}
          <div className="mb-3">
            <h3 className="text-lg font-bold text-foreground">{name || 'Your Name'}</h3>
            {headline && (
              <p className="text-sm text-muted-foreground mt-0.5">{headline}</p>
            )}
            {company && (
              <p className="text-xs text-muted-foreground mt-0.5">🏢 {company}</p>
            )}
          </div>

          {/* Bio */}
          {bio && (
            <p className="text-sm text-muted-foreground mb-3 leading-relaxed line-clamp-3">
              {bio}
            </p>
          )}

          {/* Goals */}
          {goalLabels.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {goalLabels.map(g => g && (
                <Badge key={g.value} variant="accent" size="xs" icon={g.emoji}>
                  {g.label}
                </Badge>
              ))}
            </div>
          )}

          {/* Interests */}
          {selectedInterests.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {selectedInterests.slice(0, 5).map(interest => (
                <Badge key={interest.id} variant="muted" size="xs" icon={interest.icon}>
                  {interest.name}
                </Badge>
              ))}
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {skills.slice(0, 6).map(skill => (
                <span key={skill}
                  className="px-2 py-0.5 rounded-md bg-muted text-xs text-muted-foreground font-medium">
                  {skill}
                </span>
              ))}
              {skills.length > 6 && (
                <span className="px-2 py-0.5 rounded-md bg-muted text-xs text-muted-foreground">
                  +{skills.length - 6} more
                </span>
              )}
            </div>
          )}

          {/* Ratings placeholder */}
          <div className="flex items-center gap-1 mb-4">
            {[1,2,3,4,5].map(s => (
              <Star key={s} className="h-3.5 w-3.5 text-muted-foreground/30" />
            ))}
            <span className="text-xs text-muted-foreground ml-1">No ratings yet</span>
          </div>

          {/* CTA buttons */}
          <div className="flex gap-2">
            {linkedinUrl ? (
              <Button variant="accent" size="sm" asChild fullWidth
                leftIcon={<Linkedin className="h-4 w-4" />}>
                <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
                  View LinkedIn
                </a>
              </Button>
            ) : (
              <Button variant="accent" size="sm" fullWidth
                leftIcon={<Linkedin className="h-4 w-4" />} disabled>
                View LinkedIn
              </Button>
            )}
            {githubUrl && (
              <Button variant="outline" size="sm" asChild
                leftIcon={<Github className="h-4 w-4" />}>
                <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        🎉 You're all set! Join your first event to start connecting.
      </p>
    </div>
  );
}
