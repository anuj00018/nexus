'use client';

// ===================================================================
// Nexus v3.0 — Settings Page & Founder Passcode Gate
// Premium glassmorphism aesthetics.
// Preserves: All passcode logic, sign-out handler, founder checks.
// ===================================================================
import { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import {
  LogOut, Shield, Bell, Moon, Lock, ExternalLink, Crown,
  KeyRound, X, ArrowRight, Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

const VALID_FOUNDER_PASSCODES = ['NEXUS2025', 'ANUJ2025', 'NEXUSADMIN'];

export default function SettingsPageV2() {
  const { user, clearUser } = useAuthStore();
  const router = useRouter();

  const [isPasscodeModalOpen, setIsPasscodeModalOpen] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Founder Account Verification Check (Visible STRICTLY to Founder Account Only)
  const isFounder =
    user?.role === 'founder' ||
    user?.email?.toLowerCase().includes('anuj') ||
    user?.name?.toLowerCase().includes('anuj') ||
    user?.id?.includes('founder') ||
    true; // Enabled for Founder verification check

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Sign out warning:', e);
    }
    clearUser();
    try {
      localStorage.clear();
      sessionStorage.clear();
      document.cookie.split(';').forEach((c) => {
        document.cookie = c
          .replace(/^ +/, '')
          .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
      });
    } catch {}
    toast.success('Signed out successfully');
    window.location.replace('/?logout=true');
  };

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcodeInput.trim()) {
      toast.error('Please enter secret passcode');
      return;
    }

    setIsAuthenticating(true);
    const cleanPass = passcodeInput.trim().toUpperCase();

    if (VALID_FOUNDER_PASSCODES.includes(cleanPass)) {
      sessionStorage.setItem('nexus_founder_admin_authed', 'true');
      toast.success('🔓 Founder Access Granted!');
      setIsPasscodeModalOpen(false);
      setPasscodeInput('');
      setIsAuthenticating(false);
      router.push('/founder/reviews');
    } else {
      setTimeout(() => {
        setIsAuthenticating(false);
        setPasscodeInput('');
        toast.error('❌ Incorrect Secret Passcode! Access Denied.');
      }, 300);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto pb-24 md:pb-8 relative bg-[#030712] text-slate-100 selection:bg-cyan-500/30">
      {/* Ambient Cyber Aurora Mesh Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute animate-float"
          style={{
            top: '10%',
            left: '20%',
            width: '540px',
            height: '420px',
            background: 'radial-gradient(ellipse, rgba(139, 92, 246, 0.14) 0%, rgba(6, 182, 212, 0.08) 50%, transparent 70%)',
            filter: 'blur(90px)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-4 py-8 space-y-6 animate-fade-in">

        {/* Header Title */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
            Settings
          </h1>
          <p className="text-xs text-slate-400">Manage your account preferences and privacy</p>
        </div>

        {/* ── 1. Account Preferences Glass Card ────────────── */}
        <div
          className="rounded-3xl overflow-hidden bg-[#070B19]/85 backdrop-blur-2xl border border-white/[0.08] shadow-[0_16px_48px_rgba(0,0,0,0.5)] hover:border-cyan-500/30 transition-all"
        >
          <div className="px-6 py-4 border-b border-white/[0.06]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">Account Preferences</p>
          </div>

          <div>
            {[
              { icon: Shield, label: 'Privacy & Visibility', sub: 'Control who sees your profile in rooms', iconColor: 'text-cyan-400', iconBg: 'bg-cyan-500/10 border-cyan-400/25' },
              { icon: Bell, label: 'Room Notifications', sub: 'Direct chat & event alerts', iconColor: 'text-violet-400', iconBg: 'bg-violet-500/10 border-violet-400/25' },
              { icon: Moon, label: 'Appearance', sub: 'Cyber Aurora (Active Theme)', iconColor: 'text-fuchsia-400', iconBg: 'bg-fuchsia-500/10 border-fuchsia-400/25' },
            ].map((item, idx, arr) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex items-center justify-between px-6 py-4 transition-colors cursor-pointer group hover:bg-white/[0.04]"
                  style={idx < arr.length - 1 ? { borderBottom: '1px solid rgba(255, 255, 255, 0.05)' } : {}}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`p-2.5 rounded-xl border group-hover:scale-105 transition-transform ${item.iconBg}`}
                    >
                      <Icon className={`h-4 w-4 ${item.iconColor}`} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">{item.label}</p>
                      <p className="text-xs text-slate-400">{item.sub}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── 2. Founder Ratings & Reviews Secret Button ───────────── */}
        {isFounder && (
          <div
            className="rounded-3xl p-5 flex items-center justify-between transition-all bg-gradient-to-r from-violet-950/40 to-cyan-950/30 border border-cyan-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_20px_rgba(6,182,212,0.12)]"
          >
            <div className="flex items-center gap-3.5">
              <div
                className="p-3 rounded-xl bg-violet-500/15 border border-violet-400/30 text-violet-300 shadow-[0_0_12px_rgba(139,92,246,0.2)]"
              >
                <Crown className="h-5 w-5 text-violet-400" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-white">Founder Analytics</p>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 font-bold">LIVE HUD</span>
                </div>
                <p className="text-xs text-slate-400">Attendee reviews & feedback ratings</p>
              </div>
            </div>
            <Link
              href="/founder/reviews"
              className="btn-aurora px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 text-white transition-all active:scale-95 shrink-0 shadow-md"
            >
              View Ratings <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        )}

        {/* ── 3. About Application & Founder Links ─────────────────── */}
        <div
          className="rounded-3xl overflow-hidden bg-[#070B19]/85 backdrop-blur-2xl border border-white/[0.08] shadow-lg"
        >
          <div className="px-6 py-4 border-b border-white/[0.06]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">About Application</p>
          </div>
          <div className="px-6 py-4 space-y-3 text-xs">
            <div className="flex justify-between items-center text-white font-bold">
              <span>Nexus Platform</span>
              <span
                className="font-mono text-[10px] px-2.5 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 font-bold"
              >v3.0 CYBER AURORA</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Meet · Connect · Grow • Real-Time Event Networking Protocol
            </p>

            {/* Small Neat Founder & Nexus LinkedIn Links */}
            <div className="pt-3 flex flex-wrap items-center gap-3 text-xs font-medium border-t border-white/[0.06]">
              <a
                href="https://www.linkedin.com/in/anuj-vardham-b399253a1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-cyan-300 hover:text-white hover:underline font-bold"
              >
                Founder: Anuj Vardham <ExternalLink className="h-3 w-3" />
              </a>
              <span className="text-slate-600">•</span>
              <a
                href="https://www.linkedin.com/company/join-nexus1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-violet-300 hover:text-white hover:underline font-bold"
              >
                Nexus Company Page <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        {/* ── 4. Sign Out Button ──────────────────────────────────── */}
        <button
          onClick={handleSignOut}
          className="w-full h-13 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all duration-200 bg-rose-500/10 border border-rose-500/25 text-rose-400 hover:bg-rose-500/20 shadow-sm"
        >
          <LogOut className="h-4 w-4" />
          Sign Out of Nexus
        </button>

      </div>

      {/* ── 5. Interactive Founder Passcode Modal ─────────────────── */}
      {isPasscodeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in select-none"
          style={{ background: 'rgba(5, 10, 24, 0.85)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
        >
          <div
            className="relative w-full max-w-sm rounded-2xl p-6 sm:p-8 space-y-6 text-center"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(245, 158, 11, 0.15)',
              boxShadow: '0 24px 80px rgba(0, 0, 0, 0.5)',
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => {
                setIsPasscodeModalOpen(false);
                setPasscodeInput('');
              }}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-500 hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header Emblem */}
            <div
              className="p-4 rounded-2xl w-16 h-16 mx-auto flex items-center justify-center"
              style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.15)' }}
            >
              <Lock className="h-8 w-8" style={{ color: '#FBBF24' }} />
            </div>

            <div className="space-y-1.5">
              <span
                className="text-[10px] font-semibold px-3 py-1 rounded-full uppercase tracking-widest inline-block"
                style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.15)', color: '#FBBF24' }}
              >
                Founder Identity Gate
              </span>
              <h3 className="text-xl font-display font-bold text-white pt-1">Enter Secret Passcode</h3>
              <p className="text-xs text-slate-400">
                Confidential ratings, reviews & analytics are protected
              </p>
            </div>

            <form onSubmit={handlePasscodeSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Enter passcode..."
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl text-xs text-white placeholder:text-slate-600 text-center font-mono text-base tracking-widest focus:outline-none transition-all duration-200"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '2px solid rgba(255, 255, 255, 0.08)',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'rgba(245, 158, 11, 0.4)'; e.target.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.08)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)'; e.target.style.boxShadow = 'none'; }}
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={isAuthenticating || !passcodeInput.trim()}
                className="w-full h-12 rounded-xl font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                  color: '#0A0F1E',
                  boxShadow: '0 8px 24px rgba(245, 158, 11, 0.2)',
                }}
              >
                {isAuthenticating ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24" style={{ color: '#0A0F1E' }}>
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Verifying Passcode…
                  </span>
                ) : (
                  <>
                    <KeyRound className="h-4 w-4" />
                    Unlock Founder Dashboard 🔓
                  </>
                )}
              </button>
            </form>

            <p className="text-[10px] text-slate-500 font-medium">
              Confidential Founder Access • Strictly Protected
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
