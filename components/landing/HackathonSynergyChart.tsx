'use client';

import { useState, useEffect } from 'react';
import {
  Briefcase, Code2, Coins, Users2, CheckCircle2,
  ArrowRight, ShieldCheck, Rocket, Sparkles, GraduationCap
} from 'lucide-react';
import Link from 'next/link';

// ─── STATIC PRE-COMPUTED ROOT LINES (100% PREVENTS SSR/CSR HYDRATION DRIFT) ───
const ROOT_LINES = [
  { x1: 148, y1: 100, x2: 186, y2: 100 },
  { x1: 124, y1: 141.57, x2: 143, y2: 174.48 },
  { x1: 76, y1: 141.57, x2: 57, y2: 174.48 },
  { x1: 52, y1: 100, x2: 14, y2: 100 },
  { x1: 76, y1: 58.43, x2: 57, y2: 25.52 },
  { x1: 124, y1: 58.43, x2: 143, y2: 25.52 },
];

// ─── PARTNER & ECOSYSTEM LOGOS (WITH STATIC PRE-COMPUTED POSITIONS) ───
const BRAND_LOGOS = [
  {
    name: 'Google',
    x: 186,
    y: 100,
    icon: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5">
        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
        <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
      </svg>
    ),
  },
  {
    name: 'OpenAI',
    x: 143,
    y: 174.48,
    icon: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-cyan-300" fill="currentColor">
        <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 8.487a4.485 4.485 0 0 1 2.365-1.98v5.677a.78.78 0 0 0 .388.677l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 8.487zm16.597 3.855l-5.833-3.387L15.119 7.8a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.797V7.472a.081.081 0 0 1 .033-.061l4.838-2.792a4.5 4.5 0 0 1 6.68 4.66zM8.307 12.729l2.44-1.406 2.44 1.406v2.812l-2.44 1.406-2.44-1.406z"/>
      </svg>
    ),
  },
  {
    name: 'GitHub',
    x: 57,
    y: 174.48,
    icon: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-white" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
      </svg>
    ),
  },
  {
    name: 'Y Combinator',
    x: 14,
    y: 100,
    icon: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5">
        <rect width="24" height="24" rx="4" fill="#FF6600" />
        <path d="M7 6l4.2 8.4V20h1.6v-5.6L17 6h-1.9l-3.1 6.6L8.9 6H7z" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    name: 'Microsoft',
    x: 57,
    y: 25.52,
    icon: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5">
        <rect x="1" y="1" width="10" height="10" fill="#F25022"/>
        <rect x="13" y="1" width="10" height="10" fill="#7FBA00"/>
        <rect x="1" y="13" width="10" height="10" fill="#00A4EF"/>
        <rect x="13" y="13" width="10" height="10" fill="#FFB900"/>
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    x: 143,
    y: 25.52,
    icon: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="#0A66C2">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.46 1.46 0 1 0 0-2.92 1.46 1.46 0 0 0 0 2.92m1.37 9.74v-8.37H5.1v8.37h2.73z"/>
      </svg>
    ),
  },
];

// ─── STUDENT GROWTH PILLARS ──────────────────────────────────────────
interface GrowthPillar {
  id: string;
  label: string;
  shortLabel: string;
  percentage: number;
  metricBadge: string;
  color: string;
  textColor: string;
  bgBadge: string;
  borderBadge: string;
  glowColor: string;
  icon: any;
  points: { tag: string; text: string }[];
}

