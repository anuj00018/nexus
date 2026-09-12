'use client';

// ===================================================================
// CreateEventModal — Founder / Organizer Event Code Generator
// Deep navy glassmorphism modal styling.
// Allows founder to generate custom 6-character event codes (e.g. HYD2025)
// or auto-generate codes, and save them directly to Supabase.
// Preserves: All form state, Supabase calls, validation, localStorage.
// ===================================================================
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarPlus, X, RefreshCw, Copy, Check, Sparkles } from 'lucide-react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/authStore';
import { QrCodeDisplay } from '@/components/ui/QrCodeDisplay';
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

  const [title, setTitle] = useState('Nexus Event 2026');
  const [joinCode, setJoinCode] = useState('MGIT11');
  const [category, setCategory] = useState('meetup');
  const [venueName, setVenueName] = useState('Tech Hub');
  const [venueAddress, setVenueAddress] = useState('Innovation Center');
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

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedCode = joinCode.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
    if (formattedCode.length < 3) {
      toast.error('Event code must be at least 3 characters');
      return;
    }
    const eventTitle = title.trim() || 'Nexus Event 2026';

    // 1. Immediately save to creator's localStorage so it's instantly active locally
    try {
      const expiresAt = Date.now() + 4 * 60 * 60 * 1000;
      const codeMeta = JSON.parse(localStorage.getItem('nexus_created_codes') || '{}');
      codeMeta[formattedCode] = { createdAt: Date.now(), expiresAt, title: eventTitle };
      localStorage.setItem('nexus_created_codes', JSON.stringify(codeMeta));
    } catch {}

    // 2. Instantly show the generated code and QR view! (0ms UI latency, never hangs)
    setCreatedEventCode(formattedCode);
    setIsSubmitting(false);
    toast.success(`🎉 Event "${eventTitle}" created! Code: ${formattedCode}`);

    // 3. Fast cross-device background registration so other mobile & laptop devices can join
    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: formattedCode,
        title: eventTitle,
        category,
        venueName: venueName?.trim() || 'Live Venue',
        venueAddress: venueAddress?.trim() || '',
        organizerId: user?.id || 'user-founder-anuj',
        organizerName: user?.name || 'Organizer',
        type: 'event',
      }),
    }).catch((apiErr) => {
      console.warn('API event registration notice:', apiErr);
    });

    // 4. Non-blocking Supabase sync with 800ms race timeout
    if (isSupabaseConfigured) {
      try {
        const supabase = createClient();
        Promise.race([
          supabase.from('events').insert({
            title: eventTitle,
            join_code: formattedCode,
            category,
            venue_name: venueName,
            venue_address: venueAddress,
            organizer_id: user?.id || 'user-founder-anuj',
            status: 'active',
          }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 800)),
        ]).catch(() => {});
      } catch {}
    }
  };

  if (!isOpen) return null;

  const shareJoinLink = typeof window !== 'undefined'
    ? `${window.location.origin}/events/join?code=${encodeURIComponent(createdEventCode || '')}`
    : `https://nexus.app/events/join?code=${createdEventCode || ''}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: 'rgba(5, 10, 24, 0.85)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl overflow-hidden flex flex-col max-h-[90vh]"
        style={{
          background: 'rgba(10, 15, 30, 0.95)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 24px 80px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-xl text-white"
              style={{ background: 'linear-gradient(135deg, #4263EB, #3451D1)' }}
            >
              <CalendarPlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white">Create Event & Code</h3>
              <p className="text-xs text-slate-400">Generate 6-char entry code for your attendees</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsSubmitting(false);
              onClose();
            }}
            className="p-1.5 rounded-full text-slate-400 hover:text-white transition-colors hover:bg-white/[0.06]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {createdEventCode ? (
            /* Success View with Interactive QR Display */
            <div className="text-center py-2 space-y-4 flex flex-col items-center">
              <div
                className="p-2.5 rounded-full w-12 h-12 flex items-center justify-center"
                style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#10B981' }}
              >
                <Check className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-display font-bold text-white">Event Code & QR Generated!</h2>
                <p className="text-xs text-slate-400 max-w-sm mx-auto pt-1">
                  Project on your laptop screen or venue monitors so mobile attendees can scan or enter this code.
                </p>
              </div>

              {/* Scannable High-Res QR Code */}
              <QrCodeDisplay
                value={shareJoinLink}
                codeText={createdEventCode}
                size={200}
                title={title}
                subtitle="Attendees scan with phone camera or type into Join Screen"
                shareUrl={shareJoinLink}
              />

              <div className="flex flex-col sm:flex-row gap-2 pt-2 w-full max-w-sm">
                <button
                  type="button"
                  onClick={() => {
                    const roomCode = createdEventCode;
                    setCreatedEventCode(null);
                    onClose();
                    router.push(`/events/${roomCode.toLowerCase()}/nearby`);
                  }}
                  className="flex-1 py-3.5 rounded-2xl text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #4263EB, #3451D1)', boxShadow: '0 8px 24px rgba(66, 99, 235, 0.25)' }}
                >
                  Enter Event Room Now →
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCreatedEventCode(null);
                    generateRandomCode();
                  }}
                  className="py-3 px-4 rounded-2xl text-slate-300 hover:text-white text-xs font-semibold transition-all bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] active:scale-95"
                >
                  Create Another
                </button>
              </div>
            </div>
          ) : (
            /* Form View */
            <form onSubmit={handleCreateEvent} className="space-y-4">
              {/* Event Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  Event Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Hyderabad AI Fest 2025"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none transition-all"
                  style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
                  onFocus={(e) => { e.target.style.borderColor = 'rgba(66, 99, 235, 0.4)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)'; }}
                />
              </div>

              {/* Custom Code Generator */}
              <div
                className="p-4 rounded-2xl space-y-2"
                style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)' }}
              >
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" style={{ color: '#4263EB' }} />
                    Event Join Code
                  </label>
                  <button
                    type="button"
                    onClick={generateRandomCode}
                    className="text-[11px] font-semibold flex items-center gap-1 hover:underline"
                    style={{ color: '#4263EB' }}
                  >
                    <RefreshCw className="h-3 w-3" /> Auto-Generate
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    maxLength={8}
                    value={joinCode}
                    onChange={(e) =>
                      setJoinCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8))
                    }
                    placeholder="MGIT11"
                    className="flex-1 h-12 rounded-xl text-center font-mono text-xl font-bold tracking-[0.2em] uppercase text-white outline-none transition-all"
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '2px solid rgba(66, 99, 235, 0.4)',
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="h-12 px-3.5 rounded-xl text-slate-400 hover:text-white transition-colors shrink-0"
                    style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
                    title="Copy code"
                  >
                    {copiedCode ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  This exact code will be typed by attendees at the entrance to join your event.
                </p>
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">Event Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl text-xs text-white focus:outline-none transition-all"
                  style={{ background: 'rgba(10, 15, 30, 0.95)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
                >
                  {EVENT_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Venue Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">Venue Name</label>
                <input
                  type="text"
                  placeholder="e.g., HITEC City Convention Centre"
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none transition-all"
                  style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
                  onFocus={(e) => { e.target.style.borderColor = 'rgba(66, 99, 235, 0.4)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)'; }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || joinCode.trim().length < 3}
                className="w-full h-13 rounded-2xl text-white font-bold text-xs disabled:opacity-40 transition-all shadow-md flex items-center justify-center gap-2 mt-4 active:scale-95 cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #4263EB 0%, #3451D1 100%)', boxShadow: '0 8px 24px rgba(66, 99, 235, 0.25)' }}
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
