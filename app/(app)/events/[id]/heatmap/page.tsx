'use client';

// ===================================================================
// Nexus v3.0 — Event Heatmap Page (Cyber Aurora Edition)
// Displays visual room density, attendee clustering, & hot zones
// High contrast, fast rendering, responsive, and lag-free.
// ===================================================================
import { useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Flame, Users, RefreshCw, Sparkles, Navigation, Radio, MapPin
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
  glowClass: string;
  accentColor: string;
  borderColor: string;
}

const ROOM_ZONES: Zone[] = [
  {
    id: 'z1',
    name: 'AI & Machine Learning Hub',
    category: 'Technology',
    attendeesCount: 18,
    intensity: 'high',
    topInterests: ['AI / ML', 'LLMs', 'Python', 'PyTorch'],
    gridPos: 'md:col-span-2 md:row-span-2',
    glowClass: 'bg-violet-600/25',
    accentColor: 'text-violet-400',
    borderColor: 'border-violet-500/40',
  },
  {
    id: 'z2',
    name: 'Founders & VC Lounge',
    category: 'Venture & Capital',
    attendeesCount: 12,
    intensity: 'high',
    topInterests: ['Startups', 'Venture Capital', 'Co-founders', 'Pitching'],
    gridPos: 'md:col-span-1 md:row-span-2',
    glowClass: 'bg-amber-500/25',
    accentColor: 'text-amber-400',
    borderColor: 'border-amber-500/40',
  },
  {
    id: 'z3',
    name: 'Frontend & UI/UX Corner',
    category: 'Design & Web',
    attendeesCount: 9,
    intensity: 'medium',
    topInterests: ['React', 'Next.js', 'Figma', 'Design Systems'],
    gridPos: 'md:col-span-1 md:row-span-1',
    glowClass: 'bg-cyan-500/25',
    accentColor: 'text-cyan-400',
    borderColor: 'border-cyan-500/40',
  },
  {
    id: 'z4',
    name: 'Hiring & Career Arena',
    category: 'Talent & Jobs',
    attendeesCount: 14,
    intensity: 'high',
    topInterests: ['Hiring', 'Full-stack', 'Internships', 'Backend'],
    gridPos: 'md:col-span-2 md:row-span-1',
    glowClass: 'bg-blue-600/25',
    accentColor: 'text-blue-400',
    borderColor: 'border-blue-500/40',
  },
  {
    id: 'z5',
    name: 'Web3 & Open Source Zone',
    category: 'Decentralized Tech',
    attendeesCount: 7,
    intensity: 'medium',
    topInterests: ['Blockchain', 'Rust', 'Open Source', 'Solana'],
    gridPos: 'md:col-span-1 md:row-span-1',
    glowClass: 'bg-emerald-500/25',
    accentColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/40',
  },
];

