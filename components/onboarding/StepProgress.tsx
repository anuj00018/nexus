'use client';

// ===================================================================
// Onboarding Step Progress Bar
// ===================================================================
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step { label: string; }

interface StepProgressProps {
  steps: Step[];
  currentStep: number; // 0-indexed
}

export function StepProgress({ steps, currentStep }: StepProgressProps) {
  return (
    <div className="w-full mb-8">
      {/* Step dots row */}
      <div className="flex items-center gap-0">
        {steps.map((step, i) => {
          const isDone = i < currentStep;
          const isCurrent = i === currentStep;
          return (
            <div key={step.label} className="flex items-center flex-1 last:flex-none">
              {/* Dot */}
              <div className={cn(
                'relative flex items-center justify-center rounded-full shrink-0 transition-all duration-300',
                isDone   ? 'w-7 h-7 bg-nexus-indigo text-white'                : '',
                isCurrent? 'w-7 h-7 bg-nexus-indigo text-white ring-4 ring-nexus-indigo/20' : '',
                !isDone && !isCurrent ? 'w-7 h-7 bg-muted text-muted-foreground' : ''
              )}>
                {isDone
                  ? <Check className="h-3.5 w-3.5" />
                  : <span className="text-xs font-semibold">{i + 1}</span>
                }
              </div>
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className={cn(
                  'h-0.5 flex-1 mx-1 rounded-full transition-all duration-500',
                  i < currentStep ? 'bg-nexus-indigo' : 'bg-border'
                )} />
              )}
            </div>
          );
        })}
      </div>
      {/* Label */}
      <div className="mt-3 flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">
          {steps[currentStep]?.label}
        </p>
        <p className="text-xs text-muted-foreground">
          {currentStep + 1} / {steps.length}
        </p>
      </div>
    </div>
  );
}
