'use client';

// ===================================================================
// CreateEventModal — Founder / Organizer Event Code Generator
// Allows founder to generate custom 6-character event codes (e.g. HYD2025)
// or auto-generate codes, and save them directly to Supabase.
// ===================================================================
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarPlus, X, RefreshCw, Copy, Check, QrCode, Sparkles, MapPin, Tag } from 'lucide-react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EVENT_CATEGORIES = [
  { value: 'tech_fest', label: 'College Fest / TechFest' },
  { value: 'meetup', label: 'Tech Meetup' },
  { value: 'hackathon', label: 'Hackathon' },
  { value: 'conference', label: 'Conference / Expo' },
  { value: 'startup', label: 'Startup Pitch Event' },
];

export function CreateEventModal({ isOpen, onClose }: CreateEventModalProps) {
  const router = useRouter();
  const { user } = useAuthStore();

  const [title, setTitle] = useState('');
  const [joinCode, setJoinCode] = useState('HYD2025');
  const [category, setCategory] = useState('tech_fest');
  const [venueName, setVenueName] = useState('Hyderabad Tech Hub');
  const [venueAddress, setVenueAddress] = useState('HITEC City, Hyderabad');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [createdEventCode, setCreatedEventCode] = useState<string | null>(null);

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let res = 'NX';
    for (let i = 0; i < 4; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setJoinCode(res);
    toast.success(`Generated code: ${res}`);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(joinCode);
    setCopiedCode(true);
    toast.success('Event Code copied!');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    const formattedCode = joinCode.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    if (formattedCode.length !== 6) {
      toast.error('Event code must be exactly 6 characters');
      return;
    }
    if (!title.trim()) {
      toast.error('Please enter an event title');
      return;
    }

    setIsSubmitting(true);

    if (isSupabaseConfigured && user) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('events')
          .insert({
            title: title.trim(),
            join_code: formattedCode,
            category,
            venue_name: venueName,
            venue_address: venueAddress,
            organizer_id: user.id,
            status: 'active',
          })
          .select()
          .single();

        if (error) {
          if (error.message.includes('unique') || error.message.includes('duplicate')) {
            toast.error(`Code ${formattedCode} is already taken! Try another code.`);
          } else {
            toast.error(`Failed to create event: ${error.message}`);
          }
          setIsSubmitting(false);
          return;
        }

        setCreatedEventCode(formattedCode);
        toast.success(`🎉 Event "${title}" created with Code: ${formattedCode}!`);
      } catch (err: any) {
        toast.error('Database save failed');
      }
    } else {
      // Demo mode success
      setCreatedEventCode(formattedCode);
      toast.success(`🎉 Demo Event "${title}" created with Code: ${formattedCode}!`);
    }

    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-background rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-nexus-indigo text-white shadow-xs">
              <CalendarPlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-foreground">Create Event & Code</h3>
              <p className="text-xs text-muted-foreground">Generate 6-char entry code for your attendees</p>
            </div>

          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {createdEventCode ? (
            /* Success View */
            <div className="text-center py-6 space-y-4">
              <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-500 w-16 h-16 mx-auto flex items-center justify-center">
                <Check className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Event Code Created!</h2>
              <p className="text-xs text-muted-foreground">
                Give this 6-character code to attendees at the venue entrance:
              </p>

              {/* Code Highlight Box */}
              <div className="p-6 rounded-2xl bg-nexus-black text-white border border-nexus-indigo/40 space-y-2">
                <span className="text-2xs uppercase tracking-widest text-nexus-indigo font-bold">
                  OFFICIAL EVENT JOIN CODE
                </span>
                <div className="text-4xl font-extrabold tracking-[0.3em] font-mono text-white">
                  {createdEventCode}
                </div>
                <button
                  onClick={handleCopyCode}
                  className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
                >
                  {copiedCode ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedCode ? 'Copied to Clipboard!' : 'Copy Code'}
                </button>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    setCreatedEventCode(null);
                    onClose();
                    router.push('/events/join');
                  }}
                  className="flex-1 py-3 rounded-xl bg-nexus-indigo text-white text-xs font-bold hover:bg-nexus-indigo/90 transition-colors shadow-xs"
                >
                  Go to Join Event Page →
                </button>
              </div>
            </div>
          ) : (
            /* Form View */
            <form onSubmit={handleCreateEvent} className="space-y-4">
              {/* Event Title */}
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">
                  Event Title <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Hyderabad AI Fest 2025"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-nexus-indigo"
                />
              </div>

              {/* 6-Character Custom Code Generator */}
              <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-nexus-indigo" />
                    6-Character Join Code
                  </label>
                  <button
                    type="button"
                    onClick={generateRandomCode}
                    className="text-2xs text-nexus-indigo hover:underline font-semibold flex items-center gap-1"
                  >
                    <RefreshCw className="h-3 w-3" /> Auto-Generate
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={joinCode}
                    onChange={(e) =>
                      setJoinCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))
                    }
                    placeholder="HYD202"
                    className="flex-1 h-12 rounded-xl border-2 border-nexus-indigo/50 bg-background text-center font-mono text-xl font-bold tracking-[0.2em] uppercase text-foreground outline-hidden focus:border-nexus-indigo"
                  />
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="h-12 px-3 rounded-xl border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0"
                    title="Copy code"
                  >
                    {copiedCode ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  This exact code will be typed by attendees at the entrance to join your event.
                </p>
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">Event Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-xs text-foreground focus:outline-hidden focus:ring-2 focus:ring-nexus-indigo"
                >
                  {EVENT_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Venue Name */}
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">Venue Name</label>
                <input
                  type="text"
                  placeholder="e.g., HITEC City Convention Centre"
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-nexus-indigo"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || joinCode.length !== 6 || !title.trim()}
                className="w-full py-3.5 rounded-xl bg-nexus-black text-white font-bold text-xs hover:bg-nexus-black/90 active:scale-[0.99] disabled:opacity-40 transition-all shadow-md flex items-center justify-center gap-2 mt-4"
              >
                {isSubmitting ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <CalendarPlus className="h-4 w-4" /> Save & Generate Event Code
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
