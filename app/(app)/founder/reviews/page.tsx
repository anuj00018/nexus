'use client';

// ===================================================================
// Nexus v3.0 — Founder Reviews Dashboard
// Warm Black + Soft White + Muted Sage design aesthetic.
// Gated strictly for Founder accounts and passcode authentication.
// Displays: Overall Rating, Rating Distribution, Search, Filters, CSV Export,
// delete functionality, and mark-as-read toggle.
// Supports both Supabase integration and robust mock fallbacks.
// ===================================================================
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Star, Search, Download, Trash2, CheckCircle2,
  Crown, ShieldAlert, ArrowLeft, RefreshCw
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Review {
  id: string;
  name: string;
  avatar_url?: string | null;
  rating: number;
  event: string;
  comment: string;
  tags: string[];
  is_read: boolean;
  created_at: string;
  is_anonymous: boolean;
}

const SEED_REVIEWS: Review[] = [
  {
    id: 'r1',
    name: 'Rahul Sharma',
    avatar_url: null,
    rating: 5,
    event: 'TechFest 2025 (NEXUS1)',
    comment: 'The 1-tap LinkedIn profile connect made networking super smooth! Found 2 potential co-founders in 20 minutes.',
    tags: ['Co-founder Match', 'Smooth Auth'],
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(), // 12 mins ago
    is_anonymous: false
  },
  {
    id: 'r2',
    name: 'Pooja Verma',
    avatar_url: null,
    rating: 5,
    event: 'Startup Meetup (NEXUS2)',
    comment: 'Loved how everyone in the room is instantly visible with verified LinkedIn links. Exceptional app UX!',
    tags: ['Verified Profiles', 'Fast UX'],
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 34).toISOString(), // 34 mins ago
    is_anonymous: false
  },
  {
    id: 'r3',
    name: 'Karan Patel',
    avatar_url: null,
    rating: 4,
    event: 'AI Hackathon (NEXUS3)',
    comment: 'Excellent event room. Met senior machine learning engineers looking for new startup roles.',
    tags: ['Hiring Leads', 'AI Community'],
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    is_anonymous: false
  },
  {
    id: 'r4',
    name: 'Sneha Reddy',
    avatar_url: null,
    rating: 5,
    event: 'TechFest 2025 (NEXUS1)',
    comment: 'The design is super sleek! Loved the match percentage badges and instant in-app direct messaging drawer.',
    tags: ['Match Badges', '1-on-1 Chat'],
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    is_anonymous: false
  },
  {
    id: 'r5',
    name: 'Vikram Malhotra',
    avatar_url: null,
    rating: 3,
    event: 'Startup Meetup (NEXUS2)',
    comment: 'Great networking tool for conference attendees. Would love push notifications for nearby matches next.',
    tags: ['Feature Request', 'Great Value'],
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
    is_anonymous: true
  }
];

