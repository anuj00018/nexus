'use client';

// ===================================================================
// Milestone 5: Opportunity Recap & Rating Page
// Includes:
//   - Event Rating Section (5 stars + feedback tags)
//   - My LinkedIn Mentioned & Highlight Card for quick sharing
//   - Connection Summary & Export
// ===================================================================
import { useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Star, Linkedin, Copy, Check, Share2, Award, Users, CheckCircle2,
  Sparkles, Download, ArrowUpRight, MessageSquare
} from 'lucide-react';
import { EventHeaderNav } from '@/components/events/EventHeaderNav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { useAuthStore } from '@/store/authStore';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const EVENT_CONNECTIONS = [
  {
    id: 'c1',
    name: 'Anuj Vardham',
    headline: 'Founder @ Nexus',
    avatar_url: null,
    linkedin_url: 'https://www.linkedin.com/in/anuj-vardham-b399253a1',
    tags: ['Event Host', 'Founder'],
    time: 'Active in room',
  },
];

export default function RecapPage() {
  const params = useParams();
  const eventId = (params?.id as string) || 'demo-1';
  const { user } = useAuthStore();


  // Rating state
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedbackTags, setFeedbackTags] = useState<string[]>(['Great Matches', 'Easy to Connect']);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const userLinkedinUrl = user?.linkedin_url || 'https://www.linkedin.com/in/anuj-vardham-b399253a1';

  const toggleFeedbackTag = (tag: string) => {
    setFeedbackTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleCopyLinkedin = () => {
    navigator.clipboard.writeText(userLinkedinUrl);
    setCopied(true);
    toast.success('My LinkedIn URL copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitRating = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (isSupabaseConfigured && user) {
      try {
        const supabase = createClient();
        await supabase.from('event_ratings').upsert({
          event_id: eventId,
          user_id: user.id,
          rating,
          feedback: comment,
          tags: feedbackTags,
        }, { onConflict: 'event_id,user_id' });
      } catch {}
    }

    try {
      localStorage.setItem(`nexus_event_rating_${eventId}`, JSON.stringify({ rating, comment, tags: feedbackTags }));
    } catch {}

    toast.success('Thank you! 5-star rating & feedback saved permanently. 🎉');
  };

  const handleExportCSV = () => {
    const csvContent =
      'Name,Headline,LinkedIn URL\n' +
      EVENT_CONNECTIONS.map(
        (c) => `"${c.name}","${c.headline}","${c.linkedin_url}"`
      ).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Nexus_Connections_${eventId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Connections exported to CSV');
  };

  return (
    <div className="flex-1 overflow-y-auto pb-20 md:pb-6">
      <EventHeaderNav eventId={eventId} eventTitle="TechFest 2025" activeCount={39} />

      <div className="container-nexus py-6 space-y-8 max-w-3xl mx-auto">
        {/* Banner */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-nexus-black via-zinc-900 to-nexus-black text-white p-6 border border-border">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-2xs font-semibold text-nexus-indigo mb-2">
                <Award className="h-3.5 w-3.5" />
                Event Opportunity Recap
              </div>
              <h1 className="text-xl font-bold text-white">Event Summary & Rating</h1>
              <p className="text-white/60 text-xs mt-1">
                Review your networking outcomes, share your profile, and rate your event experience.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* ── MY LINKEDIN MENTIONED & HIGHLIGHT CARD ───────────────── */}
        <Card variant="accent" className="border-2 border-nexus-indigo/40 bg-nexus-indigo/5">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#0A66C2] text-white">
                  <Linkedin className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base">My LinkedIn Profile</CardTitle>
                  <CardDescription className="text-xs">
                    Mentioned & ready to share with people in the room
                  </CardDescription>
                </div>
              </div>
              <Badge variant="accent" className="bg-[#0A66C2] text-white border-none text-2xs">
                Verified
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-background/80 p-3.5 rounded-xl border border-border">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar src={user?.avatar_url} alt={user?.name || 'Anuj Vardham'} size="lg" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm text-foreground truncate">{user?.name || 'Anuj Vardham'}</h3>
                    <span className="text-2xs px-2 py-0.5 rounded-md bg-nexus-indigo/10 text-nexus-indigo font-bold shrink-0">
                      Founder
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.headline || 'Founder @ Nexus'}
                  </p>

                  <p className="text-2xs text-[#0A66C2] truncate mt-0.5 font-medium">
                    {userLinkedinUrl}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCopyLinkedin}
                  className={cn(
                    'flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all',
                    copied
                      ? 'bg-emerald-500 text-white'
                      : 'bg-muted hover:bg-muted/80 text-foreground border border-border'
                  )}
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>

                <a
                  href={userLinkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#0A66C2] hover:bg-[#084e96] text-white shadow-xs"
                >
                  <Linkedin className="h-3.5 w-3.5 fill-white" />
                  Open LinkedIn ↗
                </a>
              </div>
            </div>


            {/* Nexus Official LinkedIn Link */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-background/60 border border-border">
              <div className="flex items-center gap-2">
                <span className="font-bold text-nexus-indigo text-xs px-2 py-0.5 rounded-md bg-nexus-indigo/10">NEXUS</span>
                <span className="text-xs text-muted-foreground font-medium">Official Nexus LinkedIn Page</span>
              </div>
              <a
                href="https://www.linkedin.com/company/join-nexus1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#0A66C2] font-semibold hover:underline flex items-center gap-1"
              >
                Follow Nexus <Share2 className="h-3 w-3" />
              </a>
            </div>

          </CardContent>

        </Card>

        {/* ── EVENT RATING SECTION ───────────────────────────────────── */}
        <Card variant="default" className="border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                <div>
                  <CardTitle className="text-base">Rate Event Networking Experience</CardTitle>
                  <CardDescription className="text-xs">
                    How valuable were the people you met at TechFest 2025?
                  </CardDescription>
                </div>
              </div>
              {isSubmitted && (
                <Badge variant="success" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> Rated
                </Badge>
              )}

            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmitRating} className="space-y-5">
              {/* Star Selector */}
              <div className="flex flex-col items-center justify-center p-4 bg-muted/30 rounded-2xl border border-border/50">
                <p className="text-xs font-medium text-muted-foreground mb-3">Overall Satisfaction</p>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = (hoverRating || rating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 transition-transform hover:scale-125 focus:outline-hidden"
                      >
                        <Star
                          className={cn(
                            'h-8 w-8 transition-colors',
                            active
                              ? 'text-amber-500 fill-amber-500 drop-shadow-xs'
                              : 'text-muted-foreground/30'
                          )}
                        />
                      </button>
                    );
                  })}
                </div>
                <span className="text-xs font-bold text-foreground mt-2">
                  {rating === 5 ? '🌟 Exceptional Networking!' : rating === 4 ? '👍 Great Event' : rating === 3 ? '👌 Average' : 'Needs Improvement'}
                </span>
              </div>

              {/* Quick Feedback Tags */}
              <div>
                <label className="text-xs font-semibold text-foreground block mb-2">
                  What worked best for you?
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Great Matches',
                    'Easy to Connect',
                    'High Quality Attendees',
                    'Found Co-founder',
                    'Good Hiring Leads',
                    'Fast Profile Exchange',
                  ].map((tag) => {
                    const isSelected = feedbackTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleFeedbackTag(tag)}
                        className={cn(
                          'text-xs px-3 py-1.5 rounded-xl border transition-all font-medium',
                          isSelected
                            ? 'bg-nexus-indigo text-white border-nexus-indigo'
                            : 'bg-background text-muted-foreground border-border hover:border-foreground/30'
                        )}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Text feedback */}
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">
                  Additional Notes / Takeaways (Optional)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Mention key follow-ups or feedback for event organizers..."
                  className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-nexus-indigo min-h-[80px]"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitted}
                className={cn(
                  'w-full py-2.5 rounded-xl font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-2',
                  isSubmitted
                    ? 'bg-emerald-500 text-white cursor-default'
                    : 'bg-nexus-black text-white hover:bg-nexus-black/90 active:scale-[0.99]'
                )}
              >
                {isSubmitted ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" /> Rating Saved
                  </>
                ) : (
                  <>
                    <Star className="h-4 w-4" /> Submit Event Rating
                  </>
                )}
              </button>
            </form>
          </CardContent>
        </Card>

        {/* ── CONNECTIONS SUMMARY ─────────────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Users className="h-4 w-4 text-nexus-indigo" />
                Event Connections ({EVENT_CONNECTIONS.length})
              </h2>
              <p className="text-xs text-muted-foreground">People you interacted with at TechFest 2025</p>
            </div>
            <button
              onClick={handleExportCSV}
              className="text-xs text-nexus-indigo hover:underline font-semibold flex items-center gap-1"
            >
              Export List <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>

          <div className="space-y-3">
            {EVENT_CONNECTIONS.map((conn) => (
              <Card key={conn.id} variant="default" padding="md" className="hover:border-nexus-indigo/30 transition-colors">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar src={conn.avatar_url} alt={conn.name} size="md" />
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-foreground truncate">{conn.name}</h4>
                      <p className="text-xs text-muted-foreground truncate">{conn.headline}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        {conn.tags.map((t) => (
                          <span key={t} className="text-2xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-medium">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <a
                    href={conn.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0A66C2] text-white text-xs font-semibold hover:bg-[#0A66C2]/90 transition-colors shrink-0 shadow-xs"
                  >
                    <Linkedin className="h-3.5 w-3.5" />
                    View LinkedIn
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
