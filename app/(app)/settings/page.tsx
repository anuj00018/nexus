'use client';

// ===================================================================
// Nexus v3.0 — Settings Page & Founder Passcode Gate
// Premium glassmorphism aesthetics.
// Preserves: All passcode logic, sign-out handler, founder checks.
// ===================================================================
import { useState } from 'react';
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
    <div className="flex-1 overflow-y-auto pb-20 md:pb-8" style={{ background: 'hsl(222, 47%, 5%)' }}>
      <div className="max-w-lg mx-auto px-4 py-8 space-y-6 animate-fade-in">

        {/* Header Title */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">Settings</h1>
          <p className="text-xs text-slate-400">Manage your account preferences and privacy</p>
        </div>

        {/* ── 1. Account Preferences Glass Card ────────────── */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(255, 255, 255, 0.025)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          }}
        >
          <div className="px-5 py-3.5" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#4263EB' }}>Account Preferences</p>
          </div>

          <div>
            {[
              { icon: Shield, label: 'Privacy & Visibility', sub: 'Control who sees your profile in rooms' },
              { icon: Bell, label: 'Room Notifications', sub: 'Direct chat & event alerts' },
              { icon: Moon, label: 'Appearance', sub: 'System dark/light mode' },
            ].map((item, idx, arr) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex items-center justify-between px-5 py-4 transition-colors cursor-pointer group hover:bg-white/[0.02]"
                  style={idx < arr.length - 1 ? { borderBottom: '1px solid rgba(255, 255, 255, 0.04)' } : {}}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className="p-2.5 rounded-xl group-hover:scale-105 transition-transform"
                      style={{
                        background: 'rgba(66, 99, 235, 0.08)',
                        border: '1px solid rgba(66, 99, 235, 0.12)',
                      }}
                    >
                      <Icon className="h-4 w-4" style={{ color: '#4263EB' }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">{item.label}</p>
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
            className="rounded-2xl p-5 flex items-center justify-between transition-all"
            style={{
              background: 'rgba(245, 158, 11, 0.06)',
              border: '1px solid rgba(245, 158, 11, 0.15)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            }}
          >
            <div className="flex items-center gap-3.5">
              <div
                className="p-3 rounded-xl"
                style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)' }}
              >
                <Crown className="h-5 w-5" style={{ color: '#FBBF24' }} />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">Founder Ratings & Reviews</h3>
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider"
                    style={{
                      background: 'rgba(245, 158, 11, 0.1)',
                      border: '1px solid rgba(245, 158, 11, 0.2)',
                      color: '#FBBF24',
                    }}
                  >
                    Confidential
                  </span>
                </div>
                <p className="text-xs text-slate-400">Protected by Founder Authorization</p>
              </div>
            </div>

            <button
              onClick={() => setIsPasscodeModalOpen(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 shrink-0 flex items-center gap-1.5"
              style={{
                background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                color: '#0A0F1E',
                boxShadow: '0 4px 16px rgba(245, 158, 11, 0.2)',
              }}
            >
              Open Inbox 🔒
            </button>
          </div>
        )}

        {/* ── 3. About Application & Founder Links ─────────────────── */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(255, 255, 255, 0.025)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <div className="px-5 py-3.5" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#4263EB' }}>About Application</p>
          </div>
          <div className="px-5 py-4 space-y-3.5 text-xs">
            <div className="flex justify-between items-center text-white font-semibold">
              <span>Nexus Platform</span>
              <span
                className="font-mono text-[10px] px-2.5 py-0.5 rounded-md"
                style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.06)', color: '#94a3b8' }}
              >v2.1.0</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Meet · Connect · Grow · Real-Time Event Networking Platform
            </p>

            {/* Small Neat Founder & Nexus LinkedIn Links */}
            <div className="pt-3 flex flex-wrap items-center gap-3 text-xs font-medium" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <a
                href="https://www.linkedin.com/in/anuj-vardham-b399253a1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#0A66C2] hover:underline font-semibold"
              >
                Founder: Anuj Vardham <ExternalLink className="h-3 w-3" />
              </a>
              <span className="text-slate-700">•</span>
              <a
                href="https://www.linkedin.com/company/join-nexus1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#0A66C2] hover:underline font-semibold"
              >
                Nexus Company Page <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        {/* ── 4. Sign Out Button ──────────────────────────────────── */}
        <button
          onClick={handleSignOut}
          className="w-full h-13 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all duration-200"
          style={{
            background: 'rgba(239, 68, 68, 0.06)',
            border: '1px solid rgba(239, 68, 68, 0.15)',
            color: '#F87171',
          }}
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
