'use client';

// ===================================================================
// My Profile Page — Polished Silicon Valley Interface
// Features: Enhanced Avatar with Online Status, Verified Badges,
// Organization, Looking For Goals, Domain Interests, Statistics Cards,
// and Direct Edit Profile Action.
// ===================================================================
import { useAuthStore } from '@/store/authStore';
import { Avatar } from '@/components/ui/Avatar';
import {
  Linkedin, Mail, Edit3, Building2, ShieldCheck,
  Calendar, Users, Eye, Zap, Crown
} from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
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
    <div className="flex-1 overflow-y-auto pb-20 md:pb-8">
      <div className="max-w-lg mx-auto px-4 py-6 sm:py-8 space-y-6">

        {/* Top Action Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">My Profile</h1>
            <p className="text-xs text-muted-foreground">Manage your event networking identity</p>
          </div>

          <Link
            href="/onboarding"
            className="px-3.5 py-2 rounded-xl bg-nexus-indigo/10 text-nexus-indigo border border-nexus-indigo/30 text-xs font-bold flex items-center gap-1.5 hover:bg-nexus-indigo/20 active:scale-95 transition-all shadow-2xs"
          >
            <Edit3 className="h-3.5 w-3.5" /> Edit Profile
          </Link>
        </div>

        {/* ── Main Profile Card ─────────────────────────────────────── */}
        <div className="rounded-3xl border border-border/80 bg-background/90 p-6 shadow-md backdrop-blur-md space-y-5">

          {/* Avatar & Header Info */}
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <Avatar src={user.avatar_url} alt={user.name} size="xl" />
              <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-500 border-2 border-background" />
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="text-lg font-extrabold text-foreground tracking-tight truncate">{user.name}</h2>

                {/* Founder Badge */}
                {isFounder && (
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 font-extrabold border border-amber-500/20 flex items-center gap-1 shrink-0">
                    <Crown className="h-3 w-3" /> Founder
                  </span>
                )}

                {/* LinkedIn Verified Badge */}
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-500/10 text-[#0A66C2] font-extrabold border border-[#0A66C2]/20 flex items-center gap-1 shrink-0">
                  <ShieldCheck className="h-3 w-3 text-[#0A66C2]" /> Verified
                </span>
              </div>

              {user.company && (
                <p className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5 truncate">
                  <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  {user.company}
                </p>
              )}

              <p className="text-2xs text-muted-foreground flex items-center gap-1.5 truncate">
                <Mail className="h-3 w-3 text-muted-foreground shrink-0" />
                {user.email}
              </p>
            </div>
          </div>

          {/* Bio Section */}
          {user.bio && (
            <div className="border-t border-border/60 pt-4 space-y-1">
              <span className="text-[10px] font-extrabold tracking-wider uppercase text-nexus-indigo">Bio</span>
              <p className="text-xs text-foreground/80 leading-relaxed italic bg-muted/20 p-3 rounded-xl border border-border/40">
                "{user.bio}"
              </p>
            </div>
          )}

          {/* "Looking For" Badges */}
          {user.looking_for && user.looking_for.length > 0 && (
            <div className="border-t border-border/60 pt-4 space-y-2">
              <span className="text-[10px] font-extrabold tracking-wider uppercase text-nexus-indigo">Looking For</span>
              <div className="flex flex-wrap gap-1.5">
                {user.looking_for.map((goal) => (
                  <span
                    key={goal}
                    className="text-xs px-2.5 py-1 rounded-lg bg-nexus-indigo/10 text-nexus-indigo font-extrabold border border-nexus-indigo/20"
                  >
                    {goal}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Interests & Domains */}
          {user.interests && user.interests.length > 0 && (
            <div className="border-t border-border/60 pt-4 space-y-2">
              <span className="text-[10px] font-extrabold tracking-wider uppercase text-nexus-indigo">Interests & Domains</span>
              <div className="flex flex-wrap gap-1.5">
                {user.interests.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-600 font-medium border border-purple-500/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* LinkedIn Profile Button */}
          <div className="border-t border-border/60 pt-4">
            <a
              href={user.linkedin_url || 'https://www.linkedin.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-11 rounded-xl bg-[#0A66C2] text-white font-extrabold text-xs flex items-center justify-center gap-2 hover:bg-[#084e96] active:scale-[0.98] transition-all shadow-md shadow-[#0A66C2]/20"
            >
              <Linkedin className="h-4 w-4 fill-white" />
              View Verified LinkedIn Profile ↗
            </a>
          </div>

        </div>

        {/* ── Statistics Cards Grid ─────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Events Joined', value: '1', icon: Calendar, color: 'text-blue-500' },
            { label: 'Profile Views', value: '12', icon: Eye, color: 'text-purple-500' },
            { label: 'Connections', value: '5', icon: Zap, color: 'text-amber-500' },
            { label: 'Room Radar', value: 'Live', icon: Users, color: 'text-emerald-500' },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="rounded-2xl border border-border/80 bg-background/90 p-4 text-center space-y-1 shadow-2xs">
                <Icon className={`h-4 w-4 mx-auto ${s.color}`} />
                <p className="text-xl font-black text-foreground">{s.value}</p>
                <p className="text-[11px] font-semibold text-muted-foreground">{s.label}</p>
              </div>
            );
          })}
        </div>

        {/* Update Profile CTA Button */}
        <Link
          href="/onboarding"
          className="w-full h-13 rounded-2xl bg-nexus-indigo text-white font-extrabold text-xs flex items-center justify-center gap-2 hover:bg-nexus-indigo/90 active:scale-[0.98] transition-all shadow-lg shadow-nexus-indigo/20"
        >
          <Edit3 className="h-4 w-4" />
          Update Profile & Intent Preferences
        </Link>
      </div>
    </div>
  );
}
