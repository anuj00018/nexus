'use client';

// ===================================================================
// Strictly Password-Protected Founder Admin Dashboard (`/admin`)
// Password: NEXUS2025 (or ANUJ2025)
// Shows confidential attendee ratings, participant names, & feedback
// ===================================================================
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users, BarChart2, Zap, Star, Linkedin, MessageSquare, Download,
  CalendarPlus, ArrowRight, ShieldCheck, Flame, Filter, RefreshCw, Lock, KeyRound, Unlock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CreateEventModal } from '@/components/events/CreateEventModal';
import toast from 'react-hot-toast';

const FOUNDER_PASSWORD = 'NEXUS2025'; // Master Founder Password

const STATS_OVERVIEW = [
  {
    title: 'Total Event Attendees',
    value: '298',
    sub: '+42 in last hour',
    icon: Users,
    color: 'bg-nexus-indigo/10 text-nexus-indigo',
  },
  {
    title: 'LinkedIn Profile Views',
    value: '1,420',
    sub: '100% verified links',
    icon: Linkedin,
    color: 'bg-[#0A66C2]/10 text-[#0A66C2]',
  },
  {
    title: '1-on-1 Messages Sent',
    value: '584',
    sub: '89% response rate',
    icon: MessageSquare,
    color: 'bg-emerald-500/10 text-emerald-600',
  },
  {
    title: 'Average Event Rating',
    value: '4.9 ★',
    sub: 'Based on 86 reviews',
    icon: Star,
    color: 'bg-amber-500/10 text-amber-500',
  },
];

const ACTIVE_EVENTS = [
  { id: 'demo-1', title: 'TechFest 2025', join_code: 'NEXUS1', attendees: 142, activeNow: 39, category: 'College Fest', rating: 4.9 },
  { id: 'demo-2', title: 'Startup Meetup', join_code: 'NEXUS2', attendees: 67,  activeNow: 18, category: 'Meetup',       rating: 4.8 },
  { id: 'demo-3', title: 'AI Hackathon',   join_code: 'NEXUS3', attendees: 89,  activeNow: 25, category: 'Hackathon',    rating: 5.0 },
];

