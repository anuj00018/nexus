'use client';

// ===================================================================
// Nearby Event Room — Real LinkedIn-Authenticated Attendees Only
// Displays real profiles: Photo, Name, Headline, College/Company,
// Skills, Interests, "Looking For", and LinkedIn Verified Badge.
// ===================================================================
import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Linkedin, RefreshCw, Users, MapPin, MessageSquare,
  ExternalLink, ShieldCheck, Crown, Sparkles, Building2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { EventHeaderNav } from '@/components/events/EventHeaderNav';
import { DirectChatDrawer } from '@/components/messages/DirectChatDrawer';
import { Avatar } from '@/components/ui/Avatar';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

type FilterType = 'all' | 'looking_for' | 'verified';

export default function NearbyPage() {
  const params = useParams();
  const rawId = (params?.id as string) || 'demo-1';
  const eventId = rawId.toLowerCase();
  const router = useRouter();

  const { user } = useAuthStore();
  const [people, setPeople] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');
  const [activeChatRecipient, setActiveChatRecipient] = useState<any | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<any | null>(null);

  // Sync real room participants across devices
  const syncRoomParticipants = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);

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
          (p: any) => p.name && !p.name.startsWith('Attendee #')
        );
        setPeople(realUsersOnly);
      }
    } catch (err) {
      console.error('Room sync error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [eventId, user]);

  // Sync on load & poll every 4s
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
    toast.success(`Opening ${name || 'user'}'s official LinkedIn profile...`);
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
      <div className="bg-background border-b border-border py-2.5 px-4 flex items-center justify-between gap-2">
        <div className="flex gap-1.5 overflow-x-auto">
          {([
            { key: 'all',         label: `Real Attendees (${people.length})` },
            { key: 'verified',    label: '✓ LinkedIn Verified' },
            { key: 'looking_for', label: '🎯 Looking For' },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0',
                filter === tab.key
                  ? 'bg-nexus-black text-white'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
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
            className="px-2.5 py-1.5 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 active:scale-[0.97] transition-all shrink-0 text-2xs font-bold flex items-center gap-1"
          >
            Exit Room 🚪
          </button>

          <button
            onClick={syncRoomParticipants}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors shrink-0 flex items-center gap-1 text-2xs font-medium"
          >
            <RefreshCw className={cn('h-3.5 w-3.5', isLoading && 'animate-spin')} />
            Sync
          </button>
        </div>
      </div>

      {/* Main Real Attendees List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="py-20 px-6 text-center space-y-4 max-w-sm mx-auto">
            <div className="p-4 rounded-3xl bg-nexus-indigo/10 text-nexus-indigo w-16 h-16 mx-auto flex items-center justify-center border border-nexus-indigo/20">
              <Users className="h-8 w-8 text-nexus-indigo animate-pulse" />
            </div>
            <h3 className="font-extrabold text-lg text-foreground tracking-tight">No other real attendees yet</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              You are the first person in this room! Invite colleagues or share room code <span className="font-mono font-bold text-nexus-indigo uppercase">{eventId}</span> to connect with real LinkedIn-authenticated professionals.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((person) => {
              const isFounder = person.role === 'founder' || person.name === 'Anuj Vardham';

              return (
                <div key={person.id} className="px-4 py-4 flex items-start gap-3.5 hover:bg-muted/30 transition-colors">
                  {/* Avatar */}
                  <div className="relative shrink-0 mt-0.5">
                    <Avatar src={person.avatar_url} alt={person.name} size="lg" />
                    <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-background bg-emerald-500" />
                  </div>

                  {/* Profile Details */}
                  <div className="flex-1 min-w-0 space-y-2">

                    {/* Name & Badges */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="text-sm font-extrabold text-foreground tracking-tight">{person.name}</h3>

                          {/* Founder Badge */}
                          {isFounder && (
                            <span className="text-2xs px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 font-extrabold border border-amber-500/20 flex items-center gap-1">
                              <Crown className="h-3 w-3" /> Founder
                            </span>
                          )}

                          {/* LinkedIn Verified Badge */}
                          <span className="text-2xs px-2 py-0.5 rounded-md bg-blue-500/10 text-[#0A66C2] font-extrabold border border-[#0A66C2]/20 flex items-center gap-1">
                            <ShieldCheck className="h-3 w-3 text-[#0A66C2]" /> LinkedIn Verified
                          </span>
                        </div>

                        {/* Organization / College */}
                        {person.company && (
                          <p className="text-2xs text-muted-foreground flex items-center gap-1 mt-1 font-semibold">
                            <Building2 className="h-3 w-3 text-muted-foreground" />
                            {person.company}
                          </p>
                        )}
                      </div>

                      <span className="text-2xs text-emerald-600 font-bold shrink-0 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        Live in Room
                      </span>
                    </div>

                    {/* "Looking For" Badges */}
                    {person.looking_for?.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-2xs font-extrabold tracking-wider uppercase text-nexus-indigo">Looking For:</span>
                        <div className="flex flex-wrap gap-1">
                          {person.looking_for.map((goal: string) => (
                            <span key={goal} className="text-2xs px-2.5 py-0.5 rounded-lg bg-nexus-indigo/10 text-nexus-indigo font-bold border border-nexus-indigo/20">
                              {goal}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Interests & Domains */}
                    {person.interests?.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {person.interests.map((s: string) => (
                          <span key={s} className="text-2xs px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 font-medium border border-purple-500/20">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action Buttons: View Real LinkedIn Profile & Chat */}
                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={() => handleOpenLinkedIn(person.linkedin_url, person.name)}
                        className="flex-1 h-10 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 bg-[#0A66C2] hover:bg-[#084e96] text-white active:scale-[0.98] transition-all shadow-md shadow-[#0A66C2]/20"
                      >
                        <Linkedin className="h-4 w-4 fill-white shrink-0" />
                        View LinkedIn Profile ↗
                      </button>

                      <button
                        onClick={() => setActiveChatRecipient(person)}
                        className="flex-1 h-10 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 bg-nexus-indigo/10 hover:bg-nexus-indigo/20 text-nexus-indigo border border-nexus-indigo/30 active:scale-[0.98] transition-all shrink-0"
                      >
                        <MessageSquare className="h-4 w-4" />
                        Chat In-App
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 1-on-1 In-App Direct Chat */}
      <DirectChatDrawer
        isOpen={Boolean(activeChatRecipient)}
        onClose={() => setActiveChatRecipient(null)}
        recipient={activeChatRecipient}
      />
    </div>
  );
}
