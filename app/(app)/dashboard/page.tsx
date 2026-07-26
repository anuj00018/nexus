'use client';

// ===================================================================
// Nexus UI v2 — Dashboard Command Center
// Linear & Vercel inspired glassmorphism dashboard.
// Preserves: Zustand user session, CreateEventModal trigger, and routes.
// ===================================================================
import { useState } from 'react';
import Link from 'next/link';
import {
  KeyRound, Users, User, ArrowRight, ShieldCheck,
  Building2, Sparkles, CalendarPlus, Compass
} from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { useAuthStore } from '@/store/authStore';
import { CreateEventModal } from '@/components/events/CreateEventModal';
import { ROUTES } from '@/constants';

export default function DashboardPageV2() {
  const { user } = useAuthStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const firstName = user?.name?.split(' ')[0] ?? 'Professional';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="flex-1 overflow-y-auto pb-20 md:pb-8 bg-slate-950 text-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">

        {/* ── 1. User Header & Profile Overview Card ──────────────── */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="relative shrink-0">
              <Avatar src={user?.avatar_url} alt={user?.name || 'User'} size="lg" />
              <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-500 border-2 border-slate-900" />
            </div>

            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {greeting}, {firstName} 👋
                </h1>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 font-extrabold border border-sky-500/20 flex items-center gap-1 shrink-0">
                  <ShieldCheck className="h-3 w-3 text-sky-400" /> LinkedIn Verified
                </span>
              </div>

              {user?.company && (
                <p className="text-xs text-slate-400 font-semibold flex items-center gap-1.5 truncate">
                  <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  {user.company}
                </p>
              )}

              {user?.looking_for && user.looking_for.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {user.looking_for.map((goal: string) => (
                    <span key={goal} className="text-[10px] px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 font-extrabold border border-indigo-500/20">
                      {goal}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Link
            href="/onboarding"
            className="px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
          >
            <User className="h-3.5 w-3.5" />
            Edit Profile
          </Link>
        </div>

        {/* ── 2. Join Event Hero Radar Banner ─────────────────────── */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white p-7 sm:p-9 shadow-2xl border border-indigo-500/30 space-y-4">
          <div className="absolute top-[-50px] right-[-50px] w-[280px] h-[280px] rounded-full bg-indigo-500/20 blur-[100px] pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[11px] font-extrabold text-indigo-300 uppercase tracking-wide">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                Live Room Presence Radar
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                Got an Event Join Code?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Enter the 6-character event code from your organizer to discover live attendees, view LinkedIn profiles, and network in real time.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
              <Link
                href={ROUTES.JOIN_EVENT}
                className="h-12 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-indigo-600/30"
              >
                <KeyRound className="h-4 w-4" />
                Enter Join Code
                <ArrowRight className="h-4 w-4" />
              </Link>

              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="h-12 px-5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <CalendarPlus className="h-4 w-4 text-indigo-400" />
                Create Event Code
              </button>
            </div>
          </div>
        </div>

        {/* ── 3. Quick Action Cards ───────────────────────────────── */}
        <div className="space-y-4">
          <h3 className="text-xs font-extrabold tracking-widest uppercase text-indigo-400">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                href: ROUTES.JOIN_EVENT,
                icon: KeyRound,
                title: 'Join Event Room',
                desc: 'Enter 6-char code to discover live attendees',
                color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
              },
              {
                href: ROUTES.JOIN_EVENT,
                icon: Users,
                title: 'Discover Attendees',
                desc: 'Connect with LinkedIn verified professionals',
                color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
              },
              {
                href: '/onboarding',
                icon: User,
                title: 'Update Intent',
                desc: 'Update what you are looking for & interests',
                color: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
              },
            ].map((act) => {
              const Icon = act.icon;
              return (
                <Link key={act.title} href={act.href}>
                  <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800/50 hover:border-indigo-500/40 transition-all duration-300 shadow-lg space-y-3 group h-full backdrop-blur-md">
                    <div className={`p-3 rounded-2xl border w-fit ${act.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-extrabold text-white group-hover:text-indigo-400 transition-colors flex items-center justify-between">
                        {act.title}
                        <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{act.desc}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Modal */}
        <CreateEventModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      </div>
    </div>
  );
}
