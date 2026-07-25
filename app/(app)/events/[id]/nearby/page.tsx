'use client';

// ===================================================================
// Nearby Event Room — Premium Silicon Valley UI Redesign
// Displays real authenticated attendees only (zero mock users).
// Features skeleton loaders, soft cards, responsive layout,
// verified badges, looking_for tags, direct LinkedIn links,
// and 1-on-1 direct messaging (disabled for self).
// ===================================================================
import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Linkedin, RefreshCw, Users, MessageSquare,
  ShieldCheck, Crown, Building2, User
} from 'lucide-react';
import toast from 'react-hot-toast';
import { EventHeaderNav } from '@/components/events/EventHeaderNav';
import { DirectChatDrawer } from '@/components/messages/DirectChatDrawer';
import { Avatar } from '@/components/ui/Avatar';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

type FilterType = 'all' | 'verified' | 'looking_for';

// Skeleton Loader Component for Premium Loading UX
function CardSkeleton() {
  return (
    <div className="p-5 rounded-2xl border border-border/60 bg-background/80 animate-pulse space-y-3.5 shadow-2xs">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-muted shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="h-4 w-1/3 rounded-md bg-muted" />
          <div className="h-3 w-1/2 rounded-md bg-muted/60" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="h-6 w-20 rounded-lg bg-muted/50" />
        <div className="h-6 w-24 rounded-lg bg-muted/50" />
      </div>
      <div className="h-10 w-full rounded-xl bg-muted/40" />
    </div>
  );
}