export default function AdminPortalPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Check saved admin session
  useEffect(() => {
    try {
      const savedAuth = sessionStorage.getItem('nexus_founder_admin_authed');
      if (savedAuth === 'true') {
        setIsAuthenticated(true);
      }
    } catch {}
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === FOUNDER_PASSWORD || passwordInput.trim() === 'ANUJ2025') {
      setIsAuthenticated(true);
      sessionStorage.setItem('nexus_founder_admin_authed', 'true');
      toast.success('🔓 Access Granted! Welcome Founder Anuj Vardham.');
    } else {
      toast.error('❌ Incorrect Password! Access Denied.');
    }
  };

  const handleLockAdmin = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('nexus_founder_admin_authed');
    setPasswordInput('');
    toast.success('🔒 Founder Admin Dashboard Locked');
  };

  const handleExportCSV = () => {
    const csvContent =
      'Event Title,Join Code,Category,Attendees,Active Now,Rating\n' +
      ACTIVE_EVENTS.map((e) => `"${e.title}","${e.join_code}","${e.category}",${e.attendees},${e.activeNow},${e.rating}`).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Nexus_Founder_Analytics_Report.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Analytics report exported as CSV!');
  };

  // ── Password Lock Gate Screen ──────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-5">
        <div className="w-full max-w-sm bg-muted/30 border border-border p-6 rounded-3xl space-y-6 shadow-2xl text-center">
          <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500 w-16 h-16 mx-auto flex items-center justify-center">
            <Lock className="h-8 w-8" />
          </div>

          <div>
            <span className="text-2xs font-extrabold px-2.5 py-1 rounded-md bg-nexus-indigo/10 text-nexus-indigo uppercase tracking-wider">
              Private Founder Dashboard
            </span>
            <h2 className="text-xl font-bold text-foreground mt-2">Enter Founder Password</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Confidential attendee ratings & feedback comments are protected
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-3">
            <div>
              <input
                type="password"
                required
                placeholder="Enter password..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-background border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-nexus-indigo text-center font-mono text-sm tracking-widest"
              />
            </div>

            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-nexus-black text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-nexus-black/90 active:scale-[0.98] transition-all shadow-md"
            >
              <KeyRound className="h-4 w-4 text-nexus-indigo" />
              Unlock Founder Inbox 🔓
            </button>
          </form>

          <p className="text-2xs text-muted-foreground">
            Strictly Private • Founder Password Required
          </p>
        </div>
      </div>
    );
  }

  // ── Unlocked Founder Admin Dashboard ──────────────────────────────────────
  return (
    <div className="flex-1 overflow-y-auto pb-20 md:pb-6">
      <div className="container-nexus py-6 md:py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xs font-bold px-2.5 py-0.5 rounded-md bg-nexus-indigo text-white uppercase tracking-wider">
                Founder Admin Portal
              </span>
              <Badge variant="accent" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-2xs">
                Authenticated
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Confidential Founder Control Center
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Attendee 5-star ratings, written feedback, & room engagement analytics
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleLockAdmin}
              className="h-10 px-3 rounded-xl border border-destructive/30 text-destructive hover:bg-destructive/5 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Lock className="h-3.5 w-3.5" />
              Lock Inbox
            </button>

            <button
              onClick={handleExportCSV}
              className="h-10 px-3.5 rounded-xl border border-border bg-background hover:bg-muted text-foreground text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Download className="h-4 w-4 text-nexus-indigo" />
              Export CSV
            </button>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="h-10 px-4 rounded-xl bg-nexus-indigo text-white hover:bg-nexus-indigo/90 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <CalendarPlus className="h-4 w-4" />
              Create Code
            </button>
          </div>
        </div>

        {/* ── Confidential Attendee Ratings & Feedback Inbox (VISIBLE ONLY TO YOU) ── */}
        <Card variant="accent" padding="lg" className="border-2 border-nexus-indigo/50 bg-nexus-indigo/5 shadow-lg">
          <CardHeader className="p-0 mb-4 flex flex-row items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="h-4 w-4 text-nexus-indigo" />
                <Badge variant="accent" className="bg-nexus-indigo text-white border-none text-2xs font-bold">
                  🔒 Strictly Confidential (Visible Only To You)
                </Badge>
              </div>
              <CardTitle className="text-xl">Attendee Ratings & Written Feedback Inbox</CardTitle>
              <CardDescription className="text-xs">
                Direct feedback and 5-star rating reviews submitted by attendees across all event rooms
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="divide-y divide-border border border-border rounded-xl bg-background overflow-hidden">
              {[
                {
                  id: 'f1',
                  name: 'Rahul Sharma',
                  rating: 5,
                  tags: ['Great Matches', 'Easy to Connect'],
                  comment: 'The 1-tap LinkedIn profile connect made networking super smooth! Found 2 potential co-founders in 20 minutes.',
                  event: 'TechFest 2025 (NEXUS1)',
                  time: '12 mins ago',
                },
                {
                  id: 'f2',
                  name: 'Pooja Verma',
                  rating: 5,
                  tags: ['High Quality Attendees', 'Fast Profile Exchange'],
                  comment: 'Loved how everyone in the room is instantly visible with verified LinkedIn links. Great app!',
                  event: 'Startup Meetup (NEXUS2)',
                  time: '34 mins ago',
                },
                {
                  id: 'f3',
                  name: 'Karan Patel',
                  rating: 4,
                  tags: ['Good Hiring Leads'],
                  comment: 'Excellent event. Met great senior devs looking for new startup roles.',
                  event: 'AI Hackathon (NEXUS3)',
                  time: '1 hour ago',
                },
              ].map((feedback) => (
                <div key={feedback.id} className="p-4 space-y-2 hover:bg-muted/20 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-foreground">{feedback.name}</span>
                      <span className="text-2xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                        {feedback.rating} ★★★★★
                      </span>
                    </div>
                    <span className="text-2xs text-muted-foreground">{feedback.time} • {feedback.event}</span>
                  </div>

                  <p className="text-xs text-foreground font-medium italic bg-muted/30 p-2.5 rounded-lg border border-border">
                    "{feedback.comment}"
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {feedback.tags.map((t) => (
                      <span key={t} className="text-2xs px-2.5 py-0.5 rounded-md bg-nexus-indigo/10 text-nexus-indigo font-bold border border-nexus-indigo/20">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS_OVERVIEW.map((stat) => (
            <Card key={stat.title} padding="md" variant="default" className="relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-2xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-extrabold text-foreground mt-1">{stat.value}</p>
                  <p className="text-2xs text-emerald-600 font-semibold mt-1">{stat.sub}</p>
                </div>
                <div className={`p-2.5 rounded-xl ${stat.color} shrink-0`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Active Events Management Table */}
        <Card variant="default" padding="lg">
          <CardHeader className="p-0 mb-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Active Managed Events</CardTitle>
              <CardDescription className="text-xs">
                Real-time room status, join codes, and attendee ratings
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="divide-y divide-border border border-border rounded-xl overflow-hidden">
              {ACTIVE_EVENTS.map((event) => (
                <div key={event.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-background hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-nexus-indigo/10 text-nexus-indigo font-mono font-bold text-sm shrink-0">
                      {event.join_code}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground">{event.title}</h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                        <span>{event.category}</span>
                        <span>•</span>
                        <span className="text-emerald-600 font-semibold">{event.activeNow} active in room now</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <p className="text-xs font-bold text-foreground">{event.attendees} total attendees</p>
                      <p className="text-2xs text-amber-500 font-bold">{event.rating} ★ Rating</p>
                    </div>

                    <Link
                      href={`/events/${event.id}/nearby`}
                      className="px-3 py-1.5 rounded-lg bg-muted hover:bg-nexus-indigo/10 hover:text-nexus-indigo text-xs font-semibold text-foreground transition-colors flex items-center gap-1"
                    >
                      View Room <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Event Code Generator Modal */}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
