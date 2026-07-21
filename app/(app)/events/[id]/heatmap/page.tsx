'use client';

// ===================================================================
// Milestone 4: Event Heatmap Page
// Displays visual room density, attendee clustering, & hot zones
// ===================================================================
import { useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Flame, Users, MapPin, Zap, RefreshCw, Filter, Sparkles, Navigation
} from 'lucide-react';
import { EventHeaderNav } from '@/components/events/EventHeaderNav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Zone {
  id: string;
  name: string;
  category: string;
  attendeesCount: number;
  intensity: 'high' | 'medium' | 'low';
  topInterests: string[];
  gridPos: string;
  color: string;
}

const ROOM_ZONES: Zone[] = [
  {
    id: 'z1',
    name: 'AI & Machine Learning Hub',
    category: 'Technology',
    attendeesCount: 12,
    intensity: 'high',
    topInterests: ['AI / ML', 'Python', 'LLMs'],
    gridPos: 'col-span-2 row-span-2',
    color: 'from-nexus-indigo/20 to-purple-500/10 border-nexus-indigo/40',
  },
  {
    id: 'z2',
    name: 'Founders & VC Lounge',
    category: 'Business',
    attendeesCount: 8,
    intensity: 'high',
    topInterests: ['Startups', 'Venture Capital', 'Co-founders'],
    gridPos: 'col-span-1 row-span-2',
    color: 'from-amber-500/20 to-orange-500/10 border-amber-500/40',
  },
  {
    id: 'z3',
    name: 'Frontend & UI/UX Corner',
    category: 'Design & Web',
    attendeesCount: 6,
    intensity: 'medium',
    topInterests: ['React', 'Figma', 'UI/UX'],
    gridPos: 'col-span-1 row-span-1',
    color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/40',
  },
  {
    id: 'z4',
    name: 'Hiring & Career Arena',
    category: 'Jobs',
    attendeesCount: 9,
    intensity: 'high',
    topInterests: ['Hiring', 'Internships', 'Backend'],
    gridPos: 'col-span-2 row-span-1',
    color: 'from-blue-500/20 to-cyan-500/10 border-blue-500/40',
  },
  {
    id: 'z5',
    name: 'Web3 & Open Source Zone',
    category: 'Tech & Crypto',
    attendeesCount: 4,
    intensity: 'low',
    topInterests: ['Blockchain', 'Rust', 'Open Source'],
    gridPos: 'col-span-1 row-span-1',
    color: 'from-pink-500/20 to-rose-500/10 border-pink-500/40',
  },
];

export default function HeatmapPage() {
  const params = useParams();
  const eventId = (params?.id as string) || 'demo-1';
  const [selectedZone, setSelectedZone] = useState<Zone | null>(ROOM_ZONES[0]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('Heatmap updated with live signals');
    }, 600);
  };

  return (
    <div className="flex-1 overflow-y-auto pb-20 md:pb-6">
      <EventHeaderNav eventId={eventId} eventTitle="TechFest 2025" activeCount={39} />

      <div className="container-nexus py-6 space-y-6">
        {/* Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-muted/40 p-4 rounded-2xl border border-border">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Flame className="h-5 w-5 text-orange-500 fill-orange-500/20" />
              <h2 className="text-lg font-bold text-foreground">Room Density Heatmap</h2>
            </div>
            <p className="text-xs text-muted-foreground">
              See where attendees with matching interests are clustering in real-time.
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors shrink-0"
          >
            <RefreshCw className={cn('h-3.5 w-3.5 text-nexus-indigo', isRefreshing && 'animate-spin')} />
            Refresh Signals
          </button>
        </div>

        {/* Visual Room Grid / Heatmap Layout */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Navigation className="h-4 w-4 text-nexus-indigo" />
              Interactive Floor Layout
            </h3>
            <span className="text-xs text-muted-foreground">Tap a zone for cluster details</span>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-3 gap-3 min-h-[320px]">
            {ROOM_ZONES.map((zone) => {
              const isSelected = selectedZone?.id === zone.id;
              return (
                <div
                  key={zone.id}
                  onClick={() => setSelectedZone(zone)}
                  className={cn(
                    'relative rounded-2xl p-4 border transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden bg-gradient-to-br',
                    zone.color,
                    zone.gridPos,
                    isSelected
                      ? 'ring-2 ring-nexus-indigo shadow-md scale-[1.01]'
                      : 'hover:border-foreground/30 opacity-90 hover:opacity-100'
                  )}
                >
                  {/* Heat indicator glow */}
                  <div
                    className={cn(
                      'absolute -right-4 -top-4 w-16 h-16 rounded-full blur-xl pointer-events-none',
                      zone.intensity === 'high' ? 'bg-orange-500/40' : zone.intensity === 'medium' ? 'bg-amber-500/30' : 'bg-blue-500/20'
                    )}
                  />

                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-2 relative z-10">
                    <span className="text-2xs font-semibold uppercase tracking-wider text-muted-foreground/90">
                      {zone.category}
                    </span>
                    <Badge
                      variant={zone.intensity === 'high' ? 'accent' : 'default'}
                      className="text-2xs"
                    >

                      <Users className="h-3 w-3 mr-1" />
                      {zone.attendeesCount} nearby
                    </Badge>
                  </div>

                  {/* Zone Name */}
                  <div className="my-3 relative z-10">
                    <h4 className="font-bold text-sm text-foreground leading-snug">{zone.name}</h4>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {zone.topInterests.map((interest) => (
                        <span
                          key={interest}
                          className="text-2xs px-2 py-0.5 rounded-md bg-background/70 backdrop-blur-xs font-medium text-foreground/80 border border-border/50"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer status */}
                  <div className="flex items-center justify-between text-2xs text-muted-foreground relative z-10 pt-2 border-t border-border/30">
                    <span className="flex items-center gap-1 font-medium">
                      <span
                        className={cn(
                          'h-2 w-2 rounded-full',
                          zone.intensity === 'high' ? 'bg-orange-500 animate-ping' : 'bg-emerald-500'
                        )}
                      />
                      {zone.intensity === 'high' ? 'High Clustering' : 'Normal Activity'}
                    </span>
                    <span className="text-nexus-indigo font-semibold">Explore Zone →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Zone Details Drawer/Card */}
        {selectedZone && (
          <Card variant="default" padding="md" className="border-nexus-indigo/30 bg-nexus-indigo/5">
            <CardHeader className="p-0 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-nexus-indigo" />
                  <div>
                    <CardTitle className="text-base">{selectedZone.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {selectedZone.attendeesCount} attendees currently active in this zone
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="accent">{selectedZone.intensity.toUpperCase()} DENSITY</Badge>
              </div>
            </CardHeader>

            <CardContent className="p-0 pt-2 border-t border-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-foreground mb-1">Dominant Interests:</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedZone.topInterests.map((item) => (
                    <Badge key={item} variant="outline" className="bg-background text-xs">
                      #{item}
                    </Badge>
                  ))}
                </div>
              </div>
              <button
                onClick={() => toast.success(`Navigating to ${selectedZone.name}`)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-nexus-indigo text-white text-xs font-semibold hover:bg-nexus-indigo/90 transition-colors shadow-xs"
              >
                Go to Zone Attendees
              </button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
