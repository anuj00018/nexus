'use client';

// ===================================================================
// Nexus v3.0 — Join Event & Code Scanner Screen (Universal)
// Works seamlessly on Mobile Phones and Laptops.
// Supports both Event Room Codes & Personal Connect Passes.
// Camera WebRTC QR scanner + QR Image Upload + Auto URL parameter hydration.
// ===================================================================
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  KeyRound, QrCode, ArrowRight, ShieldCheck, Sparkles,
  CalendarPlus, UserCheck, Radio, Check
} from 'lucide-react';
import toast from 'react-hot-toast';
import { QrScannerModal } from '@/components/events/QrScannerModal';
import { CreateEventModal } from '@/components/events/CreateEventModal';
import { UserPassModal } from '@/components/profile/UserPassModal';

function JoinContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);

  // Auto-fill from URL if user scanned with phone native camera
  useEffect(() => {
    const urlCode = searchParams.get('code');
    if (urlCode) {
      const clean = urlCode.trim().toUpperCase().slice(0, 12);
      setCode(clean);
      toast.success(`Loaded code from QR link: ${clean}`);
    }
  }, [searchParams]);

  const handleJoin = (e?: React.FormEvent, directCode?: string) => {
    if (e) e.preventDefault();
    const targetCode = (directCode || code).trim();
    const cleanCode = targetCode.toLowerCase().replace(/[^a-z0-9-]/g, '');

    if (!cleanCode) {
      toast.error('Please enter an event or connect code');
      return;
    }

    if (cleanCode.length < 3) {
      toast.error('Code must be at least 3 characters');
      return;
    }

    setIsLoading(true);

    // Register check on server
    fetch(`/api/events?code=${encodeURIComponent(cleanCode)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.event?.type === 'user' || cleanCode.startsWith('nx-')) {
          toast.success(`Connecting to Attendee Pass [${cleanCode.toUpperCase()}]…`);
          router.push(`/events/${cleanCode}/nearby`);
        } else {
          toast.success(`Entering event room [${cleanCode.toUpperCase()}]…`);
          router.push(`/events/${cleanCode}/nearby`);
        }
      })
      .catch(() => {
        // Safe fallback
        router.push(`/events/${cleanCode}/nearby`);
      });
  };

  return (
    <div className="flex-1 overflow-y-auto pb-24 md:pb-8 flex items-center justify-center p-4 sm:p-6 relative bg-[#030712] text-slate-100 selection:bg-cyan-500/30">
      {/* Ambient Cyber Aurora Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute animate-float"
          style={{
            top: '15%',
            left: '30%',
            width: '560px',
            height: '420px',
            background: 'radial-gradient(ellipse, rgba(139, 92, 246, 0.16) 0%, rgba(6, 182, 212, 0.08) 50%, transparent 70%)',
            filter: 'blur(90px)',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto space-y-6 animate-fade-in my-auto">
        {/* Header Icon & Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-4 rounded-3xl bg-cyan-500/10 border border-cyan-400/35 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
            <KeyRound className="h-8 w-8 text-cyan-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
            Join Event or Connect
          </h1>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Enter 6-char Room PIN, scan event badge QR, or generate your own code.
          </p>
        </div>

        {/* Main Form Glass Card */}
        <div className="rounded-3xl p-6 sm:p-8 space-y-6 bg-[#070B19]/85 backdrop-blur-2xl border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_30px_rgba(6,182,212,0.12)]">
          <form onSubmit={handleJoin} className="space-y-5">
            <div className="space-y-2.5">
              <label className="text-[10px] font-bold tracking-widest uppercase block text-center text-cyan-400">
                Event / Pass Code (Case-Insensitive)
              </label>

              <div className="relative">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 12))}
                  placeholder="e.g. NEXUS1 or NX-782"
                  maxLength={12}
                  className="w-full h-16 rounded-2xl text-center font-mono text-xl sm:text-2xl font-extrabold tracking-widest uppercase text-white placeholder:text-slate-600 focus:outline-none transition-all duration-200 bg-[#030712]/90 border-2 border-white/[0.09] focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                  autoFocus
                />
              </div>

              {/* Character Progress Bar */}
              <div className="flex justify-center gap-1.5 pt-1">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-1.5 w-6 rounded-full transition-all duration-300"
                    style={{
                      background: i < code.length
                        ? 'linear-gradient(90deg, #8B5CF6, #06B6D4)'
                        : 'rgba(255, 255, 255, 0.08)',
                      boxShadow: i < code.length ? '0 0 10px rgba(6, 182, 212, 0.6)' : 'none',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-1">
              <button
                type="submit"
                disabled={isLoading || !code.trim()}
                className="btn-aurora w-full h-14 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50 shadow-lg"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Entering Room…
                  </span>
                ) : (
                  <>
                    Enter Room / Connect Now
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsQrScannerOpen(true)}
                className="w-full h-12 rounded-2xl text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:text-white"
              >
                <QrCode className="h-4 w-4 text-cyan-400" />
                Scan QR Code (Camera or Photo)
              </button>
            </div>
          </form>

          {/* Quick Presets for 1-Tap Demo Testing */}
          <div className="pt-1 space-y-2 text-center">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
              Fast Presets:
            </span>
            <div className="flex flex-wrap justify-center gap-2">
              {['NEXUS1', 'TECHFEST25', 'AI-HACK'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setCode(preset);
                    handleJoin(undefined, preset);
                  }}
                  className="px-3 py-1 rounded-lg font-mono text-xs font-bold bg-[#0D1326] border border-cyan-500/25 text-cyan-300 hover:border-cyan-400 hover:bg-cyan-500/20 active:scale-95 transition-all"
                >
                  #{preset}
                </button>
              ))}
            </div>
          </div>

          {/* Direct Generator Shortcuts for User */}
          <div className="pt-3 border-t border-white/[0.08] grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-cyan-400/30 hover:bg-cyan-500/10 text-left space-y-1 transition-all group"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-cyan-300">
                <CalendarPlus className="h-3.5 w-3.5 text-cyan-400" />
                Create Room
              </div>
              <p className="text-[10px] text-slate-400">Generate 6-char event code &amp; QR</p>
            </button>

            <button
              type="button"
              onClick={() => setIsPassModalOpen(true)}
              className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-violet-400/30 hover:bg-violet-500/10 text-left space-y-1 transition-all group"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-violet-300">
                <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                My QR Pass
              </div>
              <p className="text-[10px] text-slate-400">Show your personal connect pass</p>
            </button>
          </div>

          {/* Verification Badge */}
          <div className="pt-1 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
            <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
            Verified Cross-Device Protocol (Mobile + Laptop)
          </div>
        </div>
      </div>

      {/* Real WebRTC QR Code Scanner Modal */}
      <QrScannerModal
        isOpen={isQrScannerOpen}
        onClose={() => setIsQrScannerOpen(false)}
        onScanSuccess={(scannedCode) => {
          setCode(scannedCode.toUpperCase());
          handleJoin(undefined, scannedCode);
        }}
      />

      {/* Create Event & Code Generator Modal */}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Personal Attendee Pass & QR Modal */}
      <UserPassModal
        isOpen={isPassModalOpen}
        onClose={() => setIsPassModalOpen(false)}
      />
    </div>
  );
}

export default function JoinEventPageV2() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center text-slate-400">Loading...</div>}>
      <JoinContent />
    </Suspense>
  );
}
