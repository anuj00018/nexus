'use client';

// ===================================================================
// Admin Analytics Portal (`/admin`)
// Real-time Organizer Control Center for Founders & Event Hosts
// Shows live attendance, connection metrics, top interests, & rating reports
// ===================================================================
import { useState } from 'react';
import Link from 'next/link';
import {
  Users, BarChart2, Zap, Star, Linkedin, MessageSquare, Download,
  CalendarPlus, ArrowRight, ShieldCheck, Flame, Filter, RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CreateEventModal } from '@/components/events/CreateEventModal';
import toast from 'react-hot-toast';

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

const TOP_INTERESTS = [
  { name: 'AI / Machine Learning', count: 184, percent: 62 },
  { name: 'Startups & Co-founders', count: 142, percent: 48 },
  { name: 'Web3 & Open Source', count: 96, percent: 32 },
  { name: 'Frontend & UI/UX', count: 88, percent: 30 },
  { name: 'Hiring & Career Options', count: 74, percent: 25 },
];

export default function AdminPortalPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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

  return (
    <div className="flex-1 overflow-y-auto pb-20 md:pb-6">
      <div className="container-nexus py-6 md:py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xs font-bold px-2 py-0.5 rounded-md bg-nexus-indigo/10 text-nexus-indigo uppercase tracking-wider">
                Founder Admin Portal
              </span>
              <Badge variant="accent" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-2xs">
                Live Server
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Event Analytics & Management
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Real-time room engagement, LinkedIn profile clicks, & attendee ratings
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportCSV}
              className="h-10 px-3.5 rounded-xl border border-border bg-background hover:bg-muted text-foreground text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Download className="h-4 w-4 text-nexus-indigo" />
              Export Report
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

        {/* Top Trending Interests */}
        <Card variant="default" padding="lg">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-lg">Top Attendee Interest Clusters</CardTitle>
            <CardDescription className="text-xs">
              Primary networking domains driving matches in room
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0 space-y-3">
            {TOP_INTERESTS.map((interest) => (
              <div key={interest.name} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-foreground">{interest.name}</span>
                  <span className="text-nexus-indigo">{interest.count} attendees ({interest.percent}%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-nexus-indigo transition-all duration-500"
                    style={{ width: `${interest.percent}%` }}
                  />
                </div>
              </div>
            ))}
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
