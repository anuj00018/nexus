'use client';

// ===================================================================
// Nexus v3.0 — Event Heatmap Page
// Displays visual room density, attendee clustering, & hot zones
// Deep navy glassmorphism styling with intensity-based glow.
// Preserves: All zone state, filter logic, and navigation.
// ===================================================================
import { useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Flame, Users, RefreshCw, Sparkles, Navigation
} from 'lucide-react';
import { EventHeaderNav } from '@/components/events/EventHeaderNav';
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
    color: 'from-blue-600/20 to-cyan-500/10 border-blue-500/30',
  },
  {
    id: 'z2',
    name: 'Founders & VC Lounge',
    category: 'Business',
    attendeesCount: 8,
    intensity: 'high',
    topInterests: ['Startups', 'Venture Capital', 'Co-founders'],
    gridPos: 'col-span-1 row-span-2',
    color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30',
  },
  {
    id: 'z3',
    name: 'Frontend & UI/UX Corner',
    category: 'Design & Web',
    attendeesCount: 6,
    intensity: 'medium',
    topInterests: ['React', 'Figma', 'UI/UX'],
    gridPos: 'col-span-1 row-span-1',
    color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30',
  },
  {
    id: 'z4',
    name: 'Hiring & Career Arena',
    category: 'Jobs',
    attendeesCount: 9,
    intensity: 'high',
    topInterests: ['Hiring', 'Internships', 'Backend'],
    gridPos: 'col-span-2 row-span-1',
    color: 'from-purple-500/20 to-indigo-500/10 border-purple-500/30',
  },
  {
    id: 'z5',
    name: 'Web3 & Open Source Zone',
    category: 'Tech & Crypto',
    attendeesCount: 4,
    intensity: 'low',
    topInterests: ['Blockchain', 'Rust', 'Open Source'],
    gridPos: 'col-span-1 row-span-1',
    color: 'from-pink-500/20 to-rose-500/10 border-pink-500/30',
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
    <div className="flex-1 overflow-y-auto pb-20 md:pb-6" style={{ background: 'hsl(222, 47%, 5%)' }}>
      <EventHeaderNav eventId={eventId} eventTitle="TechFest 2025" activeCount={39} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fade-in">
        {/* Banner Card */}
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl"
          style={{
            background: 'rgba(255, 255, 255, 0.025)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          }}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Flame className="h-5 w-5 text-orange-400" />
              <h2 className="text-lg font-display font-bold text-white">Room Density Heatmap</h2>
            </div>
            <p className="text-xs text-slate-400">
              See where attendees with matching interests are clustering in real-time.
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white transition-all shrink-0 hover:bg-white/[0.06]"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <RefreshCw className={cn('h-3.5 w-3.5', isRefreshing && 'animate-spin')} style={{ color: '#4263EB' }} />
            Refresh Signals
          </button>
        </div>

        {/* Visual Room Grid / Heatmap Layout */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-widest flex items-center gap-2" style={{ color: '#4263EB' }}>
              <Navigation className="h-4 w-4" />
              Interactive Floor Layout
            </h3>
            <span className="text-2xs text-slate-500">Tap a zone for cluster details</span>
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
                    'relative rounded-2xl p-5 border transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden bg-gradient-to-br backdrop-blur-xl',
                    zone.color,
                    zone.gridPos,
                    isSelected ? 'scale-[1.01]' : 'opacity-85 hover:opacity-100'
                  )}
                  style={isSelected ? {
                    borderColor: 'rgba(66, 99, 235, 0.5)',
                    boxShadow: '0 0 30px rgba(66, 99, 235, 0.2), 0 8px 32px rgba(0, 0, 0, 0.3)',
                  } : {}}
                >
                  {/* Heat indicator glow */}
                  <div
                    className={cn(
                      'absolute -right-4 -top-4 w-20 h-20 rounded-full blur-2xl pointer-events-none',
                      zone.intensity === 'high' ? 'bg-orange-500/30' : zone.intensity === 'medium' ? 'bg-amber-500/20' : 'bg-blue-500/15'
                    )}
                  />

                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-2 relative z-10">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      {zone.category}
                    </span>
                    <span
                      className="text-[10px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1"
                      style={{
                        background: 'rgba(66, 99, 235, 0.1)',
                        border: '1px solid rgba(66, 99, 235, 0.2)',
                        color: '#7B93F5',
                      }}
                    >
                      <Users className="h-3 w-3" />
                      {zone.attendeesCount} nearby
                    </span>
                  </div>

                  {/* Zone Name */}
                  <div className="my-3 relative z-10">
                    <h4 className="font-bold text-sm text-white leading-snug">{zone.name}</h4>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {zone.topInterests.map((interest) => (
                        <span
                          key={interest}
                          className="text-[10px] px-2 py-0.5 rounded-md font-medium text-slate-300"
                          style={{
                            background: 'rgba(0, 0, 0, 0.3)',
                            border: '1px solid rgba(255, 255, 255, 0.06)',
                          }}
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer status */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 relative z-10 pt-2" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <span className="flex items-center gap-1.5 font-medium">
                      <span
                        className={cn(
                          'h-2 w-2 rounded-full',
                          zone.intensity === 'high' ? 'bg-orange-400 animate-ping' : 'bg-emerald-400'
                        )}
                      />
                      {zone.intensity === 'high' ? 'High Clustering' : 'Normal Activity'}
                    </span>
                    <span className="font-semibold text-xs" style={{ color: '#4263EB' }}>Explore Zone →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Zone Details Drawer/Card */}
        {selectedZone && (
          <div
            className="rounded-2xl p-6 space-y-4"
            style={{
              background: 'rgba(66, 99, 235, 0.04)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(66, 99, 235, 0.15)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Sparkles className="h-5 w-5 text-indigo-400" style={{ color: '#4263EB' }} />
                <div>
                  <h4 className="text-base font-bold text-white">{selectedZone.name}</h4>
                  <p className="text-xs text-slate-400">
                    {selectedZone.attendeesCount} attendees currently active in this zone
                  </p>
                </div>
              </div>
              <span
                className="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider"
                style={{
                  background: 'rgba(66, 99, 235, 0.1)',
                  border: '1px solid rgba(66, 99, 235, 0.2)',
                  color: '#7B93F5',
                }}
              >
                {selectedZone.intensity.toUpperCase()} DENSITY
              </span>
            </div>

            <div className="pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div>
                <p className="text-xs font-semibold text-slate-300 mb-1.5">Dominant Interests:</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedZone.topInterests.map((item) => (
                    <span
                      key={item}
                      className="text-xs px-2.5 py-1 rounded-lg font-medium text-slate-300"
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                      }}
                    >
                      #{item}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => toast.success(`Navigating to ${selectedZone.name}`)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-white text-xs font-bold transition-all active:scale-95 shadow-md"
                style={{
                  background: 'linear-gradient(135deg, #4263EB 0%, #3451D1 100%)',
                  boxShadow: '0 4px 16px rgba(66, 99, 235, 0.25)',
                }}
              >
                Go to Zone Attendees
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