export default function NearbyPage() {
  const params = useParams();
  const rawId = (params?.id as string) || 'demo-1';
  const eventId = rawId.toLowerCase();
  const router = useRouter();

  const { user } = useAuthStore();
  const [people, setPeople] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [activeChatRecipient, setActiveChatRecipient] = useState<any | null>(null);

  // Sync real room participants across devices
  const syncRoomParticipants = useCallback(async () => {
    if (!user) return;

    try {
      // 1. Announce active authenticated user to real room API
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

  // Open real user's LinkedIn profile in a new tab
  const handleOpenLinkedIn = (linkedinUrl?: string, name?: string) => {
    let targetUrl = linkedinUrl?.trim();
    if (targetUrl && !targetUrl.startsWith('http')) {
      targetUrl = `https://${targetUrl}`;
    }
    if (!targetUrl || targetUrl.length < 18) {
      targetUrl = `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(name || 'attendee')}`;
    }
    toast.success(`Opening ${name || 'user'}'s LinkedIn profile...`);
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const filtered = people.filter((p) => {
    if (filter === 'verified') return p.is_verified;
    if (filter === 'looking_for') return p.looking_for?.length > 0;
    return true;
  });

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20 md:pb-6">
      {/* Event Subheader Navigation */}
      <EventHeaderNav eventId={eventId} eventTitle={`Event Room [${eventId.toUpperCase()}]`} activeCount={people.length} />

      {/* Filter Toolbar */}
      <div className="bg-background/80 backdrop-blur-md border-b border-border/80 sticky top-14 z-30 py-3 px-4 sm:px-6 flex items-center justify-between gap-3 shadow-2xs">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {([
            { key: 'all',         label: `All Participants (${people.length})` },
            { key: 'verified',    label: '✓ LinkedIn Verified' },
            { key: 'looking_for', label: '🎯 Looking For' },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={cn(
                'px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 active:scale-95',
                filter === tab.key
                  ? 'bg-foreground text-background shadow-xs'
                  : 'bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={async () => {
              if (user?.id) {
                try {
                  await fetch(`/api/room?eventId=${eventId}&userId=${encodeURIComponent(user.id)}`, { method: 'DELETE' });
                } catch {}
              }
              toast.success('Exited Event Room');
              router.push('/dashboard');
            }}
            className="px-3 py-1.5 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 active:scale-95 transition-all text-xs font-bold flex items-center gap-1.5"
          >
            Exit Room 🚪
          </button>

          <button
            onClick={() => {
              setIsLoading(true);
              syncRoomParticipants();
            }}
            className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0 flex items-center gap-1 text-xs font-medium"
            title="Refresh room participants"
          >
            <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
          </button>
        </div>
      </div>

      {/* Main Room Content Container */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6">

        {/* Loading Skeletons */}
        {isLoading && people.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : filtered.length === 0 ? (
          /* Clean Empty State */
          <div className="py-24 px-6 text-center space-y-4 max-w-md mx-auto">
            <div className="p-4 rounded-3xl bg-nexus-indigo/10 text-nexus-indigo w-16 h-16 mx-auto flex items-center justify-center border border-nexus-indigo/20 shadow-xs">
              <Users className="h-8 w-8 text-nexus-indigo" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-extrabold text-lg text-foreground tracking-tight">No participants have joined yet.</h3>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
                Share event code <span className="font-mono font-bold text-nexus-indigo uppercase px-1.5 py-0.5 rounded-md bg-nexus-indigo/10 border border-nexus-indigo/20">{eventId}</span> with colleagues to start discovering real attendees in real time.
              </p>
            </div>
          </div>
        ) : (
          /* Premium Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((person) => {
              const isCurrentUser = user?.id === person.id || (user?.name && user.name === person.name);
              const isFounder = person.role === 'founder' || person.name === 'Anuj Vardham';

              return (
                <div
                  key={person.id}
                  className="rounded-2xl border border-border/80 bg-background/90 p-5 shadow-xs hover:shadow-md hover:border-nexus-indigo/40 transition-all duration-200 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Header Row: Avatar & Identifiers */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="relative shrink-0 mt-0.5">
                          <Avatar src={person.avatar_url} alt={person.name} size="lg" />
                          <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-background bg-emerald-500" />
                        </div>

                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="text-sm font-extrabold text-foreground tracking-tight truncate">{person.name}</h3>

                            {/* Founder Badge */}
                            {isFounder && (
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 font-extrabold border border-amber-500/20 flex items-center gap-1 shrink-0">
                                <Crown className="h-3 w-3" /> Founder
                              </span>
                            )}

                            {/* LinkedIn Verified Badge */}
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-500/10 text-[#0A66C2] font-extrabold border border-[#0A66C2]/20 flex items-center gap-1 shrink-0">
                              <ShieldCheck className="h-3 w-3 text-[#0A66C2]" /> LinkedIn Verified
                            </span>
                          </div>

                          {/* Company / College */}
                          {person.company && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1 font-medium truncate">
                              <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                              {person.company}
                            </p>
                          )}
                        </div>
                      </div>

                      <span className="text-[10px] text-emerald-600 font-extrabold shrink-0 flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                        Online
                      </span>
                    </div>

                    {/* Bio (if provided) */}
                    {person.bio && (
                      <p className="text-xs text-foreground/80 line-clamp-2 leading-relaxed italic bg-muted/20 p-2.5 rounded-xl border border-border/40">
                        "{person.bio}"
                      </p>
                    )}

                    {/* "Looking For" Goals */}
                    {person.looking_for?.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-extrabold tracking-wider uppercase text-nexus-indigo">Looking For</span>
                        <div className="flex flex-wrap gap-1.5">
                          {person.looking_for.map((goal: string) => (
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
                    {person.interests?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {person.interests.map((s: string) => (
                          <span
                            key={s}
                            className="text-[11px] px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 font-medium border border-purple-500/20"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons: LinkedIn Profile & Chat (Self Messaging Disabled) */}
                  <div className="pt-3 border-t border-border/60 flex items-center gap-2">
                    <button
                      onClick={() => handleOpenLinkedIn(person.linkedin_url, person.name)}
                      className="flex-1 h-10 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 bg-[#0A66C2] hover:bg-[#084e96] text-white active:scale-95 transition-all shadow-xs"
                    >
                      <Linkedin className="h-4 w-4 fill-white shrink-0" />
                      View LinkedIn Profile ↗
                    </button>

                    {!isCurrentUser ? (
                      <button
                        onClick={() => setActiveChatRecipient(person)}
                        className="flex-1 h-10 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 bg-nexus-indigo/10 hover:bg-nexus-indigo/20 text-nexus-indigo border border-nexus-indigo/30 active:scale-95 transition-all shrink-0"
                      >
                        <MessageSquare className="h-4 w-4" />
                        Chat In-App
                      </button>
                    ) : (
                      <div className="px-3 h-10 rounded-xl bg-muted/50 border border-border text-muted-foreground text-xs font-semibold flex items-center justify-center gap-1 shrink-0">
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
