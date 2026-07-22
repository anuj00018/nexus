'use client';

// ===================================================================
// Nearby People Page — Global Real-Time Cross-Device Attendee Sync
// Syncs attendees live across all phones & laptops!
// Each attendee card displays their typed LinkedIn link & direct profile button.
// ===================================================================
import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Linkedin, RefreshCw, Users, MapPin, Wifi, WifiOff,
  Star, Zap, Filter, MessageSquare, ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';
import { EventHeaderNav } from '@/components/events/EventHeaderNav';
import { DirectChatDrawer } from '@/components/messages/DirectChatDrawer';
import { AttendeeIntentModal } from '@/components/events/AttendeeIntentModal';
import { Avatar } from '@/components/ui/Avatar';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

type FilterType = 'all' | 'matches' | 'available';

export default function NearbyPage() {
  const params = useParams();
  const rawId = (params?.id as string) || 'demo-1';
  const eventId = rawId.toLowerCase();
  const router = useRouter();

  const { user } = useAuthStore();
  const [people, setPeople] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [filter, setFilter] = useState<FilterType>('all');
  const [activeChatRecipient, setActiveChatRecipient] = useState<any | null>(null);
  const [renderedLimit, setRenderedLimit] = useState<number>(50);
  const [isIntentModalOpen, setIsIntentModalOpen] = useState(false);

  // Announce user presence & fetch all live room participants across all devices
  const syncRoomParticipants = useCallback(async () => {
    setIsLoading(true);

    const activeUser = user || {
      id: `user-guest-${Date.now()}`,
      name: 'Guest Attendee',
      headline: 'Event Attendee',
      linkedin_url: 'https://www.linkedin.com',
      skills: ['Networking'],
    };

    try {
      // 1. Announce current user to global room API
      await fetch('/api/room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, user: activeUser }),
      });

      // 2. Save active user to local cache for instant multi-tab fallback
      try {
        const cacheKey = `nexus_global_room_${eventId}`;
        const localCached = JSON.parse(localStorage.getItem(cacheKey) || '[]');
        if (!localCached.some((p: any) => p.name === activeUser.name)) {
          localCached.push(activeUser);
          localStorage.setItem(cacheKey, JSON.stringify(localCached));
        }
      } catch {}

      // 3. Fetch all participants currently in this room across all devices
      const res = await fetch(`/api/room?eventId=${eventId}`);
      const data = await res.json();

      let mergedList: any[] = [];
      if (data.success && Array.isArray(data.participants)) {
        mergedList = [...data.participants];
      }

      // Merge with local cache fallback
      try {
        const cacheKey = `nexus_global_room_${eventId}`;
        const localCached = JSON.parse(localStorage.getItem(cacheKey) || '[]');
        localCached.forEach((item: any) => {
          if (!mergedList.some((m) => m.name === item.name || m.id === item.id)) {
            mergedList.push({
              id: item.id || `user-${Date.now()}`,
              name: item.name,
              headline: item.headline || 'Event Attendee',
              avatar_url: item.avatar_url,
              linkedin_url: item.linkedin_url || `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(item.name)}`,
              skills: item.skills || ['Networking'],
              availability: 'available',
              distance_m: 5,
              interest_overlap: 2,
            });
          }
        });
      } catch {}

      setPeople(mergedList);
    } catch (err) {
      console.error('Room sync error:', err);
    } finally {
      setLastUpdated(new Date());
      setIsLoading(false);
    }
  }, [eventId, user]);

  // Initial sync & auto-refresh every 3 seconds for instant multi-phone updates
  useEffect(() => {
    syncRoomParticipants();
    const interval = setInterval(syncRoomParticipants, 3000);

    const activeUserId = user?.id || `user-guest-${user?.name ? user.name.toLowerCase().replace(/\s+/g, '-') : 'guest'}`;

    // Clean exit when tab closes or user leaves room page
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

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 300) {
      setRenderedLimit((prev) => (prev < people.length ? prev + 50 : prev));
    }
  };

  // Open exact typed LinkedIn profile URL in new tab
  const openLinkedInProfile = (personName: string, linkedinUrl?: string) => {
    let targetUrl = linkedinUrl?.trim();
    if (targetUrl && !targetUrl.startsWith('http')) {
      targetUrl = `https://${targetUrl}`;
    }
    if (!targetUrl || targetUrl === 'https://www.linkedin.com' || targetUrl.length < 18) {
      targetUrl = `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(personName)}`;
    }
    toast.success(`Opening ${personName}'s LinkedIn Profile...`);
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const filtered = people.filter((p) => {
    if (filter === 'matches') return p.interest_overlap > 0;
    if (filter === 'available') return p.availability === 'available';
    return true;
  });

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20 md:pb-6">
      {/* Event Subheader Navigation */}
      <EventHeaderNav eventId={eventId} eventTitle={`Event Room [${eventId.toUpperCase()}]`} activeCount={people.length} />

      {/* Filter bar */}
      <div className="bg-background border-b border-border py-2.5 px-4 flex items-center justify-between gap-2">
        <div className="flex gap-1.5 overflow-x-auto">
          {([
            { key: 'all',       label: `All Joined (${people.length})` },
            { key: 'matches',   label: `✨ Matches (${people.length})` },
            { key: 'available', label: '🟢 Available' },
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
            onClick={() => setIsIntentModalOpen(true)}
            className="px-2.5 py-1.5 rounded-lg bg-nexus-indigo/10 text-nexus-indigo border border-nexus-indigo/20 hover:bg-nexus-indigo/20 active:scale-[0.97] transition-all shrink-0 text-2xs font-bold flex items-center gap-1"
            title="Set your event goal & skills"
          >
            My Goal 🎯
          </button>

          <button
            onClick={async () => {
              const activeUserId = user?.id || `user-guest-${user?.name ? user.name.toLowerCase().replace(/\s+/g, '-') : 'guest'}`;
              try {
                await fetch(`/api/room?eventId=${eventId}&userId=${encodeURIComponent(activeUserId)}`, { method: 'DELETE' });
              } catch {}
              toast.success('Exited Event Room');
              router.push('/dashboard');
            }}
            className="px-2.5 py-1.5 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 active:scale-[0.97] transition-all shrink-0 text-2xs font-bold flex items-center gap-1"
            title="Exit Event Room"
          >
            Exit Room 🚪
          </button>

          <button
            onClick={syncRoomParticipants}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors shrink-0 flex items-center gap-1 text-2xs font-medium"
            title="Refresh live room attendees"
          >
            <RefreshCw className={cn('h-3.5 w-3.5', isLoading && 'animate-spin')} />
            Sync
          </button>
        </div>
      </div>

      {/* Main Attendees List */}
      <div className="flex-1 overflow-y-auto" onScroll={handleScroll}>
        {filtered.length === 0 ? (
          <div className="py-20 px-6 text-center space-y-3">
            <div className="p-3 rounded-full bg-nexus-indigo/10 text-nexus-indigo w-14 h-14 mx-auto flex items-center justify-center">
              <Users className="h-7 w-7 animate-pulse" />
            </div>
            <h3 className="font-bold text-base text-foreground">Waiting for people to join...</h3>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              Share room code <span className="font-mono font-bold text-nexus-indigo uppercase">{eventId}</span> on other phones & laptops to see everyone live!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.slice(0, renderedLimit).map((person) => (
              <div key={person.id} className="px-4 py-4 flex items-start gap-3 hover:bg-muted/30 transition-colors">
                <div className="relative shrink-0">
                  <Avatar src={person.avatar_url} alt={person.name} size="lg" />
                  <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-background bg-emerald-500" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="text-sm font-bold text-foreground">{person.name}</h3>
                        <span className="text-2xs px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold">
                          Live Now
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{person.headline || 'Event Participant'}</p>

                      {/* Display typed LinkedIn link under name */}
                      {person.linkedin_url && (
                        <a
                          href={person.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-2xs text-[#0A66C2] font-semibold hover:underline flex items-center gap-1 mt-1 truncate max-w-xs"
                        >
                          <Linkedin className="h-3 w-3 shrink-0 fill-[#0A66C2]" />
                          {person.linkedin_url.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '@')}
                        </a>
                      )}
                    </div>

                    <span className="text-2xs text-muted-foreground shrink-0 flex items-center gap-0.5">
                      <MapPin className="h-2.5 w-2.5" />
                      In Room
                    </span>
                  </div>

                  {/* Skills */}
                  {person.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {person.skills.map((s: string) => (
                        <span key={s} className="text-2xs px-1.5 py-0.5 rounded-md bg-background border border-border text-muted-foreground">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons — Direct LinkedIn Profile Link */}
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => openLinkedInProfile(person.name, person.linkedin_url)}
                      className="flex-1 h-9.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 bg-[#0A66C2] hover:bg-[#084e96] text-white active:scale-[0.97] transition-all shadow-md shadow-[#0A66C2]/20 shrink-0"
                    >
                      <Linkedin className="h-4 w-4 fill-white shrink-0" />
                      View LinkedIn Profile ↗
                    </button>

                    <button
                      onClick={() => setActiveChatRecipient(person)}
                      className="flex-1 h-9.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 bg-nexus-indigo/10 hover:bg-nexus-indigo/20 text-nexus-indigo border border-nexus-indigo/30 active:scale-[0.97] transition-all shrink-0"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Chat
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 1-on-1 Chat Drawer */}
      <DirectChatDrawer
        isOpen={Boolean(activeChatRecipient)}
        onClose={() => setActiveChatRecipient(null)}
        recipient={activeChatRecipient}
      />

      {/* Networking Goal & Intent Modal ("Why are you here?") */}
      <AttendeeIntentModal
        isOpen={isIntentModalOpen}
        onClose={() => setIsIntentModalOpen(false)}
        onSave={(intent, skills) => {
          if (user) {
            (user as any).headline = intent;
            (user as any).skills = skills;
          }
          syncRoomParticipants();
        }}
      />
    </div>
  );
}
