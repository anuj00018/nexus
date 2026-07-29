'use client';

// ===================================================================
// Nexus v3.0 — Profile Screen
// Premium glass card identity interface.
// Preserves: Zustand user state, Avatar, and routes.
// ===================================================================
import { useAuthStore } from '@/store/authStore';
import { Avatar } from '@/components/ui/Avatar';
import {
  Mail, Edit3, Building2, ShieldCheck,
  Calendar, Users, Eye, Zap, Crown
} from 'lucide-react';
import Link from 'next/link';

export default function ProfilePageV2() {
  const { user: storeUser } = useAuthStore();

  const user = storeUser || {
    id: 'user-founder-anuj',
    email: 'anuj.vardham@nexus.app',
    name: 'Anuj Vardham',
    avatar_url: null,
    company: 'Nexus Network',
    linkedin_url: 'https://www.linkedin.com/in/anuj-vardham-b399253a1',
    interests: ['AI / ML', 'SaaS & Startups', 'Product Strategy'],
    looking_for: ['Co-founder', 'Hiring', 'Networking'],
    bio: 'Building Nexus — real-time event networking platform for tech professionals.',
    role: 'founder' as const,
    is_verified: true,
  };

  const isFounder = user.role === 'founder' || user.name === 'Anuj Vardham';

  return (
    <div className="flex-1 overflow-y-auto pb-20 md:pb-8" style={{ background: 'hsl(222, 47%, 5%)' }}>
      <div className="max-w-lg mx-auto px-4 py-8 space-y-6 animate-fade-in">

        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-white tracking-tight">My Profile</h1>
            <p className="text-xs text-slate-400">Manage your event networking identity</p>
          </div>

          <Link
            href="/onboarding"
            className="px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition-all"
            style={{
              background: 'rgba(66, 99, 235, 0.08)',
              border: '1px solid rgba(66, 99, 235, 0.15)',
              color: '#7B93F5',
            }}
          >
            <Edit3 className="h-3.5 w-3.5" /> Edit Profile
          </Link>
        </div>

        {/* ── Main Profile Card Container ───────────────────────────── */}
        <div
          className="rounded-2xl p-6 space-y-6"
          style={{
            background: 'rgba(255, 255, 255, 0.025)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          }}
        >
          {/* Avatar & Identifiers */}
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <Avatar src={user.avatar_url} alt={user.name} size="xl" />
              <span
                className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-500"
                style={{ border: '2px solid hsl(222, 47%, 5%)' }}
              />
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="text-lg font-bold text-white tracking-tight truncate">{user.name}</h2>

                {/* Founder Badge */}
                {isFounder && (
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-md font-semibold flex items-center gap-1 shrink-0"
                    style={{
                      background: 'rgba(245, 158, 11, 0.1)',
                      border: '1px solid rgba(245, 158, 11, 0.2)',
                      color: '#FBBF24',
                    }}
                  >
                    <Crown className="h-3 w-3" /> Founder
                  </span>
                )}

                {/* Verified Badge */}
                <span
                  className="text-[10px] px-2 py-0.5 rounded-md font-semibold flex items-center gap-1 shrink-0"
                  style={{
                    background: 'rgba(56, 189, 248, 0.08)',
                    border: '1px solid rgba(56, 189, 248, 0.15)',
                    color: '#38bdf8',
                  }}
                >
                  <ShieldCheck className="h-3 w-3" /> Verified
                </span>
              </div>

              {user.company && (
                <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 truncate">
                  <Building2 className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                  {user.company}
                </p>
              )}

              <p className="text-[11px] text-slate-500 flex items-center gap-1.5 truncate">
                <Mail className="h-3 w-3 text-slate-500 shrink-0" />
                {user.email}
              </p>
            </div>
          </div>

          {/* Bio Container */}
          {user.bio && (
            <div className="pt-4 space-y-1.5" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <span className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: '#4263EB' }}>Bio</span>
              <p
                className="text-xs text-slate-300 leading-relaxed italic p-3.5 rounded-xl"
                style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.04)' }}
              >
                &ldquo;{user.bio}&rdquo;
              </p>
            </div>
          )}

          {/* "Looking For" Badges */}
          {user.looking_for && user.looking_for.length > 0 && (
            <div className="pt-4 space-y-2" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <span className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: '#4263EB' }}>Looking For</span>
              <div className="flex flex-wrap gap-1.5">
                {user.looking_for.map((goal) => (
                  <span
                    key={goal}
                    className="text-xs px-3 py-1 rounded-xl font-medium"
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
            </div>
          )}

          {/* Interests & Domains */}
          {user.interests && user.interests.length > 0 && (
            <div className="pt-4 space-y-2" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <span className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: '#4263EB' }}>Interests & Domains</span>
              <div className="flex flex-wrap gap-1.5">
                {user.interests.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-2.5 py-1 rounded-lg font-medium"
                    style={{
                      background: 'rgba(139, 92, 246, 0.08)',
                      border: '1px solid rgba(139, 92, 246, 0.15)',
                      color: '#A78BFA',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Statistics Grid ──────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Events Joined', value: '1', icon: Calendar, color: '#38bdf8' },
            { label: 'Profile Views', value: '12', icon: Eye, color: '#A78BFA' },
            { label: 'Connections', value: '5', icon: Zap, color: '#FBBF24' },
            { label: 'Room Radar', value: 'Live', icon: Users, color: '#10B981' },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="rounded-xl p-4 text-center space-y-1"
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                <Icon className="h-4 w-4 mx-auto" style={{ color: s.color }} />
                <p className="text-xl font-bold text-white">{s.value}</p>
                <p className="text-[11px] font-medium text-slate-400">{s.label}</p>
              </div>
            );
          })}
        </div>

        {/* Edit Profile CTA */}
        <Link
          href="/onboarding"
          className="w-full h-13 rounded-2xl text-white font-bold text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-all duration-200"
          style={{
            background: 'linear-gradient(135deg, #4263EB 0%, #3451D1 100%)',
            boxShadow: '0 8px 24px rgba(66, 99, 235, 0.25)',
          }}
        >
          <Edit3 className="h-4 w-4" />
          Update Profile & Intent Preferences
        </Link>
      </div>
    </div>
  );
}
