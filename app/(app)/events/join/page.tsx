'use client';

// ===================================================================
// Nexus UI v2 — Join Event Screen
// Stripe & Notion inspired Join Code portal.
// Preserves: Room routing (/events/[id]/nearby) & local code validation.
// ===================================================================
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { KeyRound, QrCode, ArrowRight, ShieldCheck, Sparkles, Compass } from 'lucide-react';
import toast from 'react-hot-toast';

export default function JoinEventPageV2() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQrSim, setShowQrSim] = useState(false);

  const handleJoin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanCode = code.trim().toLowerCase();

    if (!cleanCode) {
      toast.error('Please enter a 6-character event code');
      return;
    }

    if (cleanCode.length < 3) {
      toast.error('Event code must be at least 3 characters');
      return;
    }

    setIsLoading(true);
    toast.success(`Joining event room [${cleanCode.toUpperCase()}]…`);
    router.push(`/events/${cleanCode}/nearby`);
  };

  return (
    <div className="flex-1 overflow-y-auto pb-20 md:pb-8 bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md mx-auto space-y-6 animate-fade-in my-auto">

        {/* Header Icon & Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-lg">
            <KeyRound className="h-7 w-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Join Event Room
          </h1>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Enter the 6-character code provided by your event organizer
          </p>
        </div>

        {/* Main Form Glass Card */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl space-y-6">

          <form onSubmit={handleJoin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-extrabold tracking-widest uppercase text-indigo-400 block text-center">
                Event Code (Case-Insensitive)
              </label>

              <div className="relative">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 10))}
                  placeholder="e.g. DEMO-1"
                  maxLength={10}
                  className="w-full h-16 rounded-2xl bg-slate-950 border-2 border-slate-800 focus:border-indigo-500 text-center font-mono text-xl sm:text-2xl font-black tracking-widest uppercase text-white placeholder:text-slate-600 focus:outline-none transition-all shadow-inner"
                  autoFocus
                />
              </div>

              {/* Character Progress Bar */}
              <div className="flex justify-center gap-1.5 pt-1">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 w-6 rounded-full transition-all duration-200 ${
                      i < code.length ? 'bg-indigo-500 shadow-sm shadow-indigo-500/50' : 'bg-slate-800'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-1">
              <button
                type="submit"
                disabled={isLoading || !code.trim()}
                className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-extrabold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xl shadow-indigo-600/30"
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
                    Enter Event Room Now
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowQrSim(true);
                  toast.success('QR Code scanner activated');
                }}
                className="w-full h-12 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <QrCode className="h-4 w-4 text-indigo-400" />
                Scan Event QR Code
              </button>
            </div>
          </form>

          {/* QR Code Scanner Overlay Simulation */}
          {showQrSim && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3 animate-fade-in">
              <div className="h-28 w-28 mx-auto rounded-xl border-2 border-dashed border-indigo-500/50 flex items-center justify-center bg-indigo-500/5">
                <QrCode className="h-10 w-10 text-indigo-400 animate-pulse" />
              </div>
              <p className="text-2xs text-slate-400">Position organizer QR code within the frame</p>
              <button
                onClick={() => {
                  setCode('DEMO-1');
                  setShowQrSim(false);
                }}
                className="px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-2xs font-extrabold hover:bg-indigo-500/20"
              >
                Auto-fill Sample Code (DEMO-1)
              </button>
            </div>
          )}

          {/* Verification Badge */}
          <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-semibold">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            Verified Location-Based Room Presence
          </div>

        </div>
      </div>
    </div>
  );
}
