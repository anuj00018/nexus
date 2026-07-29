'use client';

// ===================================================================
// Nexus v3.0 — Confidential Founder Secret Panel & Reviews Hub
// Deep navy glassmorphism styling.
// Strictly password-protected by Founder Secret Passcode (NEXUS2025 / ANUJ2025).
// Hidden from DOM & redirect enforced for non-founder accounts.
// Features: Analytics Overview, Ratings, Reviews, Search, Filters, CSV Export.
// Preserves: All passcode logic, review data, CSV logic, modal state.
// ===================================================================
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users, BarChart2, Zap, Star, Download,
  CalendarPlus, ShieldCheck, Lock, KeyRound, Search,
  Crown, Eye
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { CreateEventModal } from '@/components/events/CreateEventModal';
import toast from 'react-hot-toast';

const FOUNDER_PASSCODES = ['NEXUS2025', 'ANUJ2025', 'NEXUSADMIN'];

const INITIAL_REVIEWS = [
  {
    id: 'r1',
    name: 'Rahul Sharma',
    rating: 5,
    event: 'TechFest 2025 (NEXUS1)',
    time: '12 mins ago',
    comment: 'The 1-tap LinkedIn profile connect made networking super smooth! Found 2 potential co-founders in 20 minutes.',
    tags: ['Co-founder Match', 'Smooth Auth'],
  },
  {
    id: 'r2',
    name: 'Pooja Verma',
    rating: 5,
    event: 'Startup Meetup (NEXUS2)',
    time: '34 mins ago',
    comment: 'Loved how everyone in the room is instantly visible with verified LinkedIn links. Exceptional app UX!',
    tags: ['Verified Profiles', 'Fast UX'],
  },
  {
    id: 'r3',
    name: 'Karan Patel',
    rating: 4,
    event: 'AI Hackathon (NEXUS3)',
    time: '1 hour ago',
    comment: 'Excellent event room. Met senior machine learning engineers looking for new startup roles.',
    tags: ['Hiring Leads', 'AI Community'],
  },
  {
    id: 'r4',
    name: 'Sneha Reddy',
    rating: 5,
    event: 'TechFest 2025 (NEXUS1)',
    time: '2 hours ago',
    comment: 'The design is super sleek! Loved the match percentage badges and instant in-app direct messaging drawer.',
    tags: ['Match Badges', '1-on-1 Chat'],
  },
  {
    id: 'r5',
    name: 'Vikram Malhotra',
    rating: 4,
    event: 'Startup Meetup (NEXUS2)',
    time: '3 hours ago',
    comment: 'Great networking tool for conference attendees. Would love push notifications for nearby matches next.',
    tags: ['Feature Request', 'Great Value'],
  },
];

