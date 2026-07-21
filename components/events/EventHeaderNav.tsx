'use client';

// ===================================================================
// EventHeaderNav — Sub-header navigation bar for event pages
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
    <div className="bg-background border-b border-border sticky top-0 z-30 shadow-xs">
      <div className="container-nexus py-3">
        {/* Top title bar */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              title="Back to Dashboard"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-foreground truncate max-w-[200px] sm:max-w-xs">
                  {eventTitle}
                </h1>
                <span className="flex items-center gap-1 text-2xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Room
                </span>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3 shrink-0 text-nexus-indigo" />
                {activeCount} attendees in range
              </p>
            </div>
          </div>
        </div>

        {/* Tab switcher */}
        <nav className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl">
          {TABS.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-150',
                  isActive
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/40'
                )}
              >
                <tab.icon className={cn('h-3.5 w-3.5', isActive ? 'text-nexus-indigo' : 'text-muted-foreground')} />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
