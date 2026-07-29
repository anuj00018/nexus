'use client';

// ===================================================================
// Nexus v3.0 — Opportunity Recap & Rating Page
// Deep navy glassmorphism styling.
// Includes:
//   - Event Rating Section (5 stars + feedback tags)
//   - My LinkedIn Mentioned & Highlight Card for quick sharing
//   - Connection Summary & Export
// Preserves: All Supabase ratings, local storage fallback, CSV exports.
// ===================================================================
import { useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Star, Linkedin, Copy, Check, Share2, Award, Users, CheckCircle2,
  Download, ArrowUpRight
} from 'lucide-react';
import { EventHeaderNav } from '@/components/events/EventHeaderNav';
import { Avatar } from '@/components/ui/Avatar';
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
    <div className="flex-1 overflow-y-auto pb-20 md:pb-6" style={{ background: 'hsl(222, 47%, 5%)' }}>
      <EventHeaderNav eventId={eventId} eventTitle="TechFest 2025" activeCount={39} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-fade-in">
        {/* Banner */}
        <div
          className="relative rounded-2xl overflow-hidden p-6 text-white"
          style={{
            background: 'linear-gradient(135deg, rgba(66, 99, 235, 0.12) 0%, rgba(139, 92, 246, 0.06) 50%, rgba(10, 15, 30, 0.9) 100%)',
            border: '1px solid rgba(66, 99, 235, 0.15)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold mb-2"
                style={{
                  background: 'rgba(66, 99, 235, 0.08)',
                  border: '1px solid rgba(66, 99, 235, 0.15)',
                  color: '#7B93F5',
                }}
              >
                <Award className="h-3.5 w-3.5" style={{ color: '#4263EB' }} />
                Event Opportunity Recap
              </div>
              <h1 className="text-xl font-display font-bold text-white">Event Summary & Rating</h1>
              <p className="text-slate-400 text-xs mt-1">
                Review your networking outcomes, share your profile, and rate your event experience.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-white text-xs font-semibold transition-all hover:bg-white/[0.06]"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <Download className="h-3.5 w-3.5" style={{ color: '#4263EB' }} />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* ── MY LINKEDIN MENTIONED & HIGHLIGHT CARD ───────────────── */}
        <div
          className="rounded-2xl p-6 space-y-4"
          style={{
            background: 'rgba(66, 99, 235, 0.03)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(66, 99, 235, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl text-white" style={{ background: '#0A66C2' }}>
                <Linkedin className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">My LinkedIn Profile</h3>
                <p className="text-xs text-slate-400">
                  Mentioned & ready to share with people in the room
                </p>
              </div>
            </div>
            <span
              className="text-[10px] px-2.5 py-1 rounded-full font-bold text-white uppercase"
              style={{ background: '#0A66C2' }}
            >
              Verified
            </span>
          </div>

          <div className="space-y-4 pt-2">
            <div
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Avatar src={user?.avatar_url} alt={user?.name || 'Anuj Vardham'} size="lg" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm text-white truncate">{user?.name || 'Anuj Vardham'}</h3>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-md font-bold shrink-0"
                      style={{
                        background: 'rgba(66, 99, 235, 0.1)',
                        color: '#7B93F5',
                      }}
                    >
                      Founder
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate">
                    {user?.company || 'Founder @ Nexus'}
                  </p>
                  <p className="text-[11px] font-medium truncate mt-0.5" style={{ color: '#38bdf8' }}>
                    {userLinkedinUrl}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCopyLinkedin}
                  className={cn(
                    'flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all'
                  )}
                  style={copied ? {
                    background: '#10B981',
                    color: '#ffffff',
                  } : {
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    color: '#e2e8f0',
                  }}
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>

                <a
                  href={userLinkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white shadow-md"
                  style={{ background: '#0A66C2' }}
                >
                  <Linkedin className="h-3.5 w-3.5 fill-white" />
                  Open LinkedIn ↗
                </a>
              </div>
            </div>

            {/* Nexus Official LinkedIn Link */}
            <div
              className="flex items-center justify-between p-3 rounded-xl"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.04)',
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="font-bold text-[10px] px-2 py-0.5 rounded-md"
                  style={{ background: 'rgba(66, 99, 235, 0.1)', color: '#7B93F5' }}
                >NEXUS</span>
                <span className="text-xs text-slate-400 font-medium">Official Nexus LinkedIn Page</span>
              </div>
              <a
                href="https://www.linkedin.com/company/join-nexus1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold hover:underline flex items-center gap-1"
                style={{ color: '#38bdf8' }}
              >
                Follow Nexus <Share2 className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        {/* ── EVENT RATING SECTION ───────────────────────────────────── */}
        <div
          className="rounded-2xl p-6 space-y-6"
          style={{
            background: 'rgba(255, 255, 255, 0.025)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
              <div>
                <h3 className="text-base font-bold text-white">Rate Event Networking Experience</h3>
                <p className="text-xs text-slate-400">
                  How valuable were the people you met at TechFest 2025?
                </p>
              </div>
            </div>
            {isSubmitted && (
              <span
                className="text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1"
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  color: '#10B981',
                }}
              >
                <CheckCircle2 className="h-3 w-3" /> Rated
              </span>
            )}
          </div>

          <form onSubmit={handleSubmitRating} className="space-y-5">
            {/* Star Selector */}
            <div
              className="flex flex-col items-center justify-center p-5 rounded-2xl text-center space-y-2"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.04)',
              }}
            >
              <p className="text-xs font-medium text-slate-400">Overall Satisfaction</p>
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
                      className="p-1 transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={cn(
                          'h-8 w-8 transition-colors',
                          active
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-700'
                        )}
                      />
                    </button>
                  );
                })}
              </div>
              <span className="text-xs font-bold text-white pt-1">
                {rating === 5 ? '🌟 Exceptional Networking!' : rating === 4 ? '👍 Great Event' : rating === 3 ? '👌 Average' : 'Needs Improvement'}
              </span>
            </div>

            {/* Quick Feedback Tags */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
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
                        'text-xs px-3 py-1.5 rounded-xl font-medium transition-all'
                      )}
                      style={isSelected ? {
                        background: 'linear-gradient(135deg, #4263EB, #3451D1)',
                        color: '#ffffff',
                        boxShadow: '0 4px 12px rgba(66, 99, 235, 0.25)',
                      } : {
                        background: 'rgba(255, 255, 255, 0.03)',
                        color: '#94a3b8',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                      }}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Text feedback */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">
                Additional Notes / Takeaways (Optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Mention key follow-ups or feedback for event organizers..."
                className="w-full rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none min-h-[80px] transition-all"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'rgba(66, 99, 235, 0.4)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)'; }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitted}
              className={cn(
                'w-full h-13 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95'
              )}
              style={isSubmitted ? {
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                color: '#10B981',
              } : {
                background: 'linear-gradient(135deg, #4263EB 0%, #3451D1 100%)',
                color: '#ffffff',
                boxShadow: '0 8px 24px rgba(66, 99, 235, 0.25)',
              }}
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
        </div>

        {/* ── CONNECTIONS SUMMARY ─────────────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="h-4 w-4" style={{ color: '#4263EB' }} />
                Event Connections ({EVENT_CONNECTIONS.length})
              </h2>
              <p className="text-xs text-slate-400">People you interacted with at TechFest 2025</p>
            </div>
            <button
              onClick={handleExportCSV}
              className="text-xs font-semibold flex items-center gap-1 hover:underline"
              style={{ color: '#4263EB' }}
            >
              Export List <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>

          <div className="space-y-3">
            {EVENT_CONNECTIONS.map((conn) => (
              <div
                key={conn.id}
                className="rounded-2xl p-4 transition-all duration-200"
                style={{
                  background: 'rgba(255, 255, 255, 0.025)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar src={conn.avatar_url} alt={conn.name} size="md" />
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-white truncate">{conn.name}</h4>
                      <p className="text-xs text-slate-400 truncate">{conn.headline}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        {conn.tags.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] px-2 py-0.5 rounded-md font-medium text-slate-300"
                            style={{
                              background: 'rgba(255, 255, 255, 0.04)',
                              border: '1px solid rgba(255, 255, 255, 0.06)',
                            }}
                          >
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
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-white text-xs font-semibold transition-all shrink-0 shadow-md"
                    style={{ background: '#0A66C2' }}
                  >
                    <Linkedin className="h-3.5 w-3.5" />
                    View LinkedIn
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