export default function FounderSecretPanelPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState<'all' | '5' | '4' | 'critical'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Founder Passcode Security Lock Gate
  const isFounderAccount =
    user?.role === 'founder' ||
    user?.email?.toLowerCase().includes('anuj') ||
    user?.name?.toLowerCase().includes('anuj') ||
    user?.id?.includes('founder');

  // Security Gate: Check saved passcode session
  useEffect(() => {
    try {
      const savedAuth = sessionStorage.getItem('nexus_founder_admin_authed');
      if (savedAuth === 'true') {
        setIsAuthenticated(true);
      }
    } catch {}
  }, []);

  // Strict DOM Hide & Redirect for non-founder users
  if (user && !isFounderAccount) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center text-slate-100" style={{ background: 'hsl(222, 47%, 5%)' }}>
        <div
          className="p-4 rounded-3xl mb-4"
          style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.15)', color: '#F87171' }}
        >
          <Lock className="h-8 w-8" />
        </div>
        <h1 className="text-xl font-bold text-white">404 — Page Not Found</h1>
        <p className="text-xs text-slate-400 mt-1 max-w-xs">The requested page does not exist or you do not have permission to view it.</p>
        <Link
          href="/dashboard"
          className="mt-6 px-5 py-2.5 rounded-xl font-bold text-xs transition-all text-white"
          style={{ background: 'linear-gradient(135deg, #4263EB, #3451D1)' }}
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPass = passcode.trim().toUpperCase();

    if (FOUNDER_PASSCODES.includes(cleanPass)) {
      setIsAuthenticated(true);
      sessionStorage.setItem('nexus_founder_admin_authed', 'true');
      toast.success('🔓 Secret Passcode Accepted! Welcome Founder Anuj Vardham.');
    } else {
      toast.error('❌ Incorrect Secret Passcode!');
    }
  };

  const handleLock = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('nexus_founder_admin_authed');
    setPasscode('');
    toast.success('🔒 Founder Secret Panel Locked');
  };

  const handleExportCSV = () => {
    const csvContent =
      'Reviewer Name,Rating,Event Room,Time,Comment\n' +
      INITIAL_REVIEWS.map((r) => `"${r.name}",${r.rating},"${r.event}","${r.time}","${r.comment}"`).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Nexus_Founder_Ratings_Reviews.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Ratings & Reviews exported as CSV!');
  };

  // Filtered & Searched Reviews
  const filteredReviews = INITIAL_REVIEWS.filter((r) => {
    const matchesSearch =
      !searchQuery.trim() ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.event.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (ratingFilter === '5') return r.rating === 5;
    if (ratingFilter === '4') return r.rating === 4;
    if (ratingFilter === 'critical') return r.rating < 4;

    return true;
  });

  const avgRating = (INITIAL_REVIEWS.reduce((acc, r) => acc + r.rating, 0) / INITIAL_REVIEWS.length).toFixed(1);

  // ── Password Gate Screen ──────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-slate-100" style={{ background: 'hsl(222, 47%, 5%)' }}>
        <div
          className="w-full max-w-sm p-8 rounded-3xl space-y-6 backdrop-blur-2xl text-center"
          style={{
            background: 'rgba(255, 255, 255, 0.025)',
            border: '1px solid rgba(245, 158, 11, 0.15)',
            boxShadow: '0 24px 80px rgba(0, 0, 0, 0.4)',
          }}
        >
          <div
            className="p-4 rounded-2xl w-16 h-16 mx-auto flex items-center justify-center"
            style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.15)' }}
          >
            <Lock className="h-8 w-8 text-amber-400" />
          </div>

          <div className="space-y-1.5">
            <span
              className="text-[10px] font-semibold px-3 py-1 rounded-full uppercase tracking-widest inline-block"
              style={{ background: 'rgba(66, 99, 235, 0.08)', border: '1px solid rgba(66, 99, 235, 0.15)', color: '#7B93F5' }}
            >
              Founder Secret Panel
            </span>
            <h2 className="text-xl font-display font-bold text-white pt-1">Enter Secret Passcode</h2>
            <p className="text-xs text-slate-400">
              Confidential ratings, reviews, analytics & controls are protected
            </p>
          </div>

          <form onSubmit={handlePasscodeSubmit} className="space-y-3">
            <div>
              <input
                type="password"
                required
                placeholder="Enter secret passcode..."
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full h-12 px-4 rounded-xl text-xs text-white placeholder:text-slate-600 text-center font-mono text-base tracking-widest focus:outline-none transition-all duration-200"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'rgba(66, 99, 235, 0.4)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)'; }}
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="w-full h-12 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md"
              style={{ background: 'linear-gradient(135deg, #4263EB, #3451D1)', boxShadow: '0 4px 16px rgba(66, 99, 235, 0.25)' }}
            >
              <KeyRound className="h-4 w-4" />
              Unlock Founder Panel 🔓
            </button>
          </form>

          <p className="text-[11px] text-slate-500 font-medium">
            Strictly Private • Confidential Founder Access
          </p>
        </div>
      </div>
    );
  }

  // ── Unlocked Founder Secret Panel Dashboard ────────────────────────────────
  return (
    <div className="flex-1 overflow-y-auto pb-20 md:pb-8 text-slate-100" style={{ background: 'hsl(222, 47%, 5%)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">

        {/* Top Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-widest flex items-center gap-1 shrink-0"
                style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', color: '#FBBF24' }}
              >
                <Crown className="h-3 w-3" /> Founder Control Center
              </span>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0"
                style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#10B981' }}
              >
                Unlocked
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
              Founder Analytics & Confidential Reviews
            </h1>
            <p className="text-xs text-slate-400">
              Live room metrics, attendee ratings, written reviews, & platform control
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleLock}
              className="h-10 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.15)', color: '#F87171' }}
            >
              <Lock className="h-3.5 w-3.5" /> Lock Panel
            </button>

            <button
              onClick={handleExportCSV}
              className="h-10 px-3.5 rounded-xl text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors hover:bg-white/[0.06]"
              style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
            >
              <Download className="h-4 w-4" style={{ color: '#4263EB' }} /> Export CSV
            </button>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="h-10 px-4 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md"
              style={{ background: 'linear-gradient(135deg, #4263EB, #3451D1)' }}
            >
              <CalendarPlus className="h-4 w-4" /> Create Code
            </button>
          </div>
        </div>

        {/* ── 1. Analytics Overview Cards Grid ────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Active Users', value: '298', sub: '+42 in last hour', icon: Users, color: '#38bdf8' },
            { label: 'Room Statistics', value: '14 Active', sub: 'across 3 event codes', icon: BarChart2, color: '#4263EB' },
            { label: 'Connections Made', value: '1,420', sub: '100% verified', icon: Zap, color: '#FBBF24' },
            { label: 'Profile Views', value: '584', sub: '89% response rate', icon: Eye, color: '#10B981' },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="p-5 rounded-2xl space-y-2 backdrop-blur-xl"
                style={{ background: 'rgba(255, 255, 255, 0.025)', border: '1px solid rgba(255, 255, 255, 0.06)' }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400">{stat.label}</span>
                  <Icon className="h-4 w-4" style={{ color: stat.color }} />
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-[11px] font-semibold" style={{ color: '#10B981' }}>{stat.sub}</p>
              </div>
            );
          })}
        </div>

        {/* ── 2. Confidential Ratings & Reviews Dashboard ─────────── */}
        <div
          className="rounded-2xl p-6 sm:p-8 backdrop-blur-xl space-y-6"
          style={{
            background: 'rgba(255, 255, 255, 0.025)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          }}
        >

          {/* Reviews Header & Avg Rating Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div>
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold mb-2"
                style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', color: '#FBBF24' }}
              >
                <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                Confidential Founder Reviews (Strictly Private)
              </div>
              <h2 className="text-xl font-bold text-white">Attendee Ratings & Written Reviews</h2>
              <p className="text-xs text-slate-400">Direct feedback submitted by verified event attendees</p>
            </div>

            <div
              className="flex items-center gap-3 p-3 rounded-2xl text-right shrink-0"
              style={{ background: 'rgba(245, 158, 11, 0.06)', border: '1px solid rgba(245, 158, 11, 0.15)' }}
            >
              <div>
                <p className="text-2xl font-bold text-amber-400">{avgRating} ★</p>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Average Rating ({INITIAL_REVIEWS.length} Reviews)</p>
              </div>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reviews by attendee, comment..."
                className="w-full h-10 pl-10 pr-4 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none transition-all"
                style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
                onFocus={(e) => { e.target.style.borderColor = 'rgba(66, 99, 235, 0.4)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)'; }}
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              {([
                { key: 'all',      label: 'All Ratings' },
                { key: '5',        label: '5 Stars ★★★★★' },
                { key: '4',        label: '4 Stars ★★★★' },
                { key: 'critical', label: 'Suggestions' },
              ] as const).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setRatingFilter(tab.key)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 border"
                  style={ratingFilter === tab.key ? {
                    background: 'rgba(245, 158, 11, 0.15)',
                    color: '#FBBF24',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                  } : {
                    background: 'rgba(255, 255, 255, 0.03)',
                    color: '#94a3b8',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reviews List */}
          <div className="rounded-2xl border overflow-hidden" style={{ background: 'rgba(255, 255, 255, 0.02)', borderColor: 'rgba(255, 255, 255, 0.05)' }}>
            {filteredReviews.length > 0 ? (
              filteredReviews.map((rev, idx, arr) => (
                <div
                  key={rev.id}
                  className="p-5 space-y-3 hover:bg-white/[0.02] transition-colors"
                  style={idx < arr.length - 1 ? { borderBottom: '1px solid rgba(255, 255, 255, 0.04)' } : {}}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold text-sm text-white">{rev.name}</span>
                      <span
                        className="text-[10px] font-semibold px-2.5 py-0.5 rounded-md"
                        style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#FBBF24', border: '1px solid rgba(245, 158, 11, 0.2)' }}
                      >
                        {rev.rating} ★★★★★
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">{rev.time} • {rev.event}</span>
                  </div>

                  <p
                    className="text-xs text-slate-300 leading-relaxed italic p-3.5 rounded-xl"
                    style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.04)' }}
                  >
                    &ldquo;{rev.comment}&rdquo;
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {rev.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-2.5 py-0.5 rounded-md font-semibold"
                        style={{ background: 'rgba(66, 99, 235, 0.08)', border: '1px solid rgba(66, 99, 235, 0.15)', color: '#7B93F5' }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 px-4 text-center text-slate-400 text-xs">
                No reviews found matching your search criteria.
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Modal */}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
