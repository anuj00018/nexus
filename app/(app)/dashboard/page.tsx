'use client';

// ===================================================================
// Nexus v3.0 — Dashboard Command Center
// Premium glassmorphism with ambient glow orbs.
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
    <div className="flex-1 overflow-y-auto pb-20 md:pb-8 relative" style={{ background: 'hsl(222, 47%, 5%)' }}>
      {/* Ambient glow orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute animate-float"
          style={{
            top: '-5%',
            right: '10%',
            width: '500px',
            height: '400px',
            background: 'radial-gradient(ellipse, rgba(66, 99, 235, 0.06) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute animate-float animation-delay-500"
          style={{
            bottom: '10%',
            left: '5%',
            width: '400px',
            height: '300px',
            background: 'radial-gradient(ellipse, rgba(139, 92, 246, 0.04) 0%, transparent 70%)',
            filter: 'blur(60px)',
            animationDirection: 'reverse',
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">

        {/* ── 1. User Header & Profile Overview Card ──────────────── */}
        <div
          className="rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{
            background: 'rgba(255, 255, 255, 0.025)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          }}
        >
          <div className="flex items-center gap-4 min-w-0">
            <div className="relative shrink-0">
              <Avatar src={user?.avatar_url} alt={user?.name || 'User'} size="lg" />
              <span
                className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-500"
                style={{ border: '2px solid hsl(222, 47%, 5%)' }}
              />
            </div>

            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
                  {greeting}, {firstName} 👋
                </h1>
                <span
                  className="text-[10px] px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1 shrink-0"
                  style={{
                    background: 'rgba(56, 189, 248, 0.08)',
                    border: '1px solid rgba(56, 189, 248, 0.15)',
                    color: '#38bdf8',
                  }}
                >
                  <ShieldCheck className="h-3 w-3" /> LinkedIn Verified
                </span>
              </div>

              {user?.company && (
                <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 truncate">
                  <Building2 className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                  {user.company}
                </p>
              )}

              {user?.looking_for && user.looking_for.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {user.looking_for.map((goal: string) => (
                    <span
                      key={goal}
                      className="text-[10px] px-2.5 py-0.5 rounded-md font-semibold"
                      style={{
                        background: 'rgba(66, 99, 235, 0.08)',
                        border: '1px solid rgba(66, 99, 235, 0.15)',
                        color: '#7B93F5',
                      }}
                    >
                      {goal}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Link
            href="/onboarding"
            className="px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 shrink-0 hover:bg-white/[0.06]"
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#e2e8f0',
            }}
          >
            <User className="h-3.5 w-3.5" />
            Edit Profile
          </Link>
        </div>

        {/* ── 2. Join Event Hero Banner ─────────────────────── */}
        <div
          className="relative rounded-2xl overflow-hidden text-white p-7 sm:p-9 space-y-4"
          style={{
            background: 'linear-gradient(135deg, rgba(66, 99, 235, 0.12) 0%, rgba(139, 92, 246, 0.06) 50%, rgba(10, 15, 30, 0.9) 100%)',
            border: '1px solid rgba(66, 99, 235, 0.15)',
            boxShadow: '0 16px 48px rgba(0, 0, 0, 0.3)',
          }}
        >
          {/* Decorative glow */}
          <div
            className="absolute top-[-50px] right-[-50px] w-[280px] h-[280px] rounded-full pointer-events-none"
            style={{ background: 'rgba(66, 99, 235, 0.1)', filter: 'blur(80px)' }}
          />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide"
                style={{
                  background: 'rgba(66, 99, 235, 0.08)',
                  border: '1px solid rgba(66, 99, 235, 0.15)',
                  color: '#7B93F5',
                }}
              >
                <Sparkles className="h-3.5 w-3.5" style={{ color: '#4263EB' }} />
                Live Room Presence Radar
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight leading-tight">
                Got an Event Join Code?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Enter the 6-character event code from your organizer to discover live attendees, view LinkedIn profiles, and network in real time.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
              <Link
                href={ROUTES.JOIN_EVENT}
                className="h-12 px-6 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #4263EB 0%, #3451D1 100%)',
                  boxShadow: '0 8px 24px rgba(66, 99, 235, 0.3)',
                }}
              >
                <KeyRound className="h-4 w-4" />
                Enter Join Code
                <ArrowRight className="h-4 w-4" />
              </Link>

              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="h-12 px-5 rounded-xl text-white font-semibold text-xs transition-all active:scale-95 flex items-center justify-center gap-2"
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <CalendarPlus className="h-4 w-4" style={{ color: '#4263EB' }} />
                Create Event Code
              </button>
            </div>
          </div>
        </div>

        {/* ── 3. Quick Action Cards ───────────────────────────────── */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#4263EB' }}>
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                href: ROUTES.JOIN_EVENT,
                icon: KeyRound,
                title: 'Join Event Room',
                desc: 'Enter 6-char code to discover live attendees',
                glowColor: 'rgba(66, 99, 235, 0.06)',
                borderColor: 'rgba(66, 99, 235, 0.12)',
                iconColor: '#4263EB',
              },
              {
                href: ROUTES.JOIN_EVENT,
                icon: Users,
                title: 'Discover Attendees',
                desc: 'Connect with LinkedIn verified professionals',
                glowColor: 'rgba(16, 185, 129, 0.06)',
                borderColor: 'rgba(16, 185, 129, 0.12)',
                iconColor: '#10B981',
              },
              {
                href: '/onboarding',
                icon: User,
                title: 'Update Intent',
                desc: 'Update what you are looking for & interests',
                glowColor: 'rgba(139, 92, 246, 0.06)',
                borderColor: 'rgba(139, 92, 246, 0.12)',
                iconColor: '#8B5CF6',
              },
            ].map((act) => {
              const Icon = act.icon;
              return (
                <Link key={act.title} href={act.href}>
                  <div
                    className="p-6 rounded-2xl transition-all duration-300 space-y-3 group h-full hover:-translate-y-0.5"
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = act.borderColor;
                      (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px ${act.glowColor}`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.05)';
                      (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                    }}
                  >
                    <div
                      className="p-3 rounded-xl w-fit"
                      style={{ background: act.glowColor, border: `1px solid ${act.borderColor}` }}
                    >
                      <Icon className="h-5 w-5" style={{ color: act.iconColor }} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors flex items-center justify-between">
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
