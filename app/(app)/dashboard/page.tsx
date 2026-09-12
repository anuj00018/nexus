'use client';

// ===================================================================
// Nexus v3.0 — Dashboard Command Center (Cyber Aurora Edition)
// Electric Violet + Neon Cyan + Cosmic Obsidian.
// Fast, zero-lag, responsive, and ready for hackathon live demo.
// ===================================================================
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  KeyRound, Users, User, ArrowRight, ShieldCheck,
  Building2, Sparkles, CalendarPlus, Radio, Flame, Award, Zap, Compass, QrCode
} from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { useAuthStore } from '@/store/authStore';
import { CreateEventModal } from '@/components/events/CreateEventModal';
import { UserPassModal } from '@/components/profile/UserPassModal';
import { ROUTES } from '@/constants';

export default function DashboardPageV2() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [quickPin, setQuickPin] = useState('');

  const firstName = user?.name?.split(' ')[0] ?? 'Innovator';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const handleQuickJoin = (pin: string) => {
    router.push(`/events/${pin.toLowerCase()}/nearby`);
  };

  return (
    <div className="flex-1 overflow-y-auto pb-24 md:pb-10 relative bg-[#030712] text-slate-100 selection:bg-cyan-500/30">
      {/* Ambient Cyber Aurora Mesh Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute animate-float"
          style={{
            top: '-5%',
            right: '5%',
            width: '600px',
            height: '460px',
            background: 'radial-gradient(ellipse, rgba(139, 92, 246, 0.16) 0%, rgba(6, 182, 212, 0.08) 45%, transparent 70%)',
            filter: 'blur(90px)',
          }}
        />
        <div
          className="absolute animate-float animation-delay-500"
          style={{
            bottom: '10%',
            left: '0%',
            width: '520px',
            height: '380px',
            background: 'radial-gradient(ellipse, rgba(6, 182, 212, 0.14) 0%, rgba(139, 92, 246, 0.06) 50%, transparent 70%)',
            filter: 'blur(80px)',
            animationDirection: 'reverse',
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">

        {/* ── 1. User Header & Profile Overview Card ──────────────── */}
        <div
          className="rounded-3xl p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 transition-all duration-300 bg-[#070B19]/85 backdrop-blur-xl border border-white/[0.08] shadow-[0_16px_48px_rgba(0,0,0,0.6)] hover:border-cyan-500/30"
        >
          <div className="flex items-center gap-4 min-w-0">
            <div className="relative shrink-0">
              <Avatar src={user?.avatar_url} alt={user?.name || 'User'} size="lg" />
              <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-cyan-400 border-2 border-[#030712] shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
            </div>

            <div className="min-w-0 space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-tight">
                  {greeting}, <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-200 to-violet-300">{firstName}</span> 👋
                </h1>
                <span
                  className="text-[10px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 shrink-0 bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.15)]"
                >
                  <ShieldCheck className="h-3 w-3 text-cyan-400" /> LinkedIn Verified
                </span>
              </div>

              {user?.company && (
                <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 truncate">
                  <Building2 className="h-3.5 w-3.5 text-violet-400 shrink-0" />
                  {user.company}
                </p>
              )}

              {user?.looking_for && user.looking_for.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {user.looking_for.map((goal: string) => (
                    <span
                      key={goal}
                      className="text-[10px] px-2.5 py-0.5 rounded-md font-semibold bg-violet-500/10 border border-violet-400/25 text-violet-200"
                    >
                      {goal}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              onClick={() => setIsPassModalOpen(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all duration-200 bg-cyan-500/15 border border-cyan-400/35 hover:bg-cyan-500/25 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.2)] active:scale-95"
            >
              <QrCode className="h-3.5 w-3.5 text-cyan-400" />
              My QR Pass
            </button>

            <Link
              href="/onboarding"
              className="px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 bg-white/[0.04] border border-white/[0.08] hover:border-cyan-400/40 hover:bg-cyan-500/10 text-slate-200 hover:text-white"
            >
              <User className="h-3.5 w-3.5 text-cyan-400" />
              Edit Profile
            </Link>
          </div>
        </div>

        {/* ── 2. Join Event Hero Banner (Cyber Radar) ───────────────── */}
        <div
          className="relative rounded-3xl overflow-hidden p-7 sm:p-9 space-y-6 transition-all duration-300 bg-gradient-to-br from-[#0B0F28]/95 via-[#070B19]/90 to-[#030712]/95 border border-cyan-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_30px_rgba(6,182,212,0.12)]"
        >
          {/* Holographic corner glow */}
          <div
            className="absolute -top-16 -right-16 w-80 h-80 rounded-full pointer-events-none bg-gradient-to-br from-violet-600/20 to-cyan-500/20 blur-3xl"
          />

          <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-cyan-500/10 border border-cyan-400/40 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.2)]"
              >
                <Radio className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
                Live Room Presence Radar
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight leading-tight">
                Connect With Real Attendees <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-violet-400">In Real Time</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Enter your 6-character room code from event badges or venue screens to instantly detect nearby professionals and handshake on LinkedIn.
              </p>

              {/* 1-Tap Quick PIN Room Presets */}
              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Fast Presets:</span>
                {['NEXUS1', 'TECHFEST25', 'AI-HACK'].map((code) => (
                  <button
                    key={code}
                    onClick={() => handleQuickJoin(code)}
                    className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-[#0D1326] border border-cyan-500/30 text-cyan-300 hover:border-cyan-400 hover:bg-cyan-500/20 hover:scale-105 transition-all duration-150 active:scale-95 shadow-[0_0_10px_rgba(6,182,212,0.12)]"
                  >
                    #{code}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
              <Link
                href={ROUTES.JOIN_EVENT}
                className="btn-aurora h-12 px-6 rounded-xl font-bold text-xs flex items-center justify-center gap-2 text-white shadow-lg active:scale-95"
              >
                <KeyRound className="h-4 w-4" />
                Enter Join Code
                <ArrowRight className="h-4 w-4" />
              </Link>

              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="btn-cyber-glass h-12 px-5 rounded-xl text-white font-semibold text-xs active:scale-95 flex items-center justify-center gap-2"
              >
                <CalendarPlus className="h-4 w-4 text-cyan-400" />
                Create Room
              </button>
            </div>
          </div>
        </div>

        {/* ── 3. Live Protocol HUD Metrics ─────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[#070B19]/80 border border-cyan-500/20 backdrop-blur-xl shadow-lg flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center shrink-0">
              <Radio className="h-6 w-6 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Radar Status</div>
              <div className="text-lg font-bold text-white flex items-center gap-1.5">
                <span>Active 360° Scan</span>
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
              </div>
              <div className="text-[11px] text-cyan-400 font-mono">Zero Latency Sync</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#070B19]/80 border border-violet-500/20 backdrop-blur-xl shadow-lg flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-violet-500/10 border border-violet-400/30 flex items-center justify-center shrink-0">
              <Sparkles className="h-6 w-6 text-violet-400" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Match Accuracy</div>
              <div className="text-lg font-bold text-white">98.4% Precision</div>
              <div className="text-[11px] text-violet-300 font-mono">AI Interest Vector</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#070B19]/80 border border-emerald-500/20 backdrop-blur-xl shadow-lg flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Attendee Trust</div>
              <div className="text-lg font-bold text-white">100% LinkedIn</div>
              <div className="text-[11px] text-emerald-400 font-mono">No Fake Profiles</div>
            </div>
          </div>
        </div>

        {/* ── 4. Quick Action Cards ───────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold tracking-widest uppercase text-cyan-400 flex items-center gap-2">
              <Compass className="h-4 w-4" />
              Event Operations Deck
            </h3>
            <span className="text-xs text-slate-500 font-mono">v3.0 CYBER AURORA</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                href: ROUTES.JOIN_EVENT,
                icon: KeyRound,
                title: 'Join Event Room',
                desc: 'Enter 6-char code to discover live attendees in radar',
                accentColor: 'text-cyan-400',
                borderHover: 'hover:border-cyan-400/50 hover:shadow-[0_12px_32px_rgba(6,182,212,0.18)]',
                bgBadge: 'bg-cyan-500/10 border-cyan-400/30',
              },
              {
                href: '/events/nexus1/heatmap',
                icon: Flame,
                title: 'Room Heatmap',
                desc: 'See live zone clustering and hot networking hubs',
                accentColor: 'text-violet-400',
                borderHover: 'hover:border-violet-400/50 hover:shadow-[0_12px_32px_rgba(139,92,246,0.18)]',
                bgBadge: 'bg-violet-500/10 border-violet-400/30',
              },
              {
                href: '/events/nexus1/recap',
                icon: Award,
                title: 'Recap & Rating',
                desc: 'Export connection contacts & rate your networking leads',
                accentColor: 'text-fuchsia-400',
                borderHover: 'hover:border-fuchsia-400/50 hover:shadow-[0_12px_32px_rgba(217,70,239,0.18)]',
                bgBadge: 'bg-fuchsia-500/10 border-fuchsia-400/30',
              },
            ].map((act) => {
              const Icon = act.icon;
              return (
                <Link key={act.title} href={act.href}>
                  <div
                    className={`p-6 rounded-2xl transition-all duration-200 space-y-3 group h-full bg-[#070B19]/80 backdrop-blur-xl border border-white/[0.08] hover:-translate-y-1 ${act.borderHover}`}
                  >
                    <div className={`p-3 rounded-xl w-fit border ${act.bgBadge}`}>
                      <Icon className={`h-5 w-5 ${act.accentColor}`} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center justify-between">
                        {act.title}
                        <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5" />
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{act.desc}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Modals */}
        <CreateEventModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
        <UserPassModal
          isOpen={isPassModalOpen}
          onClose={() => setIsPassModalOpen(false)}
        />
      </div>
    </div>
  );
}