export default function HeatmapPage() {
  const params = useParams();
  const eventId = (params?.id as string) || 'nexus1';
  const [selectedZone, setSelectedZone] = useState<Zone | null>(ROOM_ZONES[0]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('Heatmap refreshed with live radar signals ⚡');
    }, 500);
  };

  return (
    <div className="flex-1 overflow-y-auto pb-24 md:pb-8 bg-[#030712] text-slate-100 selection:bg-cyan-500/30">
      <EventHeaderNav eventId={eventId} eventTitle="TechFest 2025" activeCount={60} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fade-in">
        {/* Banner Card */}
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#070B19]/80 border border-cyan-500/30 shadow-[0_16px_40px_rgba(0,0,0,0.6),0_0_24px_rgba(6,182,212,0.12)] backdrop-blur-xl"
        >
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Flame className="h-5 w-5 text-cyan-400" />
              <h2 className="text-xl font-display font-extrabold text-white">Room Density Heatmap</h2>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300">
                LIVE TELEMETRY
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Detect active networking hubs and attendee clusters with real-time room radar.
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all shrink-0 bg-white/[0.05] border border-white/[0.1] hover:bg-cyan-500/15 hover:border-cyan-400/40 active:scale-95 shadow-md"
          >
            <RefreshCw className={cn('h-3.5 w-3.5 text-cyan-400', isRefreshing && 'animate-spin')} />
            Refresh Radar
          </button>
        </div>

        {/* Visual Room Grid / Heatmap Layout */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-cyan-400">
              <Navigation className="h-4 w-4" />
              Interactive Venue Cluster Grid
            </h3>
            <span className="text-[11px] text-slate-400">Tap a zone for deep telemetry</span>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[340px]">
            {ROOM_ZONES.map((zone) => {
              const isSelected = selectedZone?.id === zone.id;
              return (
                <div
                  key={zone.id}
                  onClick={() => setSelectedZone(zone)}
                  className={cn(
                    'relative rounded-3xl p-6 border transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden backdrop-blur-xl',
                    zone.gridPos,
                    isSelected
                      ? 'scale-[1.01] bg-[#0B0F28]/95 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.25),0_12px_36px_rgba(0,0,0,0.5)]'
                      : 'bg-[#070B19]/75 border-white/[0.08] hover:border-white/[0.2] hover:bg-[#070B19]/90'
                  )}
                >
                  {/* Heat indicator glow */}
                  <div
                    className={cn(
                      'absolute -right-6 -top-6 w-32 h-32 rounded-full blur-3xl pointer-events-none opacity-60',
                      zone.glowClass
                    )}
                  />

                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-2 relative z-10">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {zone.category}
                    </span>
                    <span
                      className="text-[10px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 shadow-sm"
                    >
                      <Users className="h-3 w-3 text-cyan-400" />
                      {zone.attendeesCount} in zone
                    </span>
                  </div>

                  {/* Zone Name */}
                  <div className="my-4 relative z-10">
                    <h4 className="font-display font-bold text-base text-white leading-snug">{zone.name}</h4>
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {zone.topInterests.map((interest) => (
                        <span
                          key={interest}
                          className="text-[10px] px-2.5 py-0.5 rounded-md font-semibold bg-white/[0.05] border border-white/[0.08] text-slate-300"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer status */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 relative z-10 pt-3 border-t border-white/[0.06]">
                    <span className="flex items-center gap-2 font-semibold">
                      <span
                        className={cn(
                          'h-2 w-2 rounded-full',
                          zone.intensity === 'high' ? 'bg-cyan-400 animate-ping' : 'bg-slate-400'
                        )}
                      />
                      {zone.intensity === 'high' ? 'High Cluster Density' : 'Moderate Activity'}
                    </span>
                    <span className="font-bold text-xs text-cyan-300 hover:text-white transition-colors">
                      Inspect Zone →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Zone Details Drawer/Card */}
        {selectedZone && (
          <div
            className="rounded-3xl p-6 sm:p-7 space-y-5 bg-[#070B19]/90 border border-cyan-500/35 shadow-[0_16px_48px_rgba(0,0,0,0.6),0_0_24px_rgba(6,182,212,0.15)] backdrop-blur-xl animate-fade-in"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center shrink-0">
                  <Sparkles className="h-5 w-5 text-cyan-400" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-display font-extrabold text-white">{selectedZone.name}</h4>
                  <p className="text-xs text-slate-400">
                    <span className="text-cyan-300 font-bold">{selectedZone.attendeesCount} attendees</span> actively clustered within 15 meters
                  </p>
                </div>
              </div>
              <span
                className="text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider bg-gradient-to-r from-violet-600/30 to-cyan-500/30 border border-cyan-400/40 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.2)]"
              >
                {selectedZone.intensity.toUpperCase()} CLUSTER SIGNAL
              </span>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-white/[0.08]">
              <div>
                <p className="text-xs font-semibold text-slate-400 mb-2">Dominant Skill Clusters & Focus:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedZone.topInterests.map((item) => (
                    <span
                      key={item}
                      className="text-xs px-3 py-1 rounded-lg font-semibold bg-cyan-500/10 border border-cyan-400/25 text-cyan-200"
                    >
                      #{item}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => toast.success(`Radar locked onto ${selectedZone.name}`)}
                className="btn-aurora w-full sm:w-auto px-6 py-2.5 rounded-xl text-white text-xs font-bold transition-all active:scale-95 shadow-lg"
              >
                Scan Zone Attendees
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
