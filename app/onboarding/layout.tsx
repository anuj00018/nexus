// ===================================================================
// Onboarding Layout — wraps all onboarding steps
// Clean, minimal, full-screen with progress indicator
// ===================================================================
import type { Metadata } from 'next';
import { NexusLogo } from '@/components/ui/Logo';

export const metadata: Metadata = {
  title: 'Setup Your Profile',
  description: 'Tell us about yourself to get discovered at events.',
};

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Minimal header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <NexusLogo size={26} variant="full" />
        <span className="text-xs text-muted-foreground">Setup · Step by step</span>
      </header>
      <main className="flex-1 flex items-start justify-center p-4 md:p-8 overflow-y-auto">
        <div className="w-full max-w-2xl">
          {children}
        </div>
      </main>
    </div>
  );
}
