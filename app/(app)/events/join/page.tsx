'use client';

// ===================================================================
// Join Event Page — Stripe / Linear / Notion Level Redesign
// Features ambient glassmorphic card, smooth character dot indicators,
// input animation, camera QR code scanner, and instant room entry.
// ===================================================================
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, QrCode, AlertCircle, Sparkles, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';
import { NexusIcon } from '@/components/ui/Logo';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/authStore';
import { QrScannerModal } from '@/components/events/QrScannerModal';
import { cn } from '@/lib/utils';

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
    if (val.length === 6) handleJoin(val);
  };

  const handleJoin = async (joinCode = code) => {
    const formattedCode = joinCode.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    if (formattedCode.length !== 6) {
      setError('Please enter a 6-character event code');
      return;
    }

    setIsLoading(true);

    try {
      const codeMeta = JSON.parse(localStorage.getItem('nexus_created_codes') || '{}');
      const meta = codeMeta[formattedCode];
      if (meta && meta.expiresAt && Date.now() > meta.expiresAt) {
        setError('This 4-hour event code has expired. Please ask the organizer for a new code.');
        setIsLoading(false);
        return;
      }
    } catch {}

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

    toast.success(`Entered Event [${formattedCode}]! 🎉`);
    setTimeout(() => router.push(`/events/${formattedCode.toLowerCase()}/nearby`), 300);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-5 relative overflow-hidden select-none">

      {/* Ambient Lighting Glow Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-nexus-indigo/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md mx-auto space-y-6">

        {/* Header */}
        <div className="text-center space-y-2">
          <NexusIcon size={56} className="mx-auto shadow-lg shadow-nexus-indigo/20 rounded-2xl" />
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Join Event Room
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
            Enter the 6-character event code from your organizer
          </p>
        </div>

        {/* Large Premium Glass Card */}
        <div className="rounded-3xl border border-border/80 bg-background/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">

          {/* 6-Character Input Container */}
          <div className="space-y-3">
            <div className="relative">
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
                  'w-full h-20 rounded-2xl border-2 bg-muted/20 text-center font-mono font-black text-3xl sm:text-4xl tracking-[0.3em] uppercase text-foreground outline-hidden transition-all duration-200',
                  'placeholder:text-muted-foreground/30 placeholder:tracking-[0.25em]',
                  error
                    ? 'border-destructive focus:ring-2 focus:ring-destructive text-destructive'
                    : code.length === 6
                    ? 'border-nexus-indigo bg-nexus-indigo/5 text-nexus-indigo shadow-md shadow-nexus-indigo/10'
                    : 'border-border focus:border-nexus-indigo focus:ring-2 focus:ring-nexus-indigo/20'
                )}
              />
            </div>

            {/* Input Progress Dots */}
            <div className="flex justify-center gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'h-1.5 w-6 rounded-full transition-all duration-200',
                    i < code.length ? 'bg-nexus-indigo shadow-xs shadow-nexus-indigo/40' : 'bg-border/60'
                  )}
                />
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 text-xs font-semibold text-destructive p-3 rounded-xl bg-destructive/10 border border-destructive/20 animate-fade-in">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-1">
            <button
              onClick={() => handleJoin()}
              disabled={code.length !== 6 || isLoading}
              className="w-full h-14 rounded-2xl bg-nexus-indigo hover:bg-nexus-indigo/90 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed shadow-xl shadow-nexus-indigo/20"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Joining Event Room…
                </span>
              ) : (
                <>
                  <KeyRound className="h-4 w-4" />
                  Enter Event Room Now
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            {/* Camera QR Scanner Button */}
            <button
              type="button"
              onClick={() => setIsScannerOpen(true)}
              className="w-full h-12 rounded-2xl bg-muted/60 hover:bg-muted text-foreground font-bold text-xs border border-border flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <QrCode className="h-4 w-4 text-nexus-indigo" />
              Scan Event QR Code
            </button>
          </div>

        </div>

      </div>

      {/* QR Scanner Modal */}
      <QrScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={(scannedCode) => {
          setCode(scannedCode);
          handleJoin(scannedCode);
        }}
      />
    </div>
  );
}