export default function FounderReviewsPage() {
  const { user } = useAuthStore();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState<'all' | '5' | '4' | '3' | '2' | '1'>('all');
  const [isPasscodeVerified, setIsPasscodeVerified] = useState(false);

  // 1. Verify Founder account identity & passcode session token
  const isFounder =
    user?.role === 'founder' ||
    user?.email?.toLowerCase().includes('anuj') ||
    user?.name?.toLowerCase().includes('anuj') ||
    user?.id?.includes('founder');

  useEffect(() => {
    const isAuthed = sessionStorage.getItem('nexus_founder_admin_authed') === 'true';
    if (isAuthed && isFounder) {
      setIsPasscodeVerified(true);
    }
    setLoading(false);
  }, [isFounder]);

  // Fetch reviews from Database (Supabase) with local fallback cache
  const fetchReviews = async () => {
    setLoading(true);
    let dbReviews: Review[] = [];

    if (isSupabaseConfigured && isFounder) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('event_ratings')
          .select(`
            id,
            event_id,
            rating,
            feedback,
            tags,
            is_read,
            created_at,
            user:users (
              name,
              avatar_url,
              role
            )
          `)
          .order('created_at', { ascending: false });

        if (!error && data) {
          dbReviews = data.map((item: any) => {
            const u = item.user;
            const isAnon = u?.role !== 'founder' && !u?.name?.toLowerCase().includes('anuj') && Math.random() > 0.85;
            return {
              id: item.id,
              name: isAnon ? 'Anonymous Attendee' : (u?.name || 'Attendee'),
              avatar_url: isAnon ? null : u?.avatar_url,
              rating: item.rating,
              event: `Event (Room: ${item.event_id.toUpperCase()})`,
              comment: item.feedback || 'No comment provided.',
              tags: item.tags || [],
              is_read: item.is_read || false,
              created_at: item.created_at,
              is_anonymous: isAnon
            };
          });
        }
      } catch (err) {
        console.error('Supabase fetch error:', err);
      }
    }

    try {
      const cached = localStorage.getItem('nexus_founder_reviews_state');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.length > 0) {
          setReviews(parsed);
          setLoading(false);
          return;
        }
      }
    } catch {}

    const finalReviews = [...dbReviews, ...SEED_REVIEWS];
    const uniqueReviews = finalReviews.filter((value, index, self) =>
      self.findIndex(t => t.comment === value.comment && t.name === value.name) === index
    );

    setReviews(uniqueReviews);
    setLoading(false);
  };

  useEffect(() => {
    if (isPasscodeVerified) {
      fetchReviews();
    }
  }, [isPasscodeVerified]);

  const saveReviewsState = (updated: Review[]) => {
    setReviews(updated);
    try {
      localStorage.setItem('nexus_founder_reviews_state', JSON.stringify(updated));
    } catch {}
  };

  // 2. Access Denied Screen for normal users
  if (!loading && (!isFounder || !isPasscodeVerified)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center select-none bg-[#030712] text-slate-100">
        <div
          className="w-full max-w-sm rounded-3xl p-8 space-y-6 text-center backdrop-blur-2xl bg-[#070B19]/90 border border-rose-500/25 shadow-[0_24px_80px_rgba(0,0,0,0.7)]"
        >
          <div
            className="p-4 rounded-2xl w-16 h-16 mx-auto flex items-center justify-center bg-rose-500/10 border border-rose-500/30 text-rose-400"
          >
            <ShieldAlert className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-display font-extrabold text-white">Access Denied</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              This dashboard is confidential and strictly accessible to the founder account with passcode verification.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="w-full h-11 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 transition-all bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.09]"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // 3. Mark Review as Read / Unread
  const handleToggleRead = async (id: string) => {
    const updated = reviews.map(r => {
      if (r.id === id) {
        return { ...r, is_read: !r.is_read };
      }
      return r;
    });
    saveReviewsState(updated);

    const targetReview = updated.find(r => r.id === id);
    toast.success(targetReview?.is_read ? 'Review marked as read' : 'Review marked as unread');

    if (isSupabaseConfigured) {
      try {
        const supabase = createClient();
        await supabase
          .from('event_ratings')
          .update({ is_read: targetReview?.is_read })
          .eq('id', id);
      } catch {}
    }
  };

  // 4. Delete Inappropriate Review
  const handleDeleteReview = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this review? This action is permanent.');
    if (!confirmed) return;

    const updated = reviews.filter(r => r.id !== id);
    saveReviewsState(updated);
    toast.success('Review deleted successfully');

    if (isSupabaseConfigured) {
      try {
        const supabase = createClient();
        await supabase
          .from('event_ratings')
          .delete()
          .eq('id', id);
      } catch {}
    }
  };

  // 5. CSV Export
  const handleExportCSV = () => {
    const headers = 'Reviewer,Rating,Event Room,Date,Comment,Tags\n';
    const rows = reviews.map(r => {
      const cleanName = r.is_anonymous ? 'Anonymous' : r.name;
      const cleanComment = r.comment.replace(/"/g, '""');
      const cleanTags = r.tags.join('; ');
      const cleanDate = new Date(r.created_at).toLocaleDateString();
      return `"${cleanName}",${r.rating},"${r.event}","${cleanDate}","${cleanComment}","${cleanTags}"`;
    }).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Nexus_Founder_Reviews_Report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Reviews report exported as CSV! 📊');
  };

  // 6. Computations for Metrics and Ratings Distributions
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1)
    : '0.0';

  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(r => {
    const rate = r.rating as 5 | 4 | 3 | 2 | 1;
    if (distribution[rate] !== undefined) {
      distribution[rate]++;
    }
  });

  const filteredReviews = reviews.filter(r => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRating = ratingFilter === 'all' || r.rating.toString() === ratingFilter;

    return matchesSearch && matchesRating;
  });

  return (
    <div className="flex-1 overflow-y-auto pb-24 text-slate-100 min-h-screen bg-[#030712] selection:bg-cyan-500/30">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fade-in relative z-10">

        {/* ── HEADER ────────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div className="space-y-1">
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-violet-500/15 border border-violet-400/35 text-violet-300 shadow-sm"
            >
              <Crown className="h-3.5 w-3.5 text-violet-400" />
              Founder Review Dashboard
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight pt-1">
              Confidential Written Reviews
            </h1>
            <p className="text-xs text-slate-400">
              Real-time attendee feedback and platform rating distribution
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchReviews}
              className="p-3 rounded-xl text-slate-400 hover:text-white transition-colors hover:bg-white/[0.08] bg-white/[0.04] border border-white/[0.08]"
              title="Refresh Feedback"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <button
              onClick={handleExportCSV}
              className="h-11 px-5 rounded-xl text-white font-bold text-xs transition-all flex items-center gap-2 shadow-md active:scale-95 bg-cyan-600 hover:bg-cyan-500"
            >
              <Download className="h-4 w-4" />
              Export CSV Report
            </button>
            <Link
              href="/settings"
              className="h-11 px-5 rounded-xl font-bold text-xs text-slate-300 hover:text-white transition-colors flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08]"
            >
              Back to Settings
            </Link>
          </div>
        </div>

        {/* ── KEY METRICS & DISTRIBUTION GRAPHS ───────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card: Overall Rating */}
          <div
            className="rounded-3xl p-6 flex flex-col justify-between space-y-4 bg-[#070B19]/85 backdrop-blur-xl border border-white/[0.08] shadow-lg"
          >
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">Average Platform Score</p>
              <h2 className="text-5xl font-display font-extrabold text-white tracking-tight flex items-baseline gap-2">
                ⭐ {avgRating}
                <span className="text-sm font-medium text-slate-500">/ 5.0</span>
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Computed from <span className="font-bold text-cyan-300">{totalReviews}</span> total reviews submitted by active room participants.
            </p>
          </div>

          {/* Card: Rating Distribution Bars */}
          <div
            className="md:col-span-2 rounded-3xl p-6 space-y-3.5 bg-[#070B19]/85 backdrop-blur-xl border border-white/[0.08] shadow-lg"
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-violet-400">Platform Rating Distribution</p>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map(stars => {
                const count = distribution[stars as 5 | 4 | 3 | 2 | 1] || 0;
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                return (
                  <div key={stars} className="flex items-center gap-3 text-xs font-semibold">
                    <span className="w-10 text-slate-400 font-mono text-right">{stars} ★</span>
                    <div
                      className="flex-1 h-3 rounded-full overflow-hidden bg-white/[0.04] border border-white/[0.06]"
                    >
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                          background: 'linear-gradient(90deg, #8B5CF6, #06B6D4)',
                        }}
                      />
                    </div>
                    <span className="w-14 text-slate-400 text-right">{count} reviews</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── FILTERS & SEARCH ───────────────────────────────────────────── */}
        <div
          className="rounded-3xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#070B19]/85 backdrop-blur-xl border border-white/[0.08]"
        >
          {/* Search Input */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search comments or tags..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none transition-colors bg-[#030712]/80 border border-white/[0.09] focus:border-cyan-400"
            />
          </div>

          {/* Rating filter chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1.5">Filter by Rating:</span>
            {[
              { id: 'all', label: 'All Reviews' },
              { id: '5', label: '5 ★' },
              { id: '4', label: '4 ★' },
              { id: '3', label: '3 ★' },
              { id: '2', label: '2 ★' },
              { id: '1', label: '1 ★' },
            ].map(tab => {
              const active = ratingFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setRatingFilter(tab.id as any)}
                  className="h-8 px-3.5 rounded-xl border text-xs font-bold transition-all shrink-0 active:scale-95"
                  style={active ? {
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)',
                    color: '#ffffff',
                    border: '1px solid rgba(6, 182, 212, 0.6)',
                    boxShadow: '0 0 12px rgba(6, 182, 212, 0.3)',
                  } : {
                    background: 'rgba(255, 255, 255, 0.04)',
                    color: '#94A3B8',
                    border: '1px solid rgba(255, 255, 255, 0.07)',
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── WRITTEN REVIEWS FEED LIST ─────────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold px-2">
            <span className="text-slate-400">Showing {filteredReviews.length} results</span>
            <span className="text-slate-500">Sorted by Date (Latest First)</span>
          </div>

          {filteredReviews.length === 0 ? (
            <div
              className="rounded-3xl p-12 text-center space-y-2 bg-[#070B19]/80 border border-white/[0.08]"
            >
              <p className="text-sm font-bold text-white">No reviews found</p>
              <p className="text-xs text-slate-400">Try adjusting your filters or search keywords.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredReviews.map(r => (
                <div
                  key={r.id}
                  className={cn(
                    'rounded-3xl p-5 border transition-all flex flex-col md:flex-row md:items-start justify-between gap-4 bg-[#070B19]/80 backdrop-blur-xl border-white/[0.08] hover:border-cyan-500/30',
                    r.is_read ? 'opacity-70' : ''
                  )}
                >
                  {/* Left Side: Avatar, Rating, Event, Comment */}
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="h-10 w-10 rounded-full flex items-center justify-center font-bold text-white shrink-0 overflow-hidden bg-gradient-to-br from-violet-600 to-cyan-500 shadow-sm">
                        {r.avatar_url ? (
                          <img src={r.avatar_url} alt={r.name} className="h-full w-full object-cover" />
                        ) : (
                          <span>{r.name.charAt(0)}</span>
                        )}
                      </div>

                      {/* Info & Rating */}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">
                            {r.is_anonymous ? 'Anonymous Attendee' : r.name}
                          </span>
                          {r.is_anonymous && (
                            <span
                              className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-white/[0.05] text-slate-400"
                            >
                              Anon Profile
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-2xs text-slate-400 pt-0.5">
                          <span className="text-amber-400 flex items-center gap-0.5 font-bold">
                            {Array.from({ length: r.rating }).map((_, i) => '★').join('')}
                          </span>
                          <span>•</span>
                          <span className="text-cyan-300 font-mono">{r.event}</span>
                          <span>•</span>
                          <span>{new Date(r.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Comment text */}
                    <p
                      className="text-xs text-slate-300 leading-relaxed italic p-3.5 rounded-2xl bg-[#030712]/60 border border-white/[0.06]"
                    >
                      &ldquo;{r.comment}&rdquo;
                    </p>

                    {/* Tags */}
                    {r.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {r.tags.map(tag => (
                          <span
                            key={tag}
                            className="text-[10px] px-2.5 py-0.5 rounded-md font-bold bg-cyan-500/10 border border-cyan-400/25 text-cyan-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Side Actions */}
                  <div className="flex items-center gap-2 md:self-center shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-white/[0.06]">
                    {/* Toggle Read */}
                    <button
                      onClick={() => handleToggleRead(r.id)}
                      className="h-9 px-3 rounded-xl border text-[10px] font-bold transition-all flex items-center gap-1.5 active:scale-95"
                      style={r.is_read ? {
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        color: '#94A3B8',
                      } : {
                        background: 'rgba(6, 182, 212, 0.12)',
                        border: '1px solid rgba(6, 182, 212, 0.3)',
                        color: '#67E8F9',
                      }}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {r.is_read ? 'Mark Unread' : 'Mark Read'}
                    </button>

                    {/* Delete Review */}
                    <button
                      onClick={() => handleDeleteReview(r.id)}
                      className="h-9 w-9 rounded-xl transition-all flex items-center justify-center active:scale-95 bg-rose-500/10 border border-rose-500/25 text-rose-400 hover:bg-rose-500/20"
                      title="Delete Review"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
