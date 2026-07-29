'use client';

// ===================================================================
// Step 1 — Goals
// Why are you attending? Select 1–3 goals.
// ===================================================================
import { cn } from '@/lib/utils';
import { ATTENDEE_GOALS } from '@/constants';
import type { AttendeeGoal } from '@/types';

interface GoalStepProps {
  selected: AttendeeGoal[];
  onChange: (goals: AttendeeGoal[]) => void;
  error?: string;
}

export function GoalStep({ selected, onChange, error }: GoalStepProps) {
  const toggle = (value: AttendeeGoal) => {
    if (selected.includes(value)) {
      onChange(selected.filter(g => g !== value));
    } else if (selected.length < 3) {
      onChange([...selected, value]);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-foreground mb-1">
          Why are you here?
        </h2>
        <p className="text-muted-foreground">
          Select up to 3 goals — this helps us find the right people for you.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {ATTENDEE_GOALS.map((goal) => {
          const isSelected = selected.includes(goal.value as AttendeeGoal);
          const isDisabled = !isSelected && selected.length >= 3;
          return (
            <button
              key={goal.value}
              type="button"
              onClick={() => toggle(goal.value as AttendeeGoal)}
              disabled={isDisabled}
              className={cn(
                'flex items-center gap-3 p-4 rounded-xl border-2 text-left',
                'transition-all duration-150 active:scale-[0.98]',
                isSelected
                  ? 'border-nexus-indigo bg-nexus-indigo/5 text-foreground'
                  : 'border-border bg-background text-foreground hover:border-foreground/30',
                isDisabled && 'opacity-40 cursor-not-allowed'
              )}
            >
              <span className="text-2xl shrink-0">{goal.emoji}</span>
              <span className="font-medium text-sm leading-tight">{goal.label}</span>
              {isSelected && (
                <span className="ml-auto h-4 w-4 rounded-full bg-nexus-indigo flex items-center justify-center shrink-0">
                  <svg className="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 12 12">
                    <path d="M10 3L5 8.5 2 5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

      <p className="mt-4 text-xs text-muted-foreground">
        {selected.length}/3 selected
      </p>
    </div>
  );
}
