'use client';

/**
 * Nearby People Page — THE core screen of Nexus.
 *
 * Shows ALL people at the event, sorted by:
 *   1. Interest match (your interests → shown first)
 *   2. Distance (closer people next)
 *   3. Everyone else
 *
 * Each card has a prominent "View LinkedIn" connect button.
 * Updates every 20 seconds. Real-time via Supabase subscription.
 */
import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Linkedin, RefreshCw, Users, MapPin, Wifi, WifiOff,
  ChevronLeft, Star, Zap, Filter, MessageSquare
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


// ─── Demo people for testing without Supabase ─────────────────────────
const DEMO_PEOPLE = [
  {
    id: '1', name: 'Arjun Sharma', headline: 'Full Stack Dev @ Razorpay',
    avatar_url: null, linkedin_url: 'https://www.linkedin.com/in/arjun-sharma',
    skills: ['React', 'Node.js', 'PostgreSQL'],
    goals: ['co_founder', 'networking'],
    availability: 'available', distance_m: 12, interest_overlap: 3,
    isMatch: true,
  },
  {
    id: '2', name: 'Priya Mehta', headline: 'Product Manager @ Swiggy',
    avatar_url: null, linkedin_url: 'https://www.linkedin.com/in/priya-mehta',
    skills: ['Product', 'Analytics', 'Figma'],
    goals: ['hiring', 'networking'],
    availability: 'available', distance_m: 28, interest_overlap: 2,
    isMatch: true,
  },
  {
    id: '3', name: 'Rohan Das', headline: 'ML Engineer @ Microsoft',
    avatar_url: null, linkedin_url: 'https://www.linkedin.com/in/rohan-das',
    skills: ['Python', 'TensorFlow', 'AWS'],
    goals: ['mentoring', 'learning'],
    availability: 'coffee_break', distance_m: 45, interest_overlap: 2,
    isMatch: true,
  },
  {
    id: '4', name: 'Sneha Rao', headline: 'UX Designer @ Zomato',
    avatar_url: null, linkedin_url: 'https://www.linkedin.com/in/sneha-rao',
    skills: ['Figma', 'UI/UX', 'Prototyping'],
    goals: ['networking'],
    availability: 'busy', distance_m: 67, interest_overlap: 0,
    isMatch: false,
  },
  {
    id: '5', name: 'Vikram Nair', headline: 'Founder @ StealthStartup',
    avatar_url: null, linkedin_url: 'https://www.linkedin.com/in/vikram-nair',
    skills: ['Go', 'Kubernetes', 'Product'],
    goals: ['co_founder', 'investing'],
    availability: 'available', distance_m: 89, interest_overlap: 1,
    isMatch: false,
  },
  {
    id: '6', name: 'Ananya Singh', headline: 'Data Scientist @ PhonePe',
    avatar_url: null, linkedin_url: 'https://www.linkedin.com/in/ananya-singh',
    skills: ['Python', 'SQL', 'ML'],
    goals: ['job_seeking', 'networking'],
    availability: 'available', distance_m: 102, interest_overlap: 0,
    isMatch: false,
  },
];