const STUDENT_PILLARS: GrowthPillar[] = [
  {
    id: 'career',
    label: 'Job Offers & SDE Internships',
    shortLabel: 'Job Offers',
    percentage: 38,
    metricBadge: '+3.8x Hire Rate',
    color: '#8B5CF6',
    textColor: 'text-violet-400',
    bgBadge: 'bg-violet-500/15',
    borderBadge: 'border-violet-500/30',
    glowColor: 'rgba(139, 92, 246, 0.45)',
    icon: Briefcase,
    points: [
      {
        tag: 'Bypass ATS Resume Filters',
        text: '78% of sponsor tech leads interview builders directly on-site, skipping 1,000+ applicant queues.',
      },
      {
        tag: 'Real-Time Skill Demo',
        text: 'Recruiters watch you solve production edge cases and deploy code live, outranking static GPA resumes.',
      },
      {
        tag: 'Direct Employee Referrals',
        text: 'Judges hand direct internal referrals for Summer & Fall SDE internships before Sunday awards.',
      },
    ],
  },
  {
    id: 'portfolio',
    label: 'Production Proof-of-Work Repos',
    shortLabel: 'Live Portfolio',
    percentage: 32,
    metricBadge: '10x Better than CV',
    color: '#06B6D4',
    textColor: 'text-cyan-400',
    bgBadge: 'bg-cyan-500/15',
    borderBadge: 'border-cyan-500/30',
    glowColor: 'rgba(6, 182, 212, 0.45)',
    icon: Code2,
    points: [
      {
        tag: 'Live Deployed URLs',
        text: 'Graduate with deployed web apps, Dockerized microservices, and active GitHub repos instead of toy homework.',
      },
      {
        tag: 'Next-Gen Stack Mastery',
        text: 'Hands-on builds with LLM agents, vector databases, and cloud infra rarely covered in university curriculums.',
      },
      {
        tag: 'Verifiable Proof of Work',
        text: 'Public git commits and architecture walk-throughs provide irrefutable proof of your engineering agency.',
      },
    ],
  },
  {
    id: 'funding',
    label: 'Grants, Bounties & Pre-Seed',
    shortLabel: 'Cash Grants',
    percentage: 18,
    metricBadge: '$5k–$25k Non-Dilutive',
    color: '#F59E0B',
    textColor: 'text-amber-400',
    bgBadge: 'bg-amber-500/15',
    borderBadge: 'border-amber-500/30',
    glowColor: 'rgba(245, 158, 11, 0.45)',
    icon: Coins,
    points: [
      {
        tag: '$5k–$25k Cash Bounties',
        text: 'Win non-dilutive founder checks and sponsor cloud credits with zero equity sacrificed.',
      },
      {
        tag: 'Direct Angel & VC Access',
        text: 'Pitch in-person to seed investors and alumni angels scouting student talent across hackathon booths.',
      },
      {
        tag: 'Fast-Track Accelerator Entry',
        text: 'Podium prototypes get fast-tracked into Y Combinator, Thiel Fellowship, and top incubator interviews.',
      },
    ],
  },
  {
    id: 'network',
    label: 'Staff Mentors & Co-Founders',
    shortLabel: 'Elite Network',
    percentage: 12,
    metricBadge: 'Top 5% Peer Circle',
    color: '#10B981',
    textColor: 'text-emerald-400',
    bgBadge: 'bg-emerald-500/15',
    borderBadge: 'border-emerald-500/30',
    glowColor: 'rgba(16, 185, 129, 0.45)',
    icon: Users2,
    points: [
      {
        tag: 'Staff Engineer Pairing',
        text: 'Debug and architect systems side-by-side with Principal Engineers from OpenAI, Google, and AWS.',
      },
      {
        tag: 'Meet Lifelong Co-Founders',
        text: 'Form squads with ambitious engineers and designers who share your hunger to build post-grad startups.',
      },
      {
        tag: 'Break Campus Isolation',
        text: 'Surround yourself with the most driven student builders nationwide and build a lifelong high-agency network.',
      },
    ],
  },
];

const RADIUS = 48;
const CIRCUMFERENCE = 301.59; // Exact 2 * Math.PI * 48

