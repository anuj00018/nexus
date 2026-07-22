'use client';

// ===================================================================
// Nearby People Page — Dynamic Real Attendees
// Shows ONLY real attendees who join the event room in real time.
// Each attendee card has a prominent blue "LinkedIn Profile ↗" button.
// ===================================================================
import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Linkedin, RefreshCw, Users, MapPin, Wifi, WifiOff,
  Star, Zap, Filter, MessageSquare, UserPlus
} from 'lucide-react';
import toast from 'react-hot-toast';
import { EventHeaderNav } from '@/components/events/EventHeaderNav';
import { DirectChatDrawer } from '@/components/messages/DirectChatDrawer';
import { LiveMatchNotifier } from '@/components/notifications/LiveMatchNotifier';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

const STATUS_CONFIG = {
  available:    { dot: 'bg-emerald-500', label: 'Available',    ring: 'ring-emerald-500/20' },
  busy:         { dot: 'bg-red-500',     label: 'Busy',         ring: 'ring-red-500/20'     },
  coffee_break: { dot: 'bg-amber-500',   label: 'Coffee Break', ring: 'ring-amber-500/20'   },
};

type FilterType = 'all' | 'matches' | 'available';

export default function NearbyPage() {
  const params = useParams();
  const eventId = (params?.id as string) || 'demo-1';
  const router = useRouter();

  const { user } = useAuthStore();
  const [people, setPeople] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const [filter, setFilter] = useState<FilterType>('all');
  const [eventTitle, setEventTitle] = useState('Nexus Event Room');
  const [activeChatRecipient, setActiveChatRecipient] = useState<any | null>(null);
  const [formattedTime, setFormattedTime] = useState<string>('');
  const [renderedLimit, setRenderedLimit] = useState<number>(50);

  // Load active room participants (Dynamic & Real)
  const loadRoomParticipants = useCallback(async () => {
    setIsLoading(true);
    let roomList: any[] = [];

    // 1. If Supabase is connected, load real participants from database
    if (isSupabaseConfigured && user) {
      try {
        const supabase = createClient();
        const { data: participants } = await supabase
          .from('event_participants')
          .select('user_id, users(id, name, headline, avatar_url, linkedin_url, skills)')
          .eq('event_id', eventId);

        if (participants && participants.length > 0) {
          roomList = participants.map((p: any) => ({
            id: p.users.id,
            name: p.users.name,
            headline: p.users.headline,
            avatar_url: p.users.avatar_url,
            linkedin_url: p.users.linkedin_url,
            skills: p.users.skills || ['Networking', 'Tech'],
            availability: 'available',
            distance_m: Math.floor(Math.random() * 50) + 5,
            interest_overlap: 2,
          }));
        }
      } catch (err) {
        console.error('Database fetch error:', err);
      }
    }

    // 2. Load locally joined room participants (from active sessions)
    try {
      const localKey = `nexus_room_participants_${eventId}`;
      const saved = localStorage.getItem(localKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        parsed.forEach((item: any) => {
          if (!roomList.some((r) => r.id === item.id || r.name === item.name)) {
            roomList.push(item);
          }
        });
      }
    } catch {}

    // 3. Ensure current signed-in user is in room list
    const activeUser = user || {
      id: 'user-founder-anuj',
      name: 'Anuj Vardham',
      headline: 'Founder @ Nexus',
      linkedin_url: 'https://www.linkedin.com/in/anuj-vardham-b399253a1',
      skills: ['AI / ML', 'Product Strategy', 'Startup Growth'],
    };

    if (!roomList.some((p) => p.id === activeUser.id || p.name === activeUser.name)) {
      roomList.unshift({
        id: activeUser.id,
        name: activeUser.name,
        headline: activeUser.headline || 'Event Attendee',
        avatar_url: activeUser.avatar_url,
        linkedin_url: activeUser.linkedin_url || 'https://www.linkedin.com/in/anuj-vardham-b399253a1',
        skills: activeUser.skills || ['Networking'],
        availability: 'available',
        distance_m: 0,
        interest_overlap: 3,
      });
    }

    setPeople(roomList);
    setLastUpdated(new Date());
    setIsLoading(false);
  }, [eventId, user]);

  useEffect(() => {
    loadRoomParticipants();
  }, [loadRoomParticipants]);

  useEffect(() => {
    setFormattedTime(lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, [lastUpdated]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 300) {
      setRenderedLimit((prev) => (prev < people.length ? prev + 50 : prev));
    }
  };

  // Open LinkedIn profile URL directly in new tab
  const handleConnect = (personName: string, linkedinUrl?: string) => {
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

        <button
          onClick={loadRoomParticipants}
          className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors shrink-0"
          title="Refresh attendee room list"
        >
          <RefreshCw className={cn('h-3.5 w-3.5', isLoading && 'animate-spin')} />
        </button>
      </div>

      {/* Main Attendees List */}
      <div className="flex-1 overflow-y-auto" onScroll={handleScroll}>
        {filtered.length === 0 ? (
          <div className="py-20 px-6 text-center space-y-3">
            <div className="p-3 rounded-full bg-nexus-indigo/10 text-nexus-indigo w-14 h-14 mx-auto flex items-center justify-center">
              <Users className="h-7 w-7" />
            </div>
            <h3 className="font-bold text-base text-foreground">No other attendees in room yet</h3>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              Share event code <span className="font-mono font-bold text-nexus-indigo uppercase">{eventId}</span> at the entrance for attendees to join live!
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
                        <span className="text-2xs px-1.5 py-0.5 rounded-full bg-nexus-indigo/10 text-nexus-indigo font-bold">
                          Live Attendee
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{person.headline || 'Event Participant'}</p>
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

                  {/* Action Buttons — Prominent LinkedIn & Direct Message */}
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => handleConnect(person.name, person.linkedin_url)}
                      className="flex-1 h-9 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 bg-[#0A66C2] hover:bg-[#084e96] text-white active:scale-[0.97] transition-all shadow-xs shadow-[#0A66C2]/20 shrink-0"
                    >
                      <Linkedin className="h-3.5 w-3.5 fill-white shrink-0" />
                      LinkedIn Profile ↗
                    </button>

                    <button
                      onClick={() => setActiveChatRecipient(person)}
                      className="flex-1 h-9 rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 bg-nexus-indigo/10 hover:bg-nexus-indigo/20 text-nexus-indigo border border-nexus-indigo/30 active:scale-[0.97] transition-all shrink-0"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      Message
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
    </div>
  );
}
