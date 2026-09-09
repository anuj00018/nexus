'use client';

// ===================================================================
// Nexus v3.0 — Profile Screen (Cyber Aurora Edition)
// Electric Violet + Neon Cyan + Cosmic Obsidian.
// Fast, responsive, and lag-free.
// ===================================================================
import { useAuthStore } from '@/store/authStore';
import { Avatar } from '@/components/ui/Avatar';
import {
  Mail, Edit3, Building2, ShieldCheck,
  Calendar, Users, Eye, Zap, Crown, ExternalLink
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
    <div className="flex-1 overflow-y-auto pb-24 md:pb-8 relative bg-[#030712] text-slate-100 selection:bg-cyan-500/30">
      {/* Ambient Cyber Aurora Mesh Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute animate-float"
          style={{
            top: '10%',
            right: '15%',
            width: '500px',
            height: '400px',
            background: 'radial-gradient(ellipse, rgba(139, 92, 246, 0.14) 0%, rgba(6, 182, 212, 0.08) 50%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-4 py-8 space-y-6 animate-fade-in">

        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
              My Profile
            </h1>
            <p className="text-xs text-slate-400">Manage your event networking identity</p>
          </div>

          <Link
            href="/onboarding"
            className="px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all text-white bg-white/[0.04] border border-white/[0.08] hover:border-cyan-400/40 hover:bg-cyan-500/15 shadow-sm"
          >
            <Edit3 className="h-3.5 w-3.5 text-cyan-400" /> Edit Profile
          </Link>
        </div>

        {/* ── Main Profile Card Container ───────────────────────────── */}
        <div
          className="rounded-3xl p-6 sm:p-7 space-y-6 bg-[#070B19]/85 backdrop-blur-2xl border border-white/[0.08] shadow-[0_16px_48px_rgba(0,0,0,0.6),0_0_24px_rgba(6,182,212,0.1)] hover:border-cyan-500/30 transition-all duration-300"
        >
          {/* Avatar & Identifiers */}
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <Avatar src={user.avatar_url} alt={user.name} size="xl" />
              <span
                className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-cyan-400 border-2 border-[#030712] shadow-[0_0_10px_rgba(6,182,212,0.8)]"
              />
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="text-lg font-bold text-white tracking-tight truncate">{user.name}</h2>

                {/* Founder Badge */}
                {isFounder && (
                  <span
                    className="text-[10px] px-2.5 py-0.5 rounded-md font-bold flex items-center gap-1 shrink-0 bg-violet-500/15 border border-violet-400/35 text-violet-300 shadow-[0_0_8px_rgba(139,92,246,0.2)]"
                  >
                    <Crown className="h-3 w-3 text-violet-400" /> Founder
                  </span>
                )}

                {/* Verified Badge */}
                <span
                  className="text-[10px] px-2.5 py-0.5 rounded-md font-bold flex items-center gap-1 shrink-0 bg-cyan-500/15 border border-cyan-400/35 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.2)]"
                >
                  <ShieldCheck className="h-3 w-3 text-cyan-400" /> Verified
                </span>
              </div>

              {user.company && (
                <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 truncate">
                  <Building2 className="h-3.5 w-3.5 text-violet-400 shrink-0" />
                  {user.company}
                </p>
              )}

              <p className="text-[11px] text-slate-400 flex items-center gap-1.5 truncate">
                <Mail className="h-3 w-3 text-slate-500 shrink-0" />
                {user.email}
              </p>
            </div>
          </div>

          {/* Bio Container */}
          {user.bio && (
            <div className="pt-4 space-y-1.5 border-t border-white/[0.08]">
              <span className="text-[10px] font-bold tracking-widest uppercase text-cyan-400">Bio</span>
              <p
                className="text-xs text-slate-300 leading-relaxed italic p-3.5 rounded-2xl bg-[#030712]/60 border border-white/[0.06]"
              >
                &ldquo;{user.bio}&rdquo;
              </p>
            </div>
          )}

          {/* "Looking For" Badges */}
          {user.looking_for && user.looking_for.length > 0 && (
            <div className="pt-4 space-y-2 border-t border-white/[0.08]">
              <span className="text-[10px] font-bold tracking-widest uppercase text-cyan-400">Looking For</span>
              <div className="flex flex-wrap gap-1.5">
                {user.looking_for.map((goal) => (
                  <span
                    key={goal}
                    className="text-xs px-3 py-1 rounded-xl font-semibold bg-cyan-500/10 border border-cyan-400/25 text-cyan-200"
                  >
                    {goal}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Interests & Domains */}
          {user.interests && user.interests.length > 0 && (
            <div className="pt-4 space-y-2 border-t border-white/[0.08]">
              <span className="text-[10px] font-bold tracking-widest uppercase text-violet-400">Interests & Domains</span>
              <div className="flex flex-wrap gap-1.5">
                {user.interests.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-2.5 py-1 rounded-lg font-medium bg-white/[0.04] border border-white/[0.08] text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* LinkedIn URL Link */}
          {user.linkedin_url && (
            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">LinkedIn Presence</span>
              <a
                href={user.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-cyan-400 hover:underline inline-flex items-center gap-1"
              >
                View Profile <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}
        </div>

        {/* ── Statistics Grid ──────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Events Joined', value: '1', icon: Calendar, color: 'text-violet-400', border: 'border-violet-500/20' },
            { label: 'Profile Views', value: '28', icon: Eye, color: 'text-cyan-400', border: 'border-cyan-500/20' },
            { label: 'Connections', value: '8', icon: Zap, color: 'text-amber-400', border: 'border-amber-500/20' },
            { label: 'Room Radar', value: 'Live', icon: Users, color: 'text-emerald-400', border: 'border-emerald-500/20' },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className={`rounded-2xl p-4 text-center space-y-1.5 transition-all duration-200 hover:-translate-y-1 bg-[#070B19]/80 backdrop-blur-xl border ${s.border}`}
              >
                <Icon className={`h-4 w-4 mx-auto ${s.color}`} />
                <div className="text-lg font-bold text-white tracking-tight">{s.value}</div>
                <div className="text-[10px] font-medium text-slate-400">{s.label}</div>
              </div>
            );
          })}
        </div>

        <Link
          href="/onboarding"
          className="btn-aurora w-full h-13 rounded-2xl text-white font-bold text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-all duration-200 shadow-lg"
        >
          <Edit3 className="h-4 w-4" />
          Update Profile & Intent Preferences
        </Link>
      </div>
    </div>
  );
}