export function HackathonSynergyChart() {
  const [activePillarIndex, setActivePillarIndex] = useState<number>(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activePillar = STUDENT_PILLARS[activePillarIndex];
  const ActiveIcon = activePillar.icon;

  let accumulatedPercent = 0;
  const pieSegments = STUDENT_PILLARS.map((pillar, idx) => {
    const strokeDasharray = `${((pillar.percentage / 100) * CIRCUMFERENCE).toFixed(2)} ${CIRCUMFERENCE}`;
    const strokeDashoffset = ((-1 * (accumulatedPercent / 100) * CIRCUMFERENCE)).toFixed(2);
    accumulatedPercent += pillar.percentage;
    return {
      ...pillar,
      index: idx,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div className="space-y-3 max-w-3xl mx-auto w-full">
      {/* Top Header: Student Growth Focus */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/[0.08]">
        <div className="flex items-center gap-2 min-w-0">
          <GraduationCap className="h-4 w-4 text-cyan-400 shrink-0" />
          <span className="text-[10px] sm:text-[11px] font-bold text-cyan-300 uppercase tracking-wider truncate">
            Why Hackathons Fuel Student Future Growth
          </span>
        </div>

        <div className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[9px] sm:text-[10px] font-bold text-cyan-300 flex items-center gap-1.5 shrink-0">
          <Sparkles className="h-2.5 w-2.5 text-cyan-400" />
          <span>4.2x Faster Career Placement</span>
        </div>
      </div>

      {/* Main Grid: Left Rotating / Rooting Logo Hub, Right Exact Clean Points */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center">
        
        {/* Left: Rotating Brand Logos with Rooting Pathway Animation & Central Donut */}
        <div className="md:col-span-5 flex flex-col items-center justify-center space-y-2 w-full">
          
          {/* Rooting & Orbiting Container */}
          <div className="relative w-[185px] h-[185px] sm:w-[200px] sm:h-[200px] flex items-center justify-center shrink-0 select-none">
            
            {/* Ambient Nebula Glow */}
            <div
              className="absolute inset-4 rounded-full blur-xl transition-all duration-500 pointer-events-none opacity-30"
              style={{ background: activePillar.glowColor }}
            />

            {/* Rooting Circuit Branches SVG with static exact coordinates (zero SSR hydration drift) */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 200 200"
              suppressHydrationWarning
            >
              <defs>
                <linearGradient id="rootGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              {/* Animated Rooting Concentric Pulse Rings */}
              <circle
                cx="100"
                cy="100"
                r="88"
                fill="none"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="1"
                strokeDasharray="4 4"
                className="animate-[spin_60s_linear_infinite]"
              />
              <circle
                cx="100"
                cy="100"
                r="72"
                fill="none"
                stroke="rgba(6, 182, 212, 0.18)"
                strokeWidth="1"
              />

              {/* Exact Static Root Lines */}
              {ROOT_LINES.map((line, idx) => (
                <line
                  key={idx}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke="url(#rootGradient)"
                  strokeWidth="1.2"
                  strokeDasharray="3 3"
                  strokeOpacity="0.6"
                  className="animate-pulse"
                />
              ))}
            </svg>

            {/* Rotating Logo Orbit Track with Counter-Rotation to keep logos upright */}
            <div className="absolute inset-0 w-full h-full animate-[spin_32s_linear_infinite] pointer-events-none">
              {BRAND_LOGOS.map((brand) => (
                <div
                  key={brand.name}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${brand.x}px`, top: `${brand.y}px` }}
                >
                  {/* Counter-rotate logo to keep it upright */}
                  <div className="animate-[spin_32s_linear_infinite_reverse]">
                    <div
                      title={`${brand.name} - Sponsor & Hiring Partner`}
                      className="w-6 h-6 rounded-full bg-[#080D1E] border border-white/20 flex items-center justify-center shadow-lg shadow-black/60 hover:scale-125 transition-transform cursor-pointer pointer-events-auto"
                    >
                      {brand.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Center Donut SVG */}
            <svg
              className="w-[125px] h-[125px] transform -rotate-90 z-10"
              viewBox="0 0 130 130"
              suppressHydrationWarning
            >
              <circle
                cx="65"
                cy="65"
                r={RADIUS}
                fill="none"
                stroke="rgba(255, 255, 255, 0.05)"
                strokeWidth="13"
              />

              {pieSegments.map((seg) => {
                const isActive = seg.index === activePillarIndex;
                return (
                  <circle
                    key={seg.id}
                    cx="65"
                    cy="65"
                    r={RADIUS}
                    fill="none"
                    stroke={seg.color}
                    strokeWidth={isActive ? '17' : '12'}
                    strokeDasharray={seg.strokeDasharray}
                    strokeDashoffset={seg.strokeDashoffset}
                    strokeLinecap="round"
                    className="cursor-pointer transition-all duration-200"
                    style={{
                      filter: isActive ? `drop-shadow(0 0 8px ${seg.glowColor})` : 'none',
                      opacity: isActive ? 1 : 0.55,
                    }}
                    onMouseEnter={() => setActivePillarIndex(seg.index)}
                    onClick={() => setActivePillarIndex(seg.index)}
                  />
                );
              })}
            </svg>

            {/* Center Core Stat Bubble */}
            <div
              className="absolute inset-0 m-auto w-[68px] h-[68px] rounded-full flex flex-col items-center justify-center text-center p-1 backdrop-blur-xl border border-white/[0.12] shadow-xl z-20 cursor-pointer"
              style={{ background: 'rgba(6, 10, 24, 0.95)' }}
              onClick={() => setActivePillarIndex((prev) => (prev + 1) % STUDENT_PILLARS.length)}
            >
              <span
                className="text-base font-display font-black tracking-tight leading-none"
                style={{ color: activePillar.color }}
              >
                {activePillar.percentage}%
              </span>
              <span className="text-[7.5px] font-bold text-white tracking-tight truncate max-w-[58px] mt-0.5">
                {activePillar.shortLabel}
              </span>
              <span className="text-[7px] font-mono text-cyan-300 leading-none mt-0.5">
                Outcome
              </span>
            </div>
          </div>

          {/* Micro 4-Pill Category Selector */}
          <div className="grid grid-cols-2 gap-1.5 w-full">
            {STUDENT_PILLARS.map((pillar, i) => {
              const isSelected = i === activePillarIndex;
              return (
                <button
                  key={pillar.id}
                  type="button"
                  onClick={() => setActivePillarIndex(i)}
                  className={`px-2 py-1 rounded-lg border text-left transition-all flex items-center gap-1.5 min-w-0 ${
                    isSelected
                      ? 'bg-white/[0.1] border-white/30 shadow-sm scale-[1.01]'
                      : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05] opacity-75'
                  }`}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: pillar.color }}
                  />
                  <span className="text-[9.5px] sm:text-[10px] font-semibold text-white truncate min-w-0 flex-1">
                    {pillar.shortLabel}
                  </span>
                  <span className="text-[8.5px] sm:text-[9px] font-mono text-slate-400 shrink-0">
                    {pillar.percentage}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Super Perfect Exact Points Which Genuinely Useful (7 Cols) */}
        <div className="md:col-span-7 w-full">
          <div
            className="rounded-xl sm:rounded-2xl p-3 sm:p-3.5 backdrop-blur-xl space-y-2 border border-white/[0.08] shadow-lg relative overflow-hidden"
            style={{ background: 'rgba(10, 16, 38, 0.92)' }}
          >
            {/* Top Accent Strip */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background: `linear-gradient(90deg, ${activePillar.color}, transparent)` }}
            />

            {/* Header: Exact Pillar & Student Impact Badge */}
            <div className="flex items-center justify-between gap-1.5 flex-wrap sm:flex-nowrap">
              <div className="flex items-center gap-2 min-w-0">
                <div className={`p-1.5 rounded-lg border ${activePillar.bgBadge} ${activePillar.borderBadge} shrink-0`}>
                  <ActiveIcon className={`h-3.5 w-3.5 ${activePillar.textColor}`} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs sm:text-sm font-display font-bold text-white truncate">
                      {activePillar.label}
                    </h3>
                    <span className={`text-[7.5px] sm:text-[8px] font-mono font-bold px-1 py-0.2 rounded border ${activePillar.bgBadge} ${activePillar.borderBadge} ${activePillar.textColor} shrink-0`}>
                      {activePillar.metricBadge}
                    </span>
                  </div>
                  <p className="text-[8.5px] sm:text-[9px] text-slate-400 leading-none mt-0.5">
                    Direct real-world advantage for student builders
                  </p>
                </div>
              </div>

              <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[7.5px] sm:text-[8px] font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 shrink-0">
                <ShieldCheck className="h-2.5 w-2.5 text-emerald-400" />
                <span>Verified Student ROI</span>
              </div>
            </div>

            {/* Super Perfect Exact Points Which Genuinely Useful */}
            <div className="space-y-1 pt-0.5">
              <div className="text-[8.5px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                Concrete Career Superpowers Gained:
              </div>

              <div className="space-y-1.5">
                {activePillar.points.map((pt, idx) => (
                  <div
                    key={idx}
                    className="p-1.5 sm:p-2 rounded-lg bg-[#040816]/90 border border-white/[0.05] hover:border-cyan-500/25 transition-all flex items-start gap-1.5 text-[10.5px] sm:text-[11px]"
                  >
                    <CheckCircle2
                      className="h-3 w-3 mt-0.5 shrink-0"
                      style={{ color: activePillar.color }}
                    />
                    <div className="min-w-0 leading-snug">
                      <strong className="text-white font-semibold mr-1 text-[10px] sm:text-[10.5px]">
                        {pt.tag}:
                      </strong>
                      <span className="text-slate-300 text-[9.5px] sm:text-[10px]">
                        {pt.text}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Motivation Bar: Resilient for Mobile Screens */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 rounded-lg bg-gradient-to-r from-violet-500/10 via-cyan-500/10 to-transparent border border-cyan-500/20">
              <div className="flex items-center gap-1.5 text-[9.5px] sm:text-[10px] text-slate-300">
                <Rocket className="h-3 w-3 text-cyan-400 shrink-0" />
                <span className="leading-tight">
                  89% of student hackathon builders report <strong className="text-cyan-300 font-bold">breakthrough career offers</strong>.
                </span>
              </div>

              <Link
                href="/login"
                className="w-full sm:w-auto h-7 px-3 rounded-md text-[10px] font-bold text-white transition-all active:scale-95 flex items-center justify-center gap-1 shrink-0 shadow-sm"
                style={{
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)',
                }}
              >
                <span>Launch Student Profile</span>
                <ArrowRight className="h-2.5 w-2.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
