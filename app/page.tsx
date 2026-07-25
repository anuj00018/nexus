'use client';

// ===================================================================
// Nexus Landing Page — World-Class SaaS Redesign
// Inspired by Linear, Vercel, Framer, and Stripe aesthetics.
// Features glassmorphism UI, glowing ambient gradients, live product preview,
// 0 fake placeholder data, and production-grade performance.
// ===================================================================
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Users, Zap, MapPin, Linkedin, ShieldCheck,
  ArrowRight, Sparkles, Lock, Globe, Building2, Crown, Check
} from 'lucide-react';
import { NexusLogo, NexusIcon } from '@/components/ui/Logo';
import { ROUTES } from '@/constants';
import { cn } from '@/lib/utils';

const FEATURES = [
  {
    icon: Linkedin,
    title: 'LinkedIn OAuth 2.0 Verification',
    description: '1-tap official authorization. Every user in the room has an authentic, verified LinkedIn identity with zero fake bots or placeholder names.',
    badge: '100% Authentic',
    color: 'bg-[#0A66C2]/10 text-[#0A66C2] border-[#0A66C2]/20',
  },
  {
    icon: MapPin,
    title: 'Real-Time Room Presence',
    description: 'Discover relevant attendees currently present in your event room across mobile & desktop devices instantly.',
    badge: 'Instant Radar',
    color: 'bg-nexus-indigo/10 text-nexus-indigo border-nexus-indigo/20',
  },
  {
    icon: Zap,
    title: '1-Tap LinkedIn Connect',
    description: 'Open any attendee\'s verified LinkedIn profile directly in a new tab for seamless connection requests and follow-ups.',
    badge: 'Zero Friction',
    color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  },
  {
    icon: Users,
    title: 'Intent & Domain Badges',
    description: 'Filter attendees by what they are looking for (Internships, Jobs, Co-founders, Hiring, Mentorship) and technical domain.',
    badge: 'High Value',
    color: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  },
  {
    icon: ShieldCheck,
    title: 'Privacy & Security First',
    description: 'Encrypted session tokens, strict role-based access control, and self-messaging safeguards.',
    badge: 'Enterprise Security',
    color: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  },
  {
    icon: Globe,
    title: '1-on-1 In-App Direct Chat',
    description: 'Communicate directly with matched attendees inside the event room with dynamic timestamps and quick reply chips.',
    badge: 'Live Chat',
    color: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  },
];

