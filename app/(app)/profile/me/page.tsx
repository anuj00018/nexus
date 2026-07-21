'use client';

import { useAuthStore } from '@/store/authStore';
import { Avatar } from '@/components/ui/Avatar';
import { Linkedin, Mail, Edit, Briefcase } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user: storeUser } = useAuthStore();

  const user = storeUser || {
    id: 'user-founder-anuj',
    email: 'anuj.vardham@nexus.app',
    name: 'Anuj Vardham',
    avatar_url: null,
    headline: 'Founder @ Nexus',

    linkedin_url: 'https://www.linkedin.com/in/anuj-vardham-b399253a1',
    skills: ['AI / ML', 'Product Strategy', 'Startup Growth', 'Networking'],
    role: 'attendee',
  };


  return (
    <div className="flex-1 overflow-y-auto pb-20 md:pb-6">
      <div className="max-w-lg mx-auto px-4 py-8 space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between">
          <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
          <Link
            href="/onboarding"
            className="flex items-center gap-1.5 text-sm text-nexus-indigo hover:underline"
          >
            <Edit className="h-3.5 w-3.5" /> Edit
          </Link>
        </div>

        {/* Profile card */}
        <div className="rounded-2xl border border-border bg-background p-6">
          <div className="flex items-start gap-4 mb-5">
            <Avatar src={user.avatar_url} alt={user.name} size="xl" />
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-foreground leading-tight">{user.name}</h2>
              {user.headline && (
                <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5 shrink-0" />
                  {user.headline}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                <Mail className="h-3 w-3 shrink-0" />
                {user.email}
              </p>
            </div>
          </div>

          {(user as any).bio && (
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed border-t border-border pt-4">
              {(user as any).bio}
            </p>
          )}


          {(user as any).skills?.length > 0 && (
            <div className="border-t border-border pt-4">
              <p className="text-xs font-medium text-foreground mb-2">Skills</p>
              <div className="flex flex-wrap gap-2">
                {(user as any).skills.map((s: string) => (
                  <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-muted border border-border text-muted-foreground">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}


          <div className="border-t border-border pt-4 mt-4 space-y-3">
            <a
              href={user?.linkedin_url || 'https://www.linkedin.com/in/anuj-vardham-b399253a1'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[#0A66C2] font-semibold hover:underline bg-[#0A66C2]/10 px-3 py-2 rounded-xl w-full justify-between"
            >
              <span className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[#0A66C2]">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                My Connected LinkedIn Profile
              </span>
              <span className="text-2xs font-mono opacity-80">anuj-vardham ↗</span>
            </a>

            {/* Nexus Company Page */}
            <a
              href="https://www.linkedin.com/company/join-nexus1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground font-medium bg-muted/60 px-3 py-2 rounded-xl w-full justify-between border border-border"
            >

              <span className="flex items-center gap-2">
                <span className="font-bold text-nexus-indigo">N</span>
                Nexus Official LinkedIn Page
              </span>
              <span className="text-2xs opacity-70">Follow Nexus ↗</span>
            </a>
          </div>

        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Events', value: '0' },
            { label: 'Views', value: '0' },
            { label: 'Connects', value: '0' },
          ].map(s => (
            <div key={s.label} className="rounded-xl border border-border bg-background p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Update profile CTA */}
        <Link
          href="/onboarding"
          className="block w-full h-12 rounded-xl bg-nexus-black text-white font-semibold text-sm
                     flex items-center justify-center gap-2 hover:bg-nexus-black/90
                     active:scale-[0.98] transition-all duration-150"
        >
          <Edit className="h-4 w-4" />
          Update my profile & interests
        </Link>
      </div>
    </div>
  );
}
