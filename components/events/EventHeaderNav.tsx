'use client';

// ===================================================================
// EventHeaderNav — Sub-header navigation bar for event pages
// Deep navy glassmorphism styling with active glow indicator.
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
  const safeEventId = eventId && eventId !== 'undefined' ? eventId : 'demo-1';

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
      className="sticky top-0 z-30 shadow-md backdrop-blur-2xl"
      style={{
        background: 'rgba(8, 12, 24, 0.9)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
        {/* Top title bar */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-1.5 rounded-xl text-slate-400 hover:text-white transition-colors hover:bg-white/[0.06]"
              title="Back to Dashboard"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-display font-bold text-white truncate max-w-[200px] sm:max-w-xs">
                  {eventTitle}
                </h1>
                <span
                  className="flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-full font-semibold"
                  style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    color: '#10B981',
                  }}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Room
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="h-3 w-3 shrink-0" style={{ color: '#4263EB' }} />
                {activeCount} attendees in range
              </p>
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <nav
          className="flex items-center gap-1 p-1 rounded-xl"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
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
                  background: 'rgba(66, 99, 235, 0.12)',
                  border: '1px solid rgba(66, 99, 235, 0.2)',
                  color: '#ffffff',
                  boxShadow: '0 2px 8px rgba(66, 99, 235, 0.2)',
                } : {
                  color: '#94a3b8',
                }}
              >
                <tab.icon className={cn('h-3.5 w-3.5')} style={{ color: isActive ? '#4263EB' : '#94a3b8' }} />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
