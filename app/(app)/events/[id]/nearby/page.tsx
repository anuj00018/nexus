'use client';

// ===================================================================
// Nexus v3.0 — Event Room Command Center
// Deep navy glassmorphism, attendee cards, match percentage badges,
// real participant syncing, skeleton loaders, and 1-on-1 direct chat.
// Preserves: All room APIs, real-time sync, filtering, chat state.
// ===================================================================
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Linkedin, RefreshCw, Users, MessageSquare,
  ShieldCheck, Crown, Building2, User, Search,
  Sparkles, LogOut, Share2, Filter
} from 'lucide-react';
import toast from 'react-hot-toast';
import { EventHeaderNav } from '@/components/events/EventHeaderNav';
import { DirectChatDrawer } from '@/components/messages/DirectChatDrawer';
import { Avatar } from '@/components/ui/Avatar';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

type FilterType = 'all' | 'verified' | 'cofounder' | 'hiring' | 'tech';

// Premium Skeleton Loader for Room Loading State
function CardSkeleton() {
  return (
    <div
      className="p-6 rounded-2xl animate-pulse space-y-4 shadow-xl"
      style={{
        background: 'rgba(255, 255, 255, 0.02)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-full bg-slate-800/60 shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-4 w-32 rounded-md bg-slate-800/60" />
            <div className="h-3 w-24 rounded-md bg-slate-800/40" />
          </div>
        </div>
        <div className="h-5 w-16 rounded-full bg-slate-800/60" />
      </div>
      <div className="flex gap-2">
        <div className="h-6 w-20 rounded-lg bg-slate-800/40" />
        <div className="h-6 w-24 rounded-lg bg-slate-800/40" />
      </div>
      <div className="flex gap-2.5 pt-2">
        <div className="h-10 flex-1 rounded-xl bg-slate-800/40" />
        <div className="h-10 flex-1 rounded-xl bg-slate-800/40" />
      </div>
    </div>
  );
}

export default function NearbyPageV2() {
  const params = useParams();
  const rawId = (params?.id as string) || 'demo-1';
  const eventId = rawId.toLowerCase();
  const router = useRouter();

  const { user } = useAuthStore();
  const [people, setPeople] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [activeChatRecipient, setActiveChatRecipient] = useState<any | null>(null);

  // Sync real room participants across devices
  const syncRoomParticipants = useCallback(async () => {
    if (!user) return;

    try {
      // 1. Announce active authenticated user to room API
      await fetch('/api/room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, user }),
      });

      // 2. Fetch all real participants in this room
      const res = await fetch(`/api/room?eventId=${eventId}`);
      const data = await res.json();

      if (data.success && Array.isArray(data.participants)) {
        // Filter out any invalid placeholder users
        const realUsersOnly = data.participants.filter(
          (p: any) => p.name && !p.name.startsWith('Attendee #') && !p.name.startsWith('Demo User')
        );
        setPeople(realUsersOnly);
      }
    } catch (err) {
      console.error('Room sync error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [eventId, user]);

  // Initial sync & auto-polling every 4 seconds
  useEffect(() => {
    syncRoomParticipants();
    const interval = setInterval(syncRoomParticipants, 4000);

    const activeUserId = user?.id || 'guest-user';

    const handleLeaveRoom = () => {
      const leaveUrl = `/api/room?eventId=${eventId}&userId=${encodeURIComponent(activeUserId)}`;
      if (navigator.sendBeacon) {
        navigator.sendBeacon(leaveUrl);
      } else {
        fetch(leaveUrl, { method: 'DELETE' });
      }
    };

    window.addEventListener('beforeunload', handleLeaveRoom);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleLeaveRoom);
      handleLeaveRoom();
    };
  }, [syncRoomParticipants, eventId, user]);

  // Build the canonical LinkedIn profile href at render time.
  // Rendered as a plain <a href> — never window.open() — so that
  // Android App Links / iOS Universal Links resolve natively.
  const getLinkedInHref = (linkedinUrl?: string | null, name?: string): string => {
    let url = linkedinUrl?.trim() || '';
    if (url && !url.startsWith('http')) {
      url = `https://${url}`;
    }
    if (url && /^https?:\/\/(www\.)?linkedin\.com\/in\/.+/i.test(url)) {
      return url;
    }
    return `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(name || 'attendee')}`;
  };

  // Calculate intelligent Match Percentage based on common interests & goals
  const calculateMatchScore = useCallback((attendee: any) => {
    if (!user) return 85;
    if (user.id === attendee.id) return 100;

    let score = 75;
    const userGoals = user.looking_for || [];
    const attendeeGoals = attendee.looking_for || [];
    const commonGoals = userGoals.filter((g: string) => attendeeGoals.includes(g));
    score += commonGoals.length * 8;

    const userInterests = user.interests || [];
    const attendeeInterests = attendee.interests || [];
    const commonInterests = userInterests.filter((i: string) => attendeeInterests.includes(i));
    score += commonInterests.length * 6;

    return Math.min(99, score);
  }, [user]);

  // Filtered & Searched Attendees
  const filteredPeople = useMemo(() => {
    return people.filter((p) => {
      const matchesSearch =
        !searchQuery.trim() ||
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.looking_for?.some((g: string) => g.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.interests?.some((i: string) => i.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (filter === 'verified') return p.is_verified;
      if (filter === 'cofounder') return p.looking_for?.some((g: string) => g.toLowerCase().includes('founder'));
      if (filter === 'hiring') return p.looking_for?.some((g: string) => g.toLowerCase().includes('hiring') || g.toLowerCase().includes('job'));
      if (filter === 'tech') return p.interests?.some((i: string) => i.toLowerCase().includes('ai') || i.toLowerCase().includes('saas') || i.toLowerCase().includes('tech'));

      return true;
    });
  }, [people, searchQuery, filter]);

  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-6" style={{ background: 'hsl(222, 47%, 5%)' }}>
      {/* Event Subheader Navigation */}
      <EventHeaderNav eventId={eventId} eventTitle={`Event Room [${eventId.toUpperCase()}]`} activeCount={people.length} />

      {/* Sticky Search & Filter Toolbar */}
      <div
        className="backdrop-blur-xl border-b sticky top-14 z-30 py-3.5 px-4 sm:px-6 space-y-3 shadow-xl"
        style={{
          background: 'rgba(10, 15, 30, 0.85)',
          borderColor: 'rgba(255, 255, 255, 0.06)',
        }}
      >
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">

          {/* Search Input Bar */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, company, goals..."
              className="w-full h-10 pl-10 pr-4 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none transition-all duration-200"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
              onFocus={(e) => { e.target.style.borderColor = 'rgba(66, 99, 235, 0.4)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)'; }}
            />
          </div>

          {/* Filter Chips Toolbar */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none w-full sm:w-auto">
            {([
              { key: 'all', label: `All (${people.length})` },
              { key: 'verified', label: '✓ Verified' },
              { key: 'cofounder', label: '🤝 Co-founders' },
              { key: 'hiring', label: '👔 Hiring' },
              { key: 'tech', label: '⚡ AI & Tech' },
            ] as const).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={cn(
                  'px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 active:scale-95 border'
                )}
                style={filter === tab.key ? {
                  background: 'linear-gradient(135deg, #4263EB, #3451D1)',
                  color: '#ffffff',
                  borderColor: 'rgba(66, 99, 235, 0.5)',
                  boxShadow: '0 4px 12px rgba(66, 99, 235, 0.25)',
                } : {
                  background: 'rgba(255, 255, 255, 0.03)',
                  color: '#94a3b8',
                  borderColor: 'rgba(255, 255, 255, 0.06)',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2 shrink-0 ml-auto sm:ml-0">
            <button
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success('Room link copied to clipboard!');
                }
              }}
              className="p-2 rounded-xl text-slate-300 transition-colors shrink-0 hover:bg-white/[0.06]"
              style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}
              title="Share Room Link"
            >
              <Share2 className="h-4 w-4" />
            </button>

            <button
              onClick={async () => {
                if (user?.id) {
                  try {
                    await fetch(`/api/room?eventId=${eventId}&userId=${encodeURIComponent(user.id)}`, { method: 'DELETE' });
                  } catch { }
                }
                toast.success('Exited Event Room');
                router.push('/dashboard');
              }}
              className="px-3.5 py-1.5 rounded-xl active:scale-95 transition-all text-xs font-semibold flex items-center gap-1.5"
              style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.15)',
                color: '#F87171',
              }}
            >
              <LogOut className="h-3.5 w-3.5" /> Exit Room
            </button>

            <button
              onClick={() => {
                setIsLoading(true);
                syncRoomParticipants();
              }}
              className="p-2 rounded-xl text-slate-300 transition-colors shrink-0 hover:bg-white/[0.06]"
              style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}
              title="Refresh Room"
            >
              <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
            </button>
          </div>

        </div>
      </div>

      {/* Main Room Grid Container */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">

        {/* Loading Skeletons */}
        {isLoading && people.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : filteredPeople.length === 0 ? (
          /* Clean Minimal Empty State */
          <div className="py-24 px-6 text-center space-y-4 max-w-md mx-auto animate-fade-in">
            <div
              className="p-4 rounded-3xl w-16 h-16 mx-auto flex items-center justify-center"
              style={{ background: 'rgba(66, 99, 235, 0.08)', border: '1px solid rgba(66, 99, 235, 0.15)' }}
            >
              <Users className="h-8 w-8 text-indigo-400" style={{ color: '#4263EB' }} />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-lg text-white tracking-tight">No matching participants found</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                Share event code <span className="font-mono font-bold uppercase px-2 py-0.5 rounded" style={{ background: 'rgba(66, 99, 235, 0.1)', color: '#7B93F5' }}>{eventId}</span> with colleagues to start networking in real time.
              </p>
            </div>
          </div>
        ) : (
          /* Premium Attendee Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredPeople.map((person) => {
              const isCurrentUser = user?.id === person.id || (user?.name && user.name === person.name);
              const isFounder = person.role === 'founder' || person.name === 'Anuj Vardham';
              const matchScore = calculateMatchScore(person);

              return (
                <div
                  key={person.id}
                  className="rounded-2xl p-6 shadow-xl transition-all duration-300 backdrop-blur-xl flex flex-col justify-between space-y-5 hover:-translate-y-1"
                  style={{
                    background: 'rgba(255, 255, 255, 0.025)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(66, 99, 235, 0.2)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(66, 99, 235, 0.06)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.06)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2)';
                  }}
                >
                  <div className="space-y-4">
                    {/* Header Row: Avatar, Name, Badges & Match % */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3.5 min-w-0">
                        <div className="relative shrink-0 mt-0.5">
                          <Avatar src={person.avatar_url} alt={person.name} size="lg" />
                          <span
                            className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500"
                            style={{ border: '2px solid hsl(222, 47%, 5%)' }}
                          />
                        </div>

                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="text-base font-bold text-white tracking-tight truncate">{person.name}</h3>

                            {/* Founder Badge */}
                            {isFounder && (
                              <span
                                className="text-[10px] px-2 py-0.5 rounded-md font-semibold flex items-center gap-1 shrink-0"
                                style={{
                                  background: 'rgba(245, 158, 11, 0.1)',
                                  border: '1px solid rgba(245, 158, 11, 0.2)',
                                  color: '#FBBF24',
                                }}
                              >
                                <Crown className="h-3 w-3" /> Founder
                              </span>
                            )}

                            {/* LinkedIn Verified Badge */}
                            <span
                              className="text-[10px] px-2 py-0.5 rounded-md font-semibold flex items-center gap-1 shrink-0"
                              style={{
                                background: 'rgba(56, 189, 248, 0.08)',
                                border: '1px solid rgba(56, 189, 248, 0.15)',
                                color: '#38bdf8',
                              }}
                            >
                              <ShieldCheck className="h-3 w-3 text-sky-400" /> Verified
                            </span>
                          </div>

                          {/* Company / Organization */}
                          {person.company && (
                            <p className="text-xs text-slate-400 flex items-center gap-1.5 font-medium truncate">
                              <Building2 className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                              {person.company}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Match Percentage Badge */}
                      <div
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0"
                        style={{
                          background: 'rgba(66, 99, 235, 0.08)',
                          border: '1px solid rgba(66, 99, 235, 0.15)',
                          color: '#7B93F5',
                        }}
                      >
                        <Sparkles className="h-3 w-3" style={{ color: '#4263EB' }} />
                        {matchScore}% Match
                      </div>
                    </div>

                    {/* Bio (if provided) */}
                    {person.bio && (
                      <p
                        className="text-xs text-slate-300 line-clamp-2 leading-relaxed italic p-3 rounded-xl"
                        style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.04)' }}
                      >
                        &ldquo;{person.bio}&rdquo;
                      </p>
                    )}

                    {/* "Looking For" Goals */}
                    {person.looking_for?.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-semibold tracking-widest uppercase block" style={{ color: '#4263EB' }}>Looking For</span>
                        <div className="flex flex-wrap gap-1.5">
                          {person.looking_for.map((goal: string) => (
                            <span
                              key={goal}
                              className="text-xs px-2.5 py-1 rounded-lg font-medium"
                              style={{
                                background: 'rgba(66, 99, 235, 0.08)',
                                border: '1px solid rgba(66, 99, 235, 0.15)',
                                color: '#7B93F5',
                              }}
                            >
                              {goal}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Domain Interests */}
                    {person.interests?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {person.interests.map((s: string) => (
                          <span
                            key={s}
                            className="text-[11px] px-2.5 py-0.5 rounded-md font-medium"
                            style={{
                              background: 'rgba(139, 92, 246, 0.08)',
                              border: '1px solid rgba(139, 92, 246, 0.15)',
                              color: '#A78BFA',
                            }}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons: LinkedIn Profile & Chat (Self Messaging Disabled) */}
                  <div className="pt-4 flex items-center gap-2.5" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <a
                      href={getLinkedInHref(person.linkedin_url, person.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        const finalUrl = getLinkedInHref(person.linkedin_url, person.name);
                        console.log('[LinkedIn Debug Trace]:', {
                          attendeeId: person.id,
                          attendeeName: person.name,
                          dbLinkedinUrl: person.linkedin_url,
                          finalUrlOpened: finalUrl,
                        });
                      }}
                      className="flex-1 h-11 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 text-white active:scale-95 transition-all shadow-md no-underline"
                      style={{
                        background: '#0A66C2',
                        boxShadow: '0 4px 16px rgba(10, 102, 194, 0.25)',
                      }}
                    >
                      <Linkedin className="h-4 w-4 fill-white shrink-0" />
                      LinkedIn Profile ↗
                    </a>

                    {!isCurrentUser ? (
                      <button
                        onClick={() => setActiveChatRecipient(person)}
                        className="flex-1 h-11 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shrink-0"
                        style={{
                          background: 'rgba(66, 99, 235, 0.08)',
                          border: '1px solid rgba(66, 99, 235, 0.15)',
                          color: '#7B93F5',
                        }}
                      >
                        <MessageSquare className="h-4 w-4" />
                        Chat In-App
                      </button>
                    ) : (
                      <div
                        className="px-4 h-11 rounded-xl text-slate-400 text-xs font-semibold flex items-center justify-center gap-1.5 shrink-0"
                        style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.04)' }}
                      >
                        <User className="h-3.5 w-3.5" />
                        You
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 1-on-1 In-App Messaging Drawer */}
      <DirectChatDrawer
        isOpen={Boolean(activeChatRecipient)}
        onClose={() => setActiveChatRecipient(null)}
        recipient={activeChatRecipient}
      />
    </div>
  );
}
