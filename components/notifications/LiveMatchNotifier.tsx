'use client';

// ===================================================================
// LiveMatchNotifier — Real-time Match Banner Notification
// Deep navy glassmorphism notification card with electric blue glow.
// Displays toast/banner alerts when high-value matches enter the room
// Preserves: All notification logic, timer setup, chat trigger.
// ===================================================================
import { useState, useEffect } from 'react';
import { Zap, X, ChevronRight } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';

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
      <div
        className="p-4 rounded-2xl relative overflow-hidden text-white backdrop-blur-2xl shadow-2xl"
        style={{
          background: 'rgba(8, 12, 24, 0.95)',
          border: '1px solid rgba(66, 99, 235, 0.3)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(66, 99, 235, 0.1)',
        }}
      >
        <div
          className="absolute top-0 right-0 w-24 h-24 rounded-full blur-xl pointer-events-none"
          style={{ background: 'rgba(66, 99, 235, 0.15)' }}
        />

        <div className="flex items-start justify-between gap-2 relative z-10 mb-2">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider" style={{ color: '#4263EB' }}>
            <Zap className="h-3.5 w-3.5 animate-pulse" style={{ color: '#4263EB' }} />
            New Match Entered Room!
          </div>
          <button
            onClick={() => setActiveAlert(null)}
            className="p-1 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <Avatar src={activeAlert.avatar_url} alt={activeAlert.name} size="md" />
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-xs text-white truncate">{activeAlert.name}</h4>
            <p className="text-[11px] text-slate-400 truncate">{activeAlert.headline}</p>
            <p className="text-[10px] font-medium mt-0.5" style={{ color: '#7B93F5' }}>{activeAlert.reason}</p>
          </div>
          <button
            onClick={() => {
              onOpenChat(activeAlert);
              setActiveAlert(null);
            }}
            className="px-3 py-1.5 rounded-xl text-white text-[11px] font-bold transition-all shrink-0 shadow-md flex items-center gap-1 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #4263EB, #3451D1)' }}
          >
            Chat <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
