'use client';

// ===================================================================
// Nexus UI v2 — Profile Screen
// Silicon Valley personal card & identity interface.
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
    <div className="flex-1 overflow-y-auto pb-20 md:pb-8 bg-slate-950 text-slate-100">
      <div className="max-w-lg mx-auto px-4 py-8 space-y-6 animate-fade-in">

        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">My Profile</h1>
            <p className="text-xs text-slate-400">Manage your event networking identity</p>
          </div>

          <Link
            href="/onboarding"
            className="px-4 py-2 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-xs font-extrabold flex items-center gap-1.5 hover:bg-indigo-500/20 active:scale-95 transition-all shadow-md"
          >
            <Edit3 className="h-3.5 w-3.5" /> Edit Profile
          </Link>
        </div>

        {/* ── Main Profile Card Container ───────────────────────────── */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl space-y-6">

          {/* Avatar & Identifiers */}
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <Avatar src={user.avatar_url} alt={user.name} size="xl" />
              <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-500 border-2 border-slate-900" />
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="text-lg font-black text-white tracking-tight truncate">{user.name}</h2>

                {/* Founder Badge */}
                {isFounder && (
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 font-extrabold border border-amber-500/20 flex items-center gap-1 shrink-0">
                    <Crown className="h-3 w-3" /> Founder
                  </span>
                )}

                {/* Verified Badge */}
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-400 font-extrabold border border-sky-500/20 flex items-center gap-1 shrink-0">
                  <ShieldCheck className="h-3 w-3 text-sky-400" /> Verified
                </span>
              </div>

              {user.company && (
                <p className="text-xs text-slate-400 font-semibold flex items-center gap-1.5 truncate">
                  <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
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
            <div className="border-t border-slate-800 pt-4 space-y-1.5">
              <span className="text-[10px] font-extrabold tracking-widest uppercase text-indigo-400">Bio</span>
              <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
                "{user.bio}"
              </p>
            </div>
          )}

          {/* "Looking For" Badges */}
          {user.looking_for && user.looking_for.length > 0 && (
            <div className="border-t border-slate-800 pt-4 space-y-2">
              <span className="text-[10px] font-extrabold tracking-widest uppercase text-indigo-400">Looking For</span>
              <div className="flex flex-wrap gap-1.5">
                {user.looking_for.map((goal) => (
                  <span
                    key={goal}
                    className="text-xs px-3 py-1 rounded-xl bg-indigo-500/10 text-indigo-300 font-extrabold border border-indigo-500/20"
                  >
                    {goal}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Interests & Domains */}
          {user.interests && user.interests.length > 0 && (
            <div className="border-t border-slate-800 pt-4 space-y-2">
              <span className="text-[10px] font-extrabold tracking-widest uppercase text-indigo-400">Interests & Domains</span>
              <div className="flex flex-wrap gap-1.5">
                {user.interests.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-300 font-medium border border-purple-500/20"
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
            { label: 'Events Joined', value: '1', icon: Calendar, color: 'text-sky-400' },
            { label: 'Profile Views', value: '12', icon: Eye, color: 'text-purple-400' },
            { label: 'Connections', value: '5', icon: Zap, color: 'text-amber-400' },
            { label: 'Room Radar', value: 'Live', icon: Users, color: 'text-emerald-400' },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-center space-y-1 shadow-md">
                <Icon className={`h-4 w-4 mx-auto ${s.color}`} />
                <p className="text-xl font-black text-white">{s.value}</p>
                <p className="text-[11px] font-semibold text-slate-400">{s.label}</p>
              </div>
            );
          })}
        </div>

        {/* Edit Profile CTA */}
        <Link
          href="/onboarding"
          className="w-full h-13 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-all duration-200 shadow-xl shadow-indigo-600/25"
        >
          <Edit3 className="h-4 w-4" />
          Update Profile & Intent Preferences
        </Link>
      </div>
    </div>
  );
}