const GOAL_LABELS: Record<string, string> = {
  networking: '🤝 Networking', hiring: '👔 Hiring',
  internship: '🎓 Internship', job_seeking: '🔍 Job Seeking',
  co_founder: '🚀 Co-founder', mentoring: '💡 Mentoring',
  learning: '📚 Learning', investing: '💰 Investing',
};

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
  const [people, setPeople] = useState(DEMO_PEOPLE as any[]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const [filter, setFilter] = useState<FilterType>('all');
  const [connectedCount] = useState(DEMO_PEOPLE.length);
  const [eventTitle] = useState('TechFest 2025');
  const [activeChatRecipient, setActiveChatRecipient] = useState<any | null>(null);
  const [formattedTime, setFormattedTime] = useState<string>('');
  const [renderedLimit, setRenderedLimit] = useState<number>(50);

  useEffect(() => {
    setFormattedTime(lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, [lastUpdated]);

  // Load next batch when scrolling near bottom
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 300) {
      setRenderedLimit((prev) => (prev < people.length ? prev + 50 : prev));
    }
  };




  // Live refresh from Supabase
  const fetchNearby = useCallback(async () => {
    if (!isSupabaseConfigured || !user) return;
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.rpc('get_nearby_participants', {
        p_event_id: eventId,
        p_user_id: user.id,
        p_radius_m: 500,
      });
      if (error) throw error;

      // Enrich with user profiles
      if (data && data.length > 0) {
        const userIds = data.map((d: any) => d.user_id);
        const { data: profiles } = await supabase
          .from('users')
          .select('id, name, headline, avatar_url, linkedin_url, skills')
          .in('id', userIds);

        const { data: prefs } = await supabase
          .from('user_preferences')
          .select('user_id, goals')
          .in('user_id', userIds);

        const profileMap = Object.fromEntries((profiles ?? []).map(p => [p.id, p]));
        const prefsMap = Object.fromEntries((prefs ?? []).map(p => [p.user_id, p]));

        const enriched = data.map((d: any) => ({
          ...profileMap[d.user_id],
          availability: d.availability,
          distance_m: d.distance_m,
          interest_overlap: d.interest_overlap,
          isMatch: d.interest_overlap > 0,
          goals: prefsMap[d.user_id]?.goals ?? [],
        }));
        setPeople(enriched);
      }
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Nearby fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [eventId, user]);

  // Auto-refresh every 20 seconds
  useEffect(() => {
    fetchNearby();
    const interval = setInterval(fetchNearby, 20_000);
    return () => clearInterval(interval);
  }, [fetchNearby]);

  // Record profile view & open LinkedIn profile
  const handleConnect = async (personId: string, linkedinUrl?: string, personName?: string) => {
    let targetUrl = linkedinUrl;
    if (!targetUrl || targetUrl.trim() === '') {
      targetUrl = personName
        ? `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(personName)}`
        : 'https://www.linkedin.com';
    } else if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = `https://${targetUrl}`;
    }

    window.open(targetUrl, '_blank', 'noopener,noreferrer');

    if (isSupabaseConfigured && user) {
      try {
        const supabase = createClient();
        await supabase.from('profile_views').upsert({
          event_id: eventId,
          viewer_id: user.id,
          viewed_id: personId,
        }, { onConflict: 'viewer_id,viewed_id,event_id' });
      } catch {}
    }
  };



  const filtered = people.filter(p => {
    if (filter === 'matches') return p.interest_overlap > 0;
    if (filter === 'available') return p.availability === 'available';
    return true;
  });

  const matchCount = people.filter(p => p.interest_overlap > 0).length;

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20 md:pb-6">
      {/* ── Event Subheader Navigation ──────────────────────────────── */}
      <EventHeaderNav eventId={eventId} eventTitle={eventTitle} activeCount={connectedCount} />

      {/* Filter tabs bar */}
      <div className="bg-background border-b border-border py-2.5 px-4 flex items-center justify-between gap-2">
        <div className="flex gap-1.5 overflow-x-auto">
          {([
            { key: 'all',       label: `All (${people.length})` },
            { key: 'matches',   label: `✨ Matches (${matchCount})` },
            { key: 'available', label: '🟢 Available' },
          ] as const).map(tab => (
            <button key={tab.key} onClick={() => setFilter(tab.key)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0',
                filter === tab.key
                  ? 'bg-nexus-indigo text-white shadow-2xs'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              )}>
              {tab.label}
            </button>
          ))}
        </div>

        <button onClick={() => { fetchNearby(); toast.success('Refreshed!'); }}
          disabled={isLoading}
          className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 shrink-0"
          title="Refresh list">
          <RefreshCw className={cn('h-4 w-4 text-nexus-indigo', isLoading && 'animate-spin')} />
        </button>
      </div>

      {/* ── People List ───────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto" onScroll={handleScroll}>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <Users className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <h3 className="font-semibold text-foreground mb-1">No one here yet</h3>
            <p className="text-sm text-muted-foreground">
              People will appear as they join the event.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {/* Matches counter header */}
            {filter === 'all' && matchCount > 0 && (
              <div className="px-4 py-2 bg-nexus-indigo/5 border-b border-nexus-indigo/10 flex items-center justify-between">
                <p className="text-xs font-semibold text-nexus-indigo flex items-center gap-1.5">
                  <Zap className="h-3 w-3" />
                  {matchCount} people share your interests — shown first
                </p>
                <span className="text-2xs text-muted-foreground font-medium">
                  Showing {Math.min(renderedLimit, filtered.length)} of {filtered.length} attendees
                </span>
              </div>
            )}

            {filtered.slice(0, renderedLimit).map((person, idx) => {
              const status = STATUS_CONFIG[person.availability as keyof typeof STATUS_CONFIG]
                ?? STATUS_CONFIG.available;
              const isFirstNonMatch = filter === 'all' && matchCount > 0
                && idx === matchCount;

              return (
                <div key={person.id}>
                  {/* "Everyone else" divider */}
                  {isFirstNonMatch && (
                    <div className="px-4 py-2 bg-muted/50">
                      <p className="text-xs text-muted-foreground font-medium">
                        Other attendees
                      </p>
                    </div>
                  )}

                  {/* Person card */}
                  <div className="px-4 py-4 flex items-start gap-3 hover:bg-muted/30 transition-colors">
                    {/* Avatar with status dot */}
                    <div className="relative shrink-0">
                      <Avatar
                        src={person.avatar_url}
                        alt={person.name}
                        size="lg"
                      />
                      <span className={cn(
                        'absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-background',
                        status.dot
                      )} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="text-sm font-semibold text-foreground leading-tight">
                              {person.name}
                            </h3>
                            {/* Interest match badge */}
                            {person.interest_overlap > 0 && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5
                                             rounded-full bg-nexus-indigo/10 text-nexus-indigo
                                             text-2xs font-semibold shrink-0">
                                <Zap className="h-2.5 w-2.5" />
                                {person.interest_overlap} match
                              </span>
                            )}
                          </div>
                          {person.headline && (
                            <p className="text-xs text-muted-foreground mt-0.5 truncate">
                              {person.headline}
                            </p>
                          )}
                        </div>

                        {/* Distance */}
                        {person.distance_m != null && (
                          <span className="text-2xs text-muted-foreground shrink-0 flex items-center gap-0.5">
                            <MapPin className="h-2.5 w-2.5" />
                            {person.distance_m < 1000
                              ? `${Math.round(person.distance_m)}m`
                              : `${(person.distance_m / 1000).toFixed(1)}km`}
                          </span>
                        )}
                      </div>

                      {/* Goals pills */}
                      {person.goals?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {person.goals.slice(0, 2).map((g: string) => (
                            <span key={g}
                              className="text-2xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                              {GOAL_LABELS[g] ?? g}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Skills */}
                      {person.skills?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {person.skills.slice(0, 3).map((s: string) => (
                            <span key={s}
                              className="text-2xs px-1.5 py-0.5 rounded-md bg-background border border-border text-muted-foreground">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* ── ACTION BUTTONS — LinkedIn & Direct Message ── */}
                      <div className="mt-3 flex items-center gap-2">
                        <button
                          onClick={() => handleConnect(person.id, person.linkedin_url, person.name)}
                          className="flex-1 h-9 rounded-lg font-semibold text-xs
                                     flex items-center justify-center gap-1.5
                                     bg-[#0A66C2] hover:bg-[#084e96] text-white
                                     active:scale-[0.97] transition-all duration-150
                                     shadow-xs shadow-[#0A66C2]/20 shrink-0"
                        >
                          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-white shrink-0"
                            aria-hidden="true">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                          LinkedIn
                        </button>

                        <button
                          onClick={() => setActiveChatRecipient(person)}
                          className="flex-1 h-9 rounded-lg font-semibold text-xs
                                     flex items-center justify-center gap-1.5
                                     bg-nexus-indigo/10 hover:bg-nexus-indigo/20 text-nexus-indigo border border-nexus-indigo/30
                                     active:scale-[0.97] transition-all duration-150 shrink-0"
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                          Message
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Direct 1-on-1 Chat Drawer ────────────────────────────── */}
      <DirectChatDrawer
        isOpen={Boolean(activeChatRecipient)}
        onClose={() => setActiveChatRecipient(null)}
        recipient={activeChatRecipient}
      />

      {/* ── Real-Time Match Notifier Banner ───────────────────────── */}
      <LiveMatchNotifier
        onOpenChat={(attendee) => setActiveChatRecipient(attendee)}
      />


      {/* ── Bottom status bar ─────────────────────────────────────── */}
      <div className="sticky bottom-0 bg-background/90 backdrop-blur-md border-t border-border px-4 py-2.5 flex items-center justify-between">
        <span className="text-xs text-muted-foreground flex items-center gap-1.5">
          {isSupabaseConfigured
            ? <Wifi className="h-3 w-3 text-emerald-500" />
            : <WifiOff className="h-3 w-3 text-amber-500" />}
          {isSupabaseConfigured ? 'Live' : 'Demo mode'}
          {formattedTime ? ` · Updated ${formattedTime}` : ''}
        </span>

        <span className="text-xs text-muted-foreground">Auto-refreshes every 20s</span>
      </div>
    </div>
  );
}
