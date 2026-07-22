'use client';

/**
 * Join Event Page
 * Enter 6-char code → instantly see people in the room.
 * Dead simple. No friction.
 */
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, QrCode, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { NexusIcon } from '@/components/ui/Logo';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/authStore';
import { QrScannerModal } from '@/components/events/QrScannerModal';
import { cn } from '@/lib/utils';






// DEMO events shown when Supabase not connected yet
const DEMO_EVENTS = [
  { id: 'demo-1', title: 'TechFest 2025', join_code: 'NEXUS1', attendees: 142, category: 'college_fest' },
  { id: 'demo-2', title: 'Startup Meetup', join_code: 'NEXUS2', attendees: 67,  category: 'meetup'       },
  { id: 'demo-3', title: 'AI Hackathon',   join_code: 'NEXUS3', attendees: 89,  category: 'hackathon'    },
];

export default function JoinEventPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    setCode(val);
    setError(null);
    // Auto-submit when 6 chars entered
    if (val.length === 6) handleJoin(val);
  };

  const handleJoin = async (joinCode = code) => {
    const formattedCode = joinCode.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    if (formattedCode.length !== 6) { setError('Enter a 6-character event code'); return; }
    // Check 4-hour code expiration rule
    try {
      const codeMeta = JSON.parse(localStorage.getItem('nexus_created_codes') || '{}');
      const meta = codeMeta[formattedCode];
      if (meta && meta.expiresAt && Date.now() > meta.expiresAt) {
        setError('This 4-hour event code has expired. Please ask the organizer for a new code.');
        setIsLoading(false);
        return;
      }
    } catch {}

    // If Supabase is connected, query database
    if (isSupabaseConfigured) {
      try {
        const supabase = createClient();
        const { data: event } = await supabase
          .from('events')
          .select('id, title, status')
          .eq('join_code', formattedCode)
          .single();

        if (event) {
          if (user?.id) {
            await supabase
              .from('event_participants')
              .upsert({ event_id: event.id, user_id: user.id }, { onConflict: 'event_id,user_id' });
          }
          toast.success(`Joined ${event.title}! 🎉`);
          router.push(`/events/${event.id}/nearby`);
          return;
        }
      } catch (err) {
        console.error(err);
      }
    }

    // Fallback / Instant entry for custom generated codes & demo codes
    const demo = DEMO_EVENTS.find(e => e.join_code === formattedCode);
    const eventName = demo ? demo.title : `Event [${formattedCode}]`;
    toast.success(`Entered ${eventName}! 🎉`);
    setTimeout(() => router.push(`/events/${formattedCode.toLowerCase()}/nearby`), 300);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-5 py-10">

      {/* Header */}
      <div className="text-center mb-10">
        <NexusIcon size={52} className="mb-4 mx-auto" />
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Join an Event</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Enter the 6-character code from your organizer
        </p>
      </div>

      {/* Code Input — BIG, impossible to miss */}
      <div className="w-full max-w-xs mb-4">
        <input
          ref={inputRef}
          id="event-code-input"
          type="text"
          inputMode="text"
          autoCapitalize="characters"
          autoComplete="off"
          spellCheck={false}
          placeholder="XXXXXX"
          value={code}
          onChange={handleCodeChange}
          disabled={isLoading}
          maxLength={6}
          className={cn(
            'w-full h-20 rounded-2xl border-2 bg-background text-center',
            'text-4xl font-bold tracking-[0.35em] uppercase',
            'outline-none transition-all duration-150',
            'placeholder:text-muted-foreground/30 placeholder:tracking-[0.3em]',
            'disabled:opacity-50',
            error
              ? 'border-destructive focus:border-destructive text-destructive'
              : code.length === 6
              ? 'border-nexus-indigo text-nexus-indigo'
              : 'border-border focus:border-nexus-indigo text-foreground'
          )}
        />

        {/* Character dots progress */}
        <div className="flex justify-center gap-2 mt-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={cn(
              'h-1.5 w-6 rounded-full transition-all duration-200',
              i < code.length ? 'bg-nexus-indigo' : 'bg-border'
            )} />
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive mb-4 w-full max-w-xs">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Submit button */}
      <button
        onClick={() => handleJoin()}
        disabled={code.length !== 6 || isLoading}
        className="w-full max-w-xs h-14 rounded-xl bg-nexus-black text-white font-semibold
                   flex items-center justify-center gap-2 text-base
                   hover:bg-nexus-black/90 active:scale-[0.98]
                   disabled:opacity-40 disabled:cursor-not-allowed
                   transition-all duration-150 shadow-lg mb-3"
      >
        {isLoading ? (
          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        ) : (
          <>Enter Event <ArrowRight className="h-5 w-5" /></>
        )}
      </button>

      {/* Camera QR Scanner Button */}
      <button
        onClick={() => setIsScannerOpen(true)}
        className="w-full max-w-xs h-12 rounded-xl bg-nexus-indigo/10 text-nexus-indigo font-semibold
                   flex items-center justify-center gap-2 text-sm border border-nexus-indigo/30
                   hover:bg-nexus-indigo/20 active:scale-[0.98]
                   transition-all duration-150 mb-6"
      >
        <QrCode className="h-4 w-4" />
        Scan Event QR Code
      </button>

      {/* QR Scanner Modal */}
      <QrScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={(scannedCode) => {
          setCode(scannedCode);
          handleJoin(scannedCode);
        }}
      />


      {/* Divider */}
      <div className="flex items-center gap-3 w-full max-w-xs mb-6">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground">or try demo</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Demo Events — quick join for testing */}
      <div className="w-full max-w-xs space-y-2">
        {DEMO_EVENTS.map(event => (
          <button
            key={event.id}
            onClick={() => { setCode(event.join_code); handleJoin(event.join_code); }}
            className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl
                       border border-border bg-background hover:border-nexus-indigo/50
                       hover:bg-nexus-indigo/5 transition-all duration-150 active:scale-[0.98] group"
          >
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground group-hover:text-nexus-indigo transition-colors">
                {event.title}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {event.attendees} people · Code: {event.join_code}
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-nexus-indigo transition-colors shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}
