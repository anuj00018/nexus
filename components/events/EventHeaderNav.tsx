'use client';

// ===================================================================
// EventHeaderNav — Sub-header navigation bar for event pages
// Warm Black + Soft White + Muted Sage design aesthetic.
// Allows 1-tap switching between:
//   - Nearby People (/events/[id]/nearby)
//   - Room Heatmap  (/events/[id]/heatmap)
//   - Recap & Rating (/events/[id]/recap)
// ===================================================================
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Flame, Star, ChevronLeft, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EventHeaderNavProps {
  eventId: string;
  eventTitle?: string;
  activeCount?: number;
}

export function EventHeaderNav({ eventId, eventTitle = 'Event Room', activeCount = 18 }: EventHeaderNavProps) {
  const pathname = usePathname();
  const safeEventId = eventId && eventId !== 'undefined' ? eventId : 'nexus1';

  const TABS = [
    {
      id: 'nearby',
      label: 'Nearby People',
      icon: Users,
      href: `/events/${safeEventId}/nearby`,
    },
    {
      id: 'heatmap',
      label: 'Room Heatmap',
      icon: Flame,
      href: `/events/${safeEventId}/heatmap`,
    },
    {
      id: 'recap',
      label: 'Recap & Rating',
      icon: Star,
      href: `/events/${safeEventId}/recap`,
    },
  ];

  return (
    <div
      className="sticky top-0 z-30 shadow-xl backdrop-blur-2xl bg-[#030712]/92 border-b border-white/[0.08]"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
        {/* Top title bar */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-1.5 rounded-xl text-slate-400 hover:text-white transition-colors hover:bg-white/[0.08]"
              title="Back to Dashboard"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-display font-bold text-white tracking-tight truncate max-w-[200px] sm:max-w-xs">
                  {eventTitle}
                </h1>
                <span
                  className="flex items-center gap-1.5 text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-cyan-500/15 border border-cyan-400/35 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                  Live Room
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="h-3 w-3 shrink-0 text-cyan-400" />
                <span className="text-cyan-300 font-semibold">{activeCount}</span> attendees in radar range
              </p>
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <nav
          className="flex items-center gap-1.5 p-1 rounded-xl bg-[#070B19]/80 border border-white/[0.07]"
        >
          {TABS.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200 relative'
                )}
                style={isActive ? {
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(6, 182, 212, 0.25) 100%)',
                  border: '1px solid rgba(6, 182, 212, 0.5)',
                  color: '#ffffff',
                  boxShadow: '0 0 16px rgba(6, 182, 212, 0.25)',
                } : {
                  color: '#94A3B8',
                }}
              >
                <tab.icon className={cn('h-3.5 w-3.5', isActive ? 'text-cyan-300' : 'text-slate-400')} />
                <span className={isActive ? 'font-bold' : 'hover:text-white'}>{tab.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
