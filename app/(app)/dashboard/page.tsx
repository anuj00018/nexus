'use client';

// ===================================================================
// Dashboard Page
// First screen after login/onboarding.
// Shows: Welcome + active event CTA + quick stats + recent activity
// ===================================================================
import Link from 'next/link';
import { CalendarPlus, Users, Zap, ArrowRight, MapPin, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { useAuthStore } from '@/store/authStore';
import { CreateEventModal } from '@/components/events/CreateEventModal';
import { ROUTES } from '@/constants';
import { useState } from 'react';

const QUICK_ACTIONS = [
  {
    href: ROUTES.JOIN_EVENT,
    icon: CalendarPlus,
    title: 'Join an Event',
    desc: 'Enter a 6-char code to start networking',
    color: 'bg-nexus-indigo/10 text-nexus-indigo',
  },
  {
    href: ROUTES.JOIN_EVENT,
    icon: Users,
    title: 'See Nearby People',
    desc: 'Join an event first to see who\'s around you',
    color: 'bg-emerald-500/10 text-emerald-600',
  },
  {
    href: ROUTES.JOIN_EVENT,
    icon: MapPin,
    title: 'Event Heatmap',
    desc: 'Join an event to see where people are clustering',
    color: 'bg-orange-500/10 text-orange-600',
  },
];


export default function DashboardPage() {
  const { user } = useAuthStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const firstName = user?.name?.split(' ')[0] ?? 'there';

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="flex-1 overflow-y-auto pb-20 md:pb-6">
      <div className="container-nexus py-6 md:py-8 space-y-8">

        {/* ── Welcome Header ──────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              {greeting}, {firstName} 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Ready to make meaningful connections today?
            </p>
          </div>
          {user && (
            <Avatar src={user.avatar_url} alt={user.name} size="md" className="shrink-0" />
          )}
        </div>

        {/* ── Join Event CTA Banner ────────────────────────────── */}
        <div className="relative rounded-2xl overflow-hidden bg-nexus-black text-white p-6 md:p-8">
          <div className="absolute inset-0 bg-dot-grid opacity-10" />
          <div className="absolute top-[-60px] right-[-40px] w-[200px] h-[200px] rounded-full bg-nexus-indigo/30 blur-3xl pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 text-xs font-medium mb-3">
                <Zap className="h-3 w-3 text-nexus-indigo" />
                Join an event to start
              </div>
              <h2 className="text-xl font-bold mb-1">Got an event code?</h2>
              <p className="text-white/60 text-sm">
                Enter the 6-character code from your event organizer.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <Button variant="accent" size="lg" asChild>
                <Link href={ROUTES.JOIN_EVENT}>
                  Join Event
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="h-11 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <CalendarPlus className="h-4 w-4 text-nexus-indigo" />
                Create Code
              </button>

            </div>
          </div>
        </div>

        {/* Modal */}
        <CreateEventModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />


        {/* ── Quick Actions ─────────────────────────────────────── */}
        <div>
          <h2 className="text-base font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {QUICK_ACTIONS.map(action => (
              <Link key={action.href} href={action.href}>
                <Card variant="default" interactive padding="md" className="h-full group">
                  <div className={`inline-flex p-2.5 rounded-lg mb-3 ${action.color}`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-sm mb-1 group-hover:text-nexus-indigo transition-colors">
                    {action.title}
                  </CardTitle>
                  <CardDescription className="text-xs">{action.desc}</CardDescription>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Stats Row ─────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Events Joined', value: '0', icon: CalendarPlus },
            { label: 'Profiles Viewed', value: '0', icon: Users },
            { label: 'Profile Views', value: '0', icon: BarChart2 },
            { label: 'Connections', value: '0', icon: Zap },
          ].map(stat => (
            <Card key={stat.label} variant="default" padding="md">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* ── Empty state ───────────────────────────────────────── */}
        <Card variant="muted" padding="lg" className="text-center">
          <div className="text-4xl mb-3">🎯</div>
          <h3 className="font-semibold text-foreground mb-1">No events yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Join your first event to start discovering relevant people nearby.
          </p>
          <Button variant="accent" size="md" asChild>
            <Link href={ROUTES.JOIN_EVENT}>
              <CalendarPlus className="h-4 w-4" />
              Join your first event
            </Link>
          </Button>
        </Card>

      </div>
    </div>
  );
}
