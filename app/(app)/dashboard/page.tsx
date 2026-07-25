'use client';

// ===================================================================
// Dashboard Page — Linear / Stripe / Notion Inspired Redesign
// Features: Welcome Header, Profile Summary Card, Join Event Hero Banner,
// Recent Event Rooms, Quick Actions Grid, and Zero Empty White Spaces.
// ===================================================================
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CalendarPlus, Users, Zap, ArrowRight, ShieldCheck,
  Building2, Sparkles, User, KeyRound, Compass
} from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { useAuthStore } from '@/store/authStore';
import { CreateEventModal } from '@/components/events/CreateEventModal';
import { ROUTES } from '@/constants';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createdCodes, setCreatedCodes] = useState<any[]>([]);

  const firstName = user?.name?.split(' ')[0] ?? 'Professional';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('nexus_created_codes') || '{}');
      const list = Object.entries(stored).map(([code, meta]: [string, any]) => ({
        code,
        title: meta.title || `Event [${code}]`,
        createdAt: meta.createdAt,
      }));
      setCreatedCodes(list.slice(0, 3));
    } catch {}
  }, []);

  return (
    <div className="flex-1 overflow-y-auto pb-20 md:pb-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* ── 1. Welcome & User Profile Summary Card ──────────────── */}
        <div className="rounded-3xl border border-border/80 bg-background/90 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-md">
          <div className="flex items-center gap-4 min-w-0">
            <div className="relative shrink-0">
              <Avatar src={user?.avatar_url} alt={user?.name || 'User'} size="lg" />
              <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-emerald-500 border-2 border-background" />
            </div>

            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                  {greeting}, {firstName} 👋
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-500/10 text-[#0A66C2] font-extrabold border border-[#0A66C2]/20 flex items-center gap-1 shrink-0">
                  <ShieldCheck className="h-3 w-3 text-[#0A66C2]" /> LinkedIn Verified
                </span>
              </div>

              {user?.company && (
                <p className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5 truncate">
                  <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  {user.company}
                </p>
              )}

              {user?.looking_for && user.looking_for.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {user.looking_for.map((goal: string) => (
                    <span key={goal} className="text-[10px] px-2 py-0.5 rounded-md bg-nexus-indigo/10 text-nexus-indigo font-extrabold border border-nexus-indigo/20">
                      {goal}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Link
            href="/onboarding"
            className="px-3.5 py-2 rounded-xl bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground border border-border text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
          >
            <User className="h-3.5 w-3.5" />
            Edit Profile
          </Link>
        </div>

        {/* ── 2. Join Event Hero Banner Card ─────────────────────── */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-nexus-black via-slate-900 to-black text-white p-6 sm:p-8 shadow-2xl border border-nexus-indigo/30 space-y-4">
          <div className="absolute top-[-40px] right-[-40px] w-[240px] h-[240px] rounded-full bg-nexus-indigo/25 blur-3xl pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-2xs font-extrabold text-nexus-indigo tracking-wide uppercase">
                <Sparkles className="h-3.5 w-3.5 text-nexus-indigo" />
                Live Room Presence Radar
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                Got an Event Join Code?
              </h2>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                Enter the 6-character event code from your organizer to discover live attendees, view LinkedIn profiles, and network in real time.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
              <Link
                href={ROUTES.JOIN_EVENT}
                className="h-12 px-6 rounded-2xl bg-nexus-indigo hover:bg-nexus-indigo/90 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-nexus-indigo/30"
              >
                <KeyRound className="h-4 w-4" />
                Enter Join Code
                <ArrowRight className="h-4 w-4" />
              </Link>

              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="h-12 px-5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <CalendarPlus className="h-4 w-4 text-nexus-indigo" />
                Create Event Code
              </button>
            </div>
          </div>
        </div>

        {/* ── 3. Quick Actions Grid ─────────────────────────────── */}
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold tracking-wider uppercase text-nexus-indigo">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {[
              {
                href: ROUTES.JOIN_EVENT,
                icon: KeyRound,
                title: 'Join Event Room',
                desc: 'Enter 6-char code to discover live attendees',
                color: 'bg-nexus-indigo/10 text-nexus-indigo border-nexus-indigo/20',
              },
              {
                href: ROUTES.JOIN_EVENT,
                icon: Users,
                title: 'Discover Attendees',
                desc: 'Connect with LinkedIn verified professionals',
                color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
              },
              {
                href: '/onboarding',
                icon: User,
                title: 'Update Intent',
                desc: 'Update what you are looking for & interests',
                color: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
              },
            ].map((act) => {
              const Icon = act.icon;
              return (
                <Link key={act.title} href={act.href}>
                  <div className="p-5 rounded-2xl border border-border/80 bg-background/90 hover:bg-muted/20 hover:border-nexus-indigo/40 transition-all duration-200 shadow-2xs space-y-3 group h-full">
                    <div className={`p-3 rounded-xl border w-fit ${act.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-extrabold text-foreground group-hover:text-nexus-indigo transition-colors flex items-center justify-between">
                        {act.title}
                        <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{act.desc}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── 4. Recent Event Rooms / Created Codes ──────────────── */}
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold tracking-wider uppercase text-nexus-indigo">
            Active & Created Events
          </h3>

          {createdCodes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {createdCodes.map((item) => (
                <Link key={item.code} href={`/events/${item.code.toLowerCase()}/nearby`}>
                  <div className="p-4 rounded-2xl border border-border/80 bg-background/90 hover:border-nexus-indigo/40 transition-all shadow-2xs flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-extrabold text-nexus-indigo uppercase px-2 py-0.5 rounded bg-nexus-indigo/10 border border-nexus-indigo/20">
                        {item.code}
                      </span>
                      <h4 className="text-xs font-bold text-foreground mt-1">{item.title}</h4>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-2xl border border-border/60 bg-muted/20 text-center space-y-2">
              <Compass className="h-6 w-6 text-muted-foreground mx-auto" />
              <p className="text-xs font-semibold text-foreground">No custom event codes created yet</p>
              <p className="text-2xs text-muted-foreground">Click "Create Event Code" to generate your first event code.</p>
            </div>
          )}
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
