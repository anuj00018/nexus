'use client';

// ===================================================================
// Nexus v4.0 — The Insane Cyber Aurora Landing Page (Hackathon Edition)
// Live 360° Radar Beacon, Real-Time Match Hologram, Instant 1-Tap Access,
// Interactive PIN Quick-Fill, Bento Feature Grid, & Luminous Motion.
// ===================================================================
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck, ArrowRight, Sparkles, UserCheck, Zap, Flame,
  Users, MapPin, CheckCircle2, ArrowUpRight, Radio, Compass,
  Linkedin, MessageSquare, Award, Terminal, KeyRound
} from 'lucide-react';
import { NexusLogo, NexusIcon } from '@/components/ui/Logo';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/authStore';
import { getAppBaseUrl } from '@/lib/utils';
import { HackathonSynergyChart } from '@/components/landing/HackathonSynergyChart';
import toast from 'react-hot-toast';

function LinkedInSvg() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white shrink-0" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const DEMO_ACCOUNTS = {
  founder: {
    id: 'user-founder-anuj',
    email: 'anuj.vardham@nexus.app',
    name: 'Anuj Vardham',
    avatar_url: null,
    company: 'Nexus',
    headline: 'Founder @ Nexus',
    linkedin_url: 'https://www.linkedin.com/in/anuj-vardham-b399253a1',
    interests: ['AI / ML', 'Product Strategy', 'Startup Growth', 'Networking'],
    looking_for: ['Co-founder', 'Networking'],
    role: 'founder',
    is_verified: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  attendee: {
    id: 'user-attendee-alex',
    email: 'alex.rivera@techfest.io',
    name: 'Alex Rivera',
    avatar_url: null,
    company: 'Acme AI Labs',
    headline: 'Senior ML Engineer @ Acme AI',
    linkedin_url: 'https://www.linkedin.com/in/alexrivera-ai',
    interests: ['AI / ML', 'Frontend & Mobile', 'Backend & Cloud'],
    looking_for: ['Networking', 'Collaboration'],
    role: 'attendee',
    is_verified: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
};

export default function RootPage() {
  const router = useRouter();
  const { user, setUser, setOnboarded } = useAuthStore();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Persistent Auth Session Auto-Redirect
  useEffect(() => {
    const isLogout = typeof window !== 'undefined' && window.location.search.includes('logout=true');
    if (user?.id && !isLogout) {
      router.replace('/dashboard');
    }
  }, [user, router]);

  const performLocalLogin = (profile: typeof DEMO_ACCOUNTS['founder'], targetPath = '/dashboard') => {
    setUser(profile as any);
    setOnboarded(true);

    try {
      localStorage.setItem('nexus_user_profile', JSON.stringify(profile));
      document.cookie = 'nexus_onboarded=true; path=/; max-age=31536000; SameSite=Lax';
      document.cookie = 'nexus_demo_session=true; path=/; max-age=31536000; SameSite=Lax';
    } catch {}

    toast.success(`Welcome back, ${profile.name}!`);
    setTimeout(() => {
      router.push(targetPath);
    }, 250);
  };

  const handleLinkedInOAuth = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isRedirecting) return;

    setIsRedirecting(true);
    toast.loading('Redirecting to official LinkedIn login…');

    const baseUrl = getAppBaseUrl();
    const callbackUrl = `${baseUrl}/auth/callback?redirectTo=/events/nexus1/nearby`;

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin_oidc',
        options: {
          redirectTo: callbackUrl,
          scopes: 'openid profile email',
          queryParams: { prompt: 'consent' },
        },
      });

      if (error) {
        toast.dismiss();
        toast.error(`LinkedIn login error: ${error.message}`);
        setIsRedirecting(false);
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
        return;
      }

      setIsRedirecting(false);
    } catch {
      toast.dismiss();
      toast.error('Could not connect to LinkedIn OAuth');
      setIsRedirecting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#030712] text-[#F8FAFC] overflow-x-hidden selection:bg-[#8B5CF6]/30 selection:text-white">

      {/* ── AMBIENT NEBULA BACKGROUND LIGHTING ──────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Violet Nebula */}
        <div
          className="absolute -top-[15%] left-[20%] w-[700px] h-[550px] rounded-full blur-[120px] opacity-40 animate-float"
          style={{ background: 'radial-gradient(circle, rgba(139, 92, 246, 0.45) 0%, transparent 70%)' }}
        />
        {/* Cyan Flare Nebula */}
        <div
          className="absolute top-[25%] right-[10%] w-[600px] h-[500px] rounded-full blur-[110px] opacity-35 animate-float"
          style={{
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.4) 0%, transparent 70%)',
            animationDirection: 'reverse',
          }}
        />
        {/* Blue Deep Core */}
        <div
          className="absolute bottom-[5%] left-[30%] w-[650px] h-[450px] rounded-full blur-[130px] opacity-30 animate-pulse-soft"
          style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.35) 0%, transparent 70%)' }}
        />
        {/* Structural Tech Grid */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* ── FLOATING TOP CYBER NAVIGATION DOCK ──────────────────────── */}
      <header className="sticky top-2 sm:top-4 z-50 max-w-6xl mx-auto px-3 sm:px-6">
        <div
          className="rounded-xl sm:rounded-2xl px-3.5 sm:px-5 py-2.5 sm:py-3.5 flex items-center justify-between backdrop-blur-2xl transition-all duration-300"
          style={{
            background: 'rgba(9, 14, 33, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(139, 92, 246, 0.15)',
          }}
        >
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <NexusLogo size={28} showTagline={false} />
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-[11px] font-bold text-cyan-300">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>RADAR PROTOCOL ACTIVE</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/login"
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs font-bold text-white transition-all duration-200 active:scale-95 shadow-glow-aurora hover:opacity-95"
              style={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 50%, #06B6D4 100%)',
              }}
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO SECTION ────────────────────────────────────────────── */}
      <section className="relative z-10 pt-10 sm:pt-20 pb-10 sm:pb-16 px-4 sm:px-6 max-w-6xl mx-auto text-center space-y-6 sm:space-y-8">

        {/* Live Protocol Chip */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full backdrop-blur-xl border border-cyan-500/30 bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.25)] max-w-full">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
          </span>
          <span className="text-[10px] sm:text-xs font-bold text-cyan-300 tracking-wide uppercase truncate">
            Real-Time Proximity Radar
          </span>
          <Sparkles className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-violet-400 shrink-0" />
        </div>

        {/* Mega Headline */}
        <div className="space-y-3 sm:space-y-4 max-w-4xl mx-auto px-1">
          <h1 className="text-3xl xs:text-4xl sm:text-6xl md:text-7xl font-display font-extrabold tracking-tight leading-[1.12] sm:leading-[1.08] text-white break-words">
            Connect with the{' '}
            <span className="gradient-text-aurora">Right People</span>
            <br />
            at Live Tech Events.
          </h1>
          <p className="text-sm sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed px-1">
            The intelligent in-room radar for conferences, hackathons, and founder meetups. Discover verified LinkedIn profiles nearby with sub-50ms proximity detection.
          </p>
        </div>

        {/* Hero CTAs */}
        <div className="flex items-center justify-center pt-1 sm:pt-2 w-full max-w-xs sm:max-w-sm mx-auto">
          <button
            onClick={handleLinkedInOAuth}
            disabled={isRedirecting}
            className="btn-aurora w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-9 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2.5 sm:gap-3 shadow-glow-aurora active:scale-95 transition-all"
          >
            {isRedirecting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Connecting with LinkedIn…
              </span>
            ) : (
              <>
                <LinkedInSvg />
                <span>Continue with LinkedIn</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>

      </section>

      {/* ── HACKATHON NETWORKING & SYNERGY PIECHART CENTERPIECE ──────── */}
      <section className="relative z-10 max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        <div
          className="rounded-2xl p-3.5 sm:p-6 backdrop-blur-3xl overflow-hidden relative"
          style={{
            background: 'linear-gradient(145deg, rgba(13, 20, 48, 0.85) 0%, rgba(7, 11, 28, 0.95) 100%)',
            border: '1px solid rgba(139, 92, 246, 0.25)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(139, 92, 246, 0.12)',
          }}
        >
          <HackathonSynergyChart />
        </div>
      </section>

      {/* ── BENTO FEATURE GRID ──────────────────────────────────────── */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6 sm:space-y-8">
        <div className="text-center space-y-1.5 sm:space-y-2">
          <span className="text-[11px] sm:text-xs font-bold text-cyan-400 uppercase tracking-widest">Architectural Pillars</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-white tracking-tight">
            Engineered for Zero-Friction Networking
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Card 1 */}
          <div
            className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 backdrop-blur-xl border border-white/[0.08] hover:border-violet-500/40 hover:shadow-glow-violet transition-all duration-300 space-y-3.5 sm:space-y-4"
            style={{ background: 'rgba(15, 23, 42, 0.65)' }}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Radio className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="space-y-1 sm:space-y-1.5">
              <h3 className="text-base sm:text-lg font-bold text-white">Live Presence Radar</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Scan active rooms with real-time proximity. See who is in the room right now without exchanging paper cards.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div
            className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 backdrop-blur-xl border border-white/[0.08] hover:border-cyan-500/40 hover:shadow-glow-cyan transition-all duration-300 space-y-3.5 sm:space-y-4"
            style={{ background: 'rgba(15, 23, 42, 0.65)' }}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Linkedin className="h-5 w-5 sm:h-6 sm:w-6 fill-current" />
            </div>
            <div className="space-y-1 sm:space-y-1.5">
              <h3 className="text-base sm:text-lg font-bold text-white">1-Tap LinkedIn Handshake</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                100% verified accounts. Connect instantly to an attendee&apos;s genuine LinkedIn profile without typing usernames.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div
            className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 backdrop-blur-xl border border-white/[0.08] hover:border-blue-500/40 hover:shadow-glow-blue transition-all duration-300 space-y-3.5 sm:space-y-4"
            style={{ background: 'rgba(15, 23, 42, 0.65)' }}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Flame className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="space-y-1 sm:space-y-1.5">
              <h3 className="text-base sm:text-lg font-bold text-white">Room Density Heatmap</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Visualize attendee clustering across the venue. Find AI engineers, founders, or VCs grouped by interest zones.
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div
            className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 backdrop-blur-xl border border-white/[0.08] hover:border-emerald-500/40 hover:shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-all duration-300 space-y-3.5 sm:space-y-4"
            style={{ background: 'rgba(15, 23, 42, 0.65)' }}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Award className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="space-y-1 sm:space-y-1.5">
              <h3 className="text-base sm:text-lg font-bold text-white">Opportunity Recap</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Export all meeting contacts directly to CSV, rate event experiences, and review connections in one click.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── BOTTOM MEGA CTA ─────────────────────────────────────────── */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 text-center space-y-6">
        <div
          className="rounded-2xl sm:rounded-3xl p-6 sm:p-12 backdrop-blur-3xl space-y-5 sm:space-y-6 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(6, 182, 212, 0.15) 100%)',
            border: '1px solid rgba(139, 92, 246, 0.35)',
            boxShadow: '0 25px 80px rgba(0, 0, 0, 0.8), 0 0 50px rgba(139, 92, 246, 0.2)',
          }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.08] text-[11px] sm:text-xs font-bold text-white">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>Next-Gen Event Networking</span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-display font-bold text-white tracking-tight leading-tight">
            Elevate Your Event Presence with Nexus
          </h2>

          <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Experience the future of serendipity. Connect in real-time with verified professionals at your next tech event.
          </p>

          <div className="flex items-center justify-center pt-2 w-full max-w-xs sm:max-w-sm mx-auto">
            <button
              onClick={handleLinkedInOAuth}
              disabled={isRedirecting}
              className="btn-aurora w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-9 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold shadow-glow-aurora flex items-center justify-center gap-2.5 sm:gap-3 active:scale-95 transition-all"
            >
              <LinkedInSvg />
              <span>Continue with LinkedIn</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/[0.08] py-6 sm:py-8 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <NexusLogo size={24} showTagline={true} />
          <p className="text-[11px] sm:text-xs">Nexus &copy; 2025 • Verified LinkedIn Event Protocol</p>
        </div>
      </footer>

    </div>
  );
}