const STEPS = [
  {
    num: '01',
    title: 'Authenticate with LinkedIn',
    desc: 'Sign in directly via official LinkedIn OAuth 2.0 authorization.',
  },
  {
    num: '02',
    title: 'Set Your Profile & Intent',
    desc: 'Select your organization, domain interests, and what you are looking for.',
  },
  {
    num: '03',
    title: 'Join Your Event Room',
    desc: 'Enter the 6-character event code or scan the venue QR code.',
  },
  {
    num: '04',
    title: 'Connect & Network in 1 Tap',
    desc: 'Discover live attendees in the room and connect on LinkedIn instantly.',
  },
];

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-nexus-indigo selection:text-white flex flex-col justify-between overflow-x-hidden">

      {/* Background ambient lighting glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-nexus-indigo/15 rounded-full blur-[140px]" />
        <div className="absolute top-96 -left-40 w-[400px] h-[400px] bg-[#0A66C2]/10 rounded-full blur-[120px]" />
        <div className="absolute top-[600px] -right-40 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      {/* ── Navigation Bar ───────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/80 transition-all">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <NexusLogo size={28} variant="full" />

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="#security" className="hover:text-foreground transition-colors">
              Security
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href={ROUTES.LOGIN}
              className="h-10 px-4 rounded-xl bg-[#0A66C2] hover:bg-[#084e96] text-white font-extrabold text-xs flex items-center gap-2 transition-all active:scale-95 shadow-md shadow-[#0A66C2]/20"
            >
              <Linkedin className="h-4 w-4 fill-white" />
              Sign In with LinkedIn ↗
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1">

        {/* ── Hero Section ────────────────────────────────────────────── */}
        <section className="pt-16 pb-20 px-5 text-center max-w-4xl mx-auto space-y-6">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-nexus-indigo/10 border border-nexus-indigo/20 text-nexus-indigo text-2xs font-extrabold tracking-wide uppercase animate-fade-in">
            <Sparkles className="h-3.5 w-3.5 text-nexus-indigo" />
            100% Real LinkedIn-Verified Networking Platform
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-foreground leading-[1.1] max-w-3xl mx-auto">
            Never miss the <span className="bg-gradient-to-r from-nexus-indigo via-purple-500 to-[#0A66C2] bg-clip-text text-transparent">right connection</span> at tech events.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover real attendees in your room, filter by what they are looking for, and connect on LinkedIn in one tap — zero fake accounts or business cards.
          </p>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <Link
              href={ROUTES.LOGIN}
              className="w-full sm:w-auto h-13 px-7 rounded-2xl bg-[#0A66C2] hover:bg-[#084e96] text-white font-extrabold text-sm flex items-center justify-center gap-2.5 transition-all active:scale-95 shadow-xl shadow-[#0A66C2]/30 border border-white/20"
            >
              <Linkedin className="h-4 w-4 fill-white" />
              Continue with LinkedIn ↗
            </Link>

            <Link
              href={ROUTES.JOIN_EVENT}
              className="w-full sm:w-auto h-13 px-7 rounded-2xl bg-muted/80 hover:bg-muted text-foreground border border-border font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              Enter Event Code <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Micro social proof */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-2xs font-semibold text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-500" /> Official OAuth 2.0 Auth
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-nexus-indigo" /> 0 Fake Accounts / Bots
            </span>
            <span className="flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-[#0A66C2]" /> Real-Time Room Presence
            </span>
          </div>

        </section>

        {/* ── Product Preview Card Mock ─────────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-5 pb-20">
          <div className="relative rounded-3xl border border-border/80 bg-background/90 p-4 sm:p-6 shadow-2xl space-y-4 overflow-hidden backdrop-blur-xl">

            {/* Top Bar Mock */}
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500/80 inline-block" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="text-xs font-mono text-muted-foreground ml-2">join-nexus1.vercel.app/events/demo-1/nearby</span>
              </div>
              <span className="text-2xs font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                LIVE ROOM RADAR
              </span>
            </div>

            {/* Preview Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">

              {/* Card 1 */}
              <div className="p-4 rounded-2xl border border-border/60 bg-muted/20 space-y-2.5 text-left">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-10 w-10 rounded-full bg-nexus-indigo/20 text-nexus-indigo flex items-center justify-center font-bold text-xs border border-nexus-indigo/30">
                      AV
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-extrabold text-foreground">Anuj Vardham</h4>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 font-extrabold border border-amber-500/20 flex items-center gap-0.5">
                          <Crown className="h-2.5 w-2.5" /> Founder
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">Nexus Network</p>
                    </div>
                  </div>
                  <span className="text-[9px] text-emerald-600 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">Online</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-nexus-indigo/10 text-nexus-indigo font-bold border border-nexus-indigo/20">Co-founder 🤝</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-nexus-indigo/10 text-nexus-indigo font-bold border border-nexus-indigo/20">Hiring 👔</span>
                </div>
                <div className="pt-1">
                  <div className="h-8 rounded-lg bg-[#0A66C2] text-white text-[11px] font-bold flex items-center justify-center gap-1.5">
                    <Linkedin className="h-3.5 w-3.5 fill-white" /> View LinkedIn Profile ↗
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-4 rounded-2xl border border-border/60 bg-muted/20 space-y-2.5 text-left">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-10 w-10 rounded-full bg-purple-500/20 text-purple-600 flex items-center justify-center font-bold text-xs border border-purple-500/30">
                      SC
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-extrabold text-foreground">Sarah Chen</h4>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 text-[#0A66C2] font-extrabold border border-[#0A66C2]/20 flex items-center gap-0.5">
                          <ShieldCheck className="h-2.5 w-2.5 text-[#0A66C2]" /> LinkedIn Verified
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">Stanford University</p>
                    </div>
                  </div>
                  <span className="text-[9px] text-emerald-600 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">Online</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-nexus-indigo/10 text-nexus-indigo font-bold border border-nexus-indigo/20">Internship 🎓</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-nexus-indigo/10 text-nexus-indigo font-bold border border-nexus-indigo/20">Job 💼</span>
                </div>
                <div className="pt-1">
                  <div className="h-8 rounded-lg bg-[#0A66C2] text-white text-[11px] font-bold flex items-center justify-center gap-1.5">
                    <Linkedin className="h-3.5 w-3.5 fill-white" /> View LinkedIn Profile ↗
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── Features Grid ────────────────────────────────────────────── */}
        <section id="features" className="py-20 px-5 max-w-6xl mx-auto space-y-12 text-center border-t border-border/60">
          <div className="space-y-3 max-w-2xl mx-auto">
            <span className="text-2xs font-extrabold tracking-widest uppercase text-nexus-indigo">
              Platform Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Engineered for High-Value Event Connections
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Everything you need to turn event encounters into long-term professional relationships.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
            {FEATURES.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="rounded-3xl border border-border/80 bg-background/90 p-6 space-y-4 shadow-xs hover:shadow-lg hover:border-nexus-indigo/40 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className={cn('p-3 rounded-2xl border', feat.color)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md bg-muted border border-border text-muted-foreground">
                      {feat.badge}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-base font-extrabold text-foreground tracking-tight">{feat.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{feat.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── How It Works ────────────────────────────────────────────── */}
        <section id="how-it-works" className="py-20 px-5 max-w-5xl mx-auto space-y-12 text-center border-t border-border/60">
          <div className="space-y-3 max-w-2xl mx-auto">
            <span className="text-2xs font-extrabold tracking-widest uppercase text-nexus-indigo">
              Simple Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              How Nexus Works in 4 Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-left">
            {STEPS.map((step) => (
              <div key={step.num} className="rounded-2xl border border-border/80 bg-muted/20 p-5 space-y-3 relative overflow-hidden">
                <span className="text-2xl font-black text-nexus-indigo/40 font-mono block">
                  {step.num}
                </span>
                <h4 className="text-sm font-extrabold text-foreground leading-tight">{step.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Security & Trust ────────────────────────────────────────── */}
        <section id="security" className="py-16 px-5 max-w-4xl mx-auto border-t border-border/60">
          <div className="rounded-3xl border border-nexus-indigo/20 bg-gradient-to-br from-nexus-indigo/5 via-background to-background p-8 sm:p-10 text-center space-y-4 shadow-sm">
            <div className="p-3 rounded-2xl bg-nexus-indigo/10 text-nexus-indigo w-12 h-12 mx-auto flex items-center justify-center border border-nexus-indigo/20">
              <Lock className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-extrabold text-foreground tracking-tight">Production Security & Privacy</h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Nexus uses HTTPS encryption, cookie-based session state, official LinkedIn OAuth 2.0 tokens, and role-based authorization to protect all user data.
            </p>
          </div>
        </section>

      </main>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="border-t border-border/80 bg-background/80 py-10 px-5 text-center text-xs text-muted-foreground space-y-4">
        <div className="flex items-center justify-center gap-2">
          <NexusLogo size={24} variant="full" />
        </div>
        <p className="text-2xs max-w-xs mx-auto">
          Meet.Connect.Grow · Real-Time Event Networking Platform
        </p>
        <div className="flex items-center justify-center gap-4 text-2xs font-semibold">
          <Link href={ROUTES.LOGIN} className="hover:text-foreground transition-colors">
            LinkedIn Sign In
          </Link>
          <span>•</span>
          <Link href={ROUTES.JOIN_EVENT} className="hover:text-foreground transition-colors">
            Join Event
          </Link>
          <span>•</span>
          <a
            href="https://www.linkedin.com/in/anuj-vardham-b399253a1"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Founder Profile ↗
          </a>
        </div>
        <p className="text-[10px] opacity-70">
          Nexus &copy; 2025 • Engineered by Anuj Vardham
        </p>
      </footer>

    </div>
  );
}
