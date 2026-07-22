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


          {/* Profile Details End */}

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
