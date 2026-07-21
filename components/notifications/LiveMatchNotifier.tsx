'use client';

// ===================================================================
// LiveMatchNotifier — Real-time Match Banner Notification
// Displays toast/banner alerts when high-value matches enter the room
// ===================================================================
import { useState, useEffect } from 'react';
import { Sparkles, Zap, X, ChevronRight, Users } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface LiveMatchNotifierProps {
  onOpenChat: (attendee: any) => void;
}

const MATCH_ALERTS = [
  {
    id: 'a1',
    name: 'Kavya Sharma',
    headline: 'AI Lead @ TechVentures',
    avatar_url: null,
    linkedin_url: 'https://www.linkedin.com/in/kavya-sharma',
    reason: 'Shared 3 interests: AI / ML, Startups, Web3',
  },
  {
    id: 'a2',
    name: 'Sameer Verma',
    headline: 'Co-founder & CTO @ BuildFast',
    avatar_url: null,
    linkedin_url: 'https://www.linkedin.com/in/sameer-verma',
    reason: 'Co-founder Goal Match in room',
  },
];

export function LiveMatchNotifier({ onOpenChat }: LiveMatchNotifierProps) {
  const [activeAlert, setActiveAlert] = useState<any | null>(null);

  useEffect(() => {
    // Fire a simulated live match notification after 5 seconds
    const timer = setTimeout(() => {
      setActiveAlert(MATCH_ALERTS[0]);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!activeAlert) return null;

  return (
    <div className="fixed bottom-16 md:bottom-6 right-4 z-40 max-w-sm w-full animate-bounce">
      <div className="bg-nexus-black text-white p-4 rounded-2xl border border-nexus-indigo/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-nexus-indigo/20 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-start justify-between gap-2 relative z-10 mb-2">
          <div className="flex items-center gap-1.5 text-2xs font-bold text-nexus-indigo uppercase tracking-wider">
            <Zap className="h-3.5 w-3.5 text-nexus-indigo animate-pulse" />
            New Match Entered Room!
          </div>
          <button
            onClick={() => setActiveAlert(null)}
            className="p-1 text-white/60 hover:text-white transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <Avatar src={activeAlert.avatar_url} alt={activeAlert.name} size="md" />
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-xs text-white truncate">{activeAlert.name}</h4>
            <p className="text-[11px] text-white/70 truncate">{activeAlert.headline}</p>
            <p className="text-[10px] text-nexus-indigo font-medium mt-0.5">{activeAlert.reason}</p>
          </div>
          <button
            onClick={() => {
              onOpenChat(activeAlert);
              setActiveAlert(null);
            }}
            className="px-3 py-1.5 rounded-xl bg-nexus-indigo text-white text-2xs font-semibold hover:bg-nexus-indigo/90 transition-colors shrink-0 shadow-xs flex items-center gap-1"
          >
            Chat <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
