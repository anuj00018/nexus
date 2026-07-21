'use client';

// ===================================================================
// Step 3 — Availability & Privacy
// Set your status for the event and who can discover you
// ===================================================================
import { cn } from '@/lib/utils';
import { AVAILABILITY_OPTIONS, PRIVACY_OPTIONS } from '@/constants';
import type { AvailabilityStatus, PrivacySetting } from '@/types';

interface AvailabilityStepProps {
  availability: AvailabilityStatus;
  privacy: PrivacySetting;
  onAvailabilityChange: (v: AvailabilityStatus) => void;
  onPrivacyChange: (v: PrivacySetting) => void;
}

export function AvailabilityStep({
  availability,
  privacy,
  onAvailabilityChange,
  onPrivacyChange,
}: AvailabilityStepProps) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-foreground mb-1">
          Set your status
        </h2>
        <p className="text-muted-foreground">
          Let others know how open you are — and control who can find you.
        </p>
      </div>

      {/* Availability */}
      <div className="mb-8">
        <label className="text-sm font-semibold text-foreground mb-3 block">
          Availability
        </label>
        <div className="flex flex-col gap-2">
          {AVAILABILITY_OPTIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onAvailabilityChange(opt.value as AvailabilityStatus)}
              className={cn(
                'flex items-center gap-4 p-4 rounded-xl border-2 text-left',
                'transition-all duration-150 active:scale-[0.99]',
                availability === opt.value
                  ? 'border-nexus-indigo bg-nexus-indigo/5'
                  : 'border-border bg-background hover:border-foreground/20'
              )}
            >
              {/* Status dot */}
              <span className={cn('h-3 w-3 rounded-full shrink-0', opt.dotClass.replace('status-dot-', '').includes('online') ? 'bg-emerald-500' : opt.dotClass.includes('busy') ? 'bg-red-500' : 'bg-amber-500')} />
              <div className="flex-1">
                <p className={cn('font-semibold text-sm', opt.color)}>{opt.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{opt.description}</p>
              </div>
              {availability === opt.value && (
                <div className="h-5 w-5 rounded-full bg-nexus-indigo flex items-center justify-center shrink-0">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 12 12">
                    <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Privacy */}
      <div>
        <label className="text-sm font-semibold text-foreground mb-3 block">
          Who can discover you?
        </label>
        <div className="flex flex-col gap-2">
          {PRIVACY_OPTIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onPrivacyChange(opt.value as PrivacySetting)}
              className={cn(
                'flex items-center gap-4 p-4 rounded-xl border-2 text-left',
                'transition-all duration-150 active:scale-[0.99]',
                privacy === opt.value
                  ? 'border-nexus-indigo bg-nexus-indigo/5'
                  : 'border-border bg-background hover:border-foreground/20'
              )}
            >
              <span className="text-2xl shrink-0">{opt.icon}</span>
              <div className="flex-1">
                <p className="font-semibold text-sm text-foreground">{opt.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{opt.description}</p>
              </div>
              {privacy === opt.value && (
                <div className="h-5 w-5 rounded-full bg-nexus-indigo flex items-center justify-center shrink-0">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 12 12">
                    <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          You can change this anytime from your profile settings.
        </p>
      </div>
    </div>
  );
}
