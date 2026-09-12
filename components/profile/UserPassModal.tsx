'use client';

// ===================================================================
// UserPassModal — Personal Attendee Pass & Connect QR Code Modal
// Generates the user's personal VIP attendee code and QR badge.
// Allows other attendees at hackathons/conferences to scan from mobile or laptop.
// ===================================================================
import { useState, useEffect } from 'react';
import { X, Sparkles, ShieldCheck, Crown, Building2, UserCheck, Share2 } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { QrCodeDisplay } from '@/components/ui/QrCodeDisplay';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

interface UserPassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserPassModal({ isOpen, onClose }: UserPassModalProps) {
  const { user } = useAuthStore();
  const [personalCode, setPersonalCode] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    // Generate or derive a consistent 6-8 character user personal code
    const baseName = (user?.name || 'anuj')
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 4);

    // Stable 4-char suffix from user ID
    const rawId = user?.id || 'nexus1';
    let hash = 0;
    for (let i = 0; i < rawId.length; i++) {
      hash = (hash << 5) - hash + rawId.charCodeAt(i);
      hash |= 0;
    }
    const suffix = Math.abs(hash).toString(36).toUpperCase().padStart(3, '7').slice(0, 3);
    const code = `NX-${baseName || 'USER'}${suffix}`.slice(0, 8);
    setPersonalCode(code);

    // Register user code on server so other devices can resolve it immediately
    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        title: `${user?.name || 'Attendee'} Profile Pass`,
        category: 'user_pass',
        venueName: user?.company || 'Nexus Network',
        organizerId: user?.id,
        organizerName: user?.name,
        type: 'user',
      }),
    }).catch((err) => console.warn('Non-blocking user pass sync:', err));
  }, [isOpen, user]);

  if (!isOpen) return null;

  const displayName = user?.name || 'Innovator';
  const roleName = user?.role === 'founder' ? 'Founder & Builder' : 'Event Attendee';
  const shareLink = typeof window !== 'undefined'
    ? `${window.location.origin}/events/join?code=${encodeURIComponent(personalCode)}`
    : `https://nexus.app/events/join?code=${personalCode}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{
        background: 'rgba(3, 7, 18, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div className="relative w-full max-w-sm sm:max-w-md rounded-3xl overflow-hidden flex flex-col bg-[#070B19]/95 border border-cyan-500/30 shadow-[0_24px_80px_rgba(0,0,0,0.8),0_0_40px_rgba(6,182,212,0.2)]">
        {/* Holographic Header Background */}
        <div className="relative p-6 pb-4 border-b border-white/[0.08] bg-gradient-to-r from-violet-900/30 via-cyan-900/20 to-transparent flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar src={user?.avatar_url} alt={displayName} size="md" />
              <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-cyan-400 border-2 border-[#070B19] shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-display font-extrabold text-white text-base tracking-tight">{displayName}</h3>
                <span className="text-[9px] px-2 py-0.5 rounded-full font-bold bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 flex items-center gap-0.5">
                  <ShieldCheck className="h-2.5 w-2.5" /> Verified
                </span>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                {user?.role === 'founder' && <Crown className="h-3 w-3 text-violet-400" />}
                {roleName} {user?.company ? `• ${user.company}` : ''}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body: Scannable Pass */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[80vh] flex flex-col items-center">
          <div className="text-center space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 font-bold flex items-center justify-center gap-1">
              <Sparkles className="h-3 w-3" /> Digital Event Pass
            </span>
            <p className="text-xs text-slate-300">
              Hold up your phone or laptop screen for other attendees to scan and connect instantly
            </p>
          </div>

          {/* High-Resolution QR Display */}
          <QrCodeDisplay
            value={shareLink}
            codeText={personalCode}
            size={200}
            shareUrl={shareLink}
            subtitle="Scan with camera or type code into Join Screen"
          />

          {/* Quick instructions box */}
          <div className="w-full p-3.5 rounded-2xl bg-[#030712]/80 border border-white/[0.06] text-center space-y-1">
            <p className="text-[11px] text-slate-300">
              Works on <span className="text-white font-semibold">Mobile Cameras</span> &amp; <span className="text-white font-semibold">Laptops</span>
            </p>
            <p className="text-[10px] text-slate-500">
              Attendees can point their phone camera or enter this code in the Join screen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
