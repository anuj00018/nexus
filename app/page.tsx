'use client';

/**
 * Nexus Landing Page
 *
 * Premium, minimal, mobile-first landing page.
 * Sections: Hero → Problem → Solution → Features → CTA → Footer
 *
 * Design inspired by Linear, Stripe, and Apple.
 */

import React from 'react';
import Link from 'next/link';
import {
  Users, Zap, MapPin, Linkedin, BarChart2, Shield,
  ArrowRight, ChevronRight, Star, Check,
  MessageSquare, Award, Globe
} from 'lucide-react';
import { NexusLogo, NexusIcon } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ROUTES } from '@/constants';

// ─── Feature Data ──────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: <Linkedin className="h-5 w-5" />,
    title: 'LinkedIn Login',
    description: 'Sign in instantly with LinkedIn. Your professional profile is auto-imported — no manual setup.',
    color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  },
  {
    icon: <MapPin className="h-5 w-5" />,
    title: 'Nearby Discovery',
    description: 'See who\'s around you at the event in real-time. Filtered by interests and goals — not random.',
    color: 'bg-nexus-indigo/10 text-nexus-indigo',
  },
  {
    icon: <Zap className="h-5 w-5" />,
    title: 'One-Tap Connect',
    description: 'Open anyone\'s LinkedIn profile with a single tap. No awkward exchanges, no business cards.',
    color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  },
  {
    icon: <BarChart2 className="h-5 w-5" />,
    title: 'Event Heatmap',
    description: 'See where people are clustering at the venue. Find the networking hotspots in seconds.',
    color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  },
  {
    icon: <Award className="h-5 w-5" />,
    title: 'Opportunity Recap',
    description: 'After every event, see who you connected with, who viewed your profile, and what you missed.',
    color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: 'Privacy First',
    description: 'You control your visibility. Go invisible, show only to matching interests, or be fully open.',
    color: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
  },
];

const SOCIAL_PROOF = [
  { emoji: '🚀', label: 'Hackathons' },
  { emoji: '🎤', label: 'Conferences' },
  { emoji: '☕', label: 'Meetups' },
  { emoji: '💼', label: 'Career Fairs' },
  { emoji: '🎓', label: 'College Fests' },
  { emoji: '⚡', label: 'Startup Events' },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Join with LinkedIn',
    description: 'Sign in and your professional profile is automatically imported. No filling forms.',
  },
  {
    step: '02',
    title: 'Set your intent',
    description: 'Tell us why you\'re here — hiring, networking, co-founder hunting, or just learning.',
  },
  {
    step: '03',
    title: 'Discover nearby people',
    description: 'See relevant attendees within your radius. Filter by interests, goals, and availability.',
  },
  {
    step: '04',
    title: 'Connect in one tap',
    description: 'Open their LinkedIn, send a connection, and never lose a great contact again.',
  },
];

// ─── Landing Page ──────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* ── Navigation ───────────────────────────────────────────── */}
      <header className="page-header">
        <nav className="container-nexus flex items-center justify-between h-16">
          <NexusLogo size={28} variant="full" />

          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="#features" className="hover:text-foreground transition-colors link-underline">
              Features
            </Link>
            <Link href="#how-it-works" className="hover:text-foreground transition-colors link-underline">
              How it works
            </Link>
            <Link href="#events" className="hover:text-foreground transition-colors link-underline">
              Events
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href={ROUTES.LOGIN}>Sign in</Link>
            </Button>
            <Button variant="accent" size="sm" asChild>
              <Link href={ROUTES.LOGIN}>
                Get started
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </nav>
      </header>

      <main>
        {/* ── Hero Section ──────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-dot-grid opacity-40 dark:opacity-20" />
          <div className="glow-circle w-[600px] h-[600px] bg-nexus-indigo top-[-200px] left-1/2 -translate-x-1/2" />

          <div className="container-nexus relative pt-24 pb-20 md:pt-32 md:pb-28 text-center">
            {/* Tag */}
            <div className="flex justify-center mb-6 animate-fade-in-down">
              <Badge variant="accent" size="md" icon="✨">
                Now in Beta — Join for free
              </Badge>
            </div>

            {/* Headline */}
            <h1 className="animate-fade-in-up animation-delay-100 text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground max-w-4xl mx-auto">
              Never miss the right
              <br />
              <span className="gradient-text">connection</span> at an event.
            </h1>

            {/* Sub-headline */}
            <p className="animate-fade-in-up animation-delay-200 mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
              Nexus helps you discover relevant people nearby at hackathons, conferences,
              and meetups — and connect on LinkedIn with one tap.
            </p>

            {/* CTA Buttons */}
            <div className="animate-fade-in-up animation-delay-300 mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              {/* LinkedIn blue button — official brand color */}
              <Link
                href={ROUTES.LOGIN}
                className="inline-flex items-center justify-center gap-2.5 h-14 px-8 rounded-xl
                           font-semibold text-base text-white bg-[#0A66C2] hover:bg-[#084e96]
                           active:scale-[0.98] transition-all duration-150 shadow-lg shadow-[#0A66C2]/25
                           select-none"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white shrink-0" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Continue with LinkedIn
              </Link>
              <Link
                href="/events/demo-1/nearby"
                className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-xl
                           font-semibold text-base text-foreground bg-background border-2 border-border
                           hover:border-foreground/40 active:scale-[0.98] transition-all duration-150 select-none"
              >
                Try Demo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Trust signals */}
            <p className="animate-fade-in-up animation-delay-400 mt-4 text-xs text-muted-foreground flex items-center justify-center gap-3 flex-wrap">
              <span className="flex items-center gap-1"><Check className="h-3 w-3 text-emerald-500" /> No credit card</span>
              <span className="flex items-center gap-1"><Check className="h-3 w-3 text-emerald-500" /> Privacy first</span>
              <span className="flex items-center gap-1"><Check className="h-3 w-3 text-emerald-500" /> Free for attendees</span>
            </p>
          </div>
        </section>

        {/* ── Event Types Ticker ──────────────────────────────────── */}
        <section id="events" className="border-y border-border bg-muted/30 py-6">
          <div className="container-nexus">
            <p className="text-center text-sm text-muted-foreground mb-4">
              Perfect for every professional event
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {SOCIAL_PROOF.map((item) => (
                <span
                  key={item.label}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                             bg-background border border-border text-sm font-medium text-foreground
                             hover:border-nexus-indigo/40 hover:bg-nexus-indigo/5 transition-all duration-150"
                >
                  {item.emoji} {item.label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Problem Statement ────────────────────────────────────── */}
        <section className="section">
          <div className="container-md text-center">
            <Badge variant="muted" size="md" className="mb-4">The Problem</Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Networking at events is broken.
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12 text-balance">
              You attend a conference, walk around aimlessly, exchange a few cards,
              and forget most names by morning. It shouldn't be this hard.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
              {[
                { icon: '😶', text: "You don't know who's attending" },
                { icon: '🎲', text: "Networking is based on luck" },
                { icon: '😰', text: "Too shy to approach strangers" },
                { icon: '🤔', text: "Don't know who's hiring" },
                { icon: '😔', text: "Forget names after conversations" },
                { icon: '💸', text: "Miss valuable opportunities" },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border"
                >
                  <span className="text-2xl shrink-0">{item.icon}</span>
                  <p className="text-sm font-medium text-foreground">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features ─────────────────────────────────────────────── */}
        <section id="features" className="section bg-muted/20">
          <div className="container-nexus">
            <div className="text-center mb-16">
              <Badge variant="accent" size="md" className="mb-4">Features</Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Everything you need to network smarter.
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto text-balance">
                Nexus combines real-time discovery, professional profiles,
                and privacy controls into one elegant experience.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((feature) => (
                <Card
                  key={feature.title}
                  variant="default"
                  interactive
                  className="group"
                >
                  <div className={`inline-flex p-2.5 rounded-lg mb-4 ${feature.color}`}>
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-base text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ── How It Works ─────────────────────────────────────────── */}
        <section id="how-it-works" className="section">
          <div className="container-md">
            <div className="text-center mb-16">
              <Badge variant="muted" size="md" className="mb-4">How It Works</Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Up and running in 60 seconds.
              </h2>
              <p className="text-lg text-muted-foreground text-balance">
                From download to your first connection — in under a minute.
              </p>
            </div>

            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-8 top-0 bottom-0 w-px bg-border hidden md:block" />

              <div className="flex flex-col gap-10">
                {HOW_IT_WORKS.map((step, i) => (
                  <div key={step.step} className="flex gap-6 md:gap-8 items-start">
                    {/* Step number */}
                    <div className="relative shrink-0 flex items-center justify-center w-16 h-16 rounded-full bg-nexus-indigo/10 border-2 border-nexus-indigo/30 text-nexus-indigo font-bold text-lg z-10">
                      {step.step}
                    </div>
                    {/* Content */}
                    <div className="pt-3">
                      <h3 className="font-semibold text-lg text-foreground mb-1">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Privacy Section ───────────────────────────────────────── */}
        <section className="section bg-nexus-black dark:bg-nexus-gray-950 text-white">
          <div className="container-md text-center">
            <div className="inline-flex p-3 rounded-xl bg-white/10 mb-6">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Privacy is not an afterthought.
            </h2>
            <p className="text-lg text-white/70 max-w-xl mx-auto mb-10 text-balance">
              You control exactly who sees you. We never expose your exact GPS coordinates
              and respect every privacy setting you choose.
            </p>

            <div className="grid sm:grid-cols-3 gap-4 text-left">
              {[
                {
                  icon: '🌍',
                  title: 'Everyone',
                  description: 'All event attendees can discover you.',
                },
                {
                  icon: '🎯',
                  title: 'Matching Interests',
                  description: 'Only people with shared interests see you.',
                },
                {
                  icon: '👻',
                  title: 'Invisible',
                  description: 'You browse freely — no one can find you.',
                },
              ].map((mode) => (
                <div
                  key={mode.title}
                  className="p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <span className="text-2xl block mb-3">{mode.icon}</span>
                  <h4 className="font-semibold text-white mb-1">{mode.title}</h4>
                  <p className="text-sm text-white/60">{mode.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ─────────────────────────────────────────────── */}
        <section className="section">
          <div className="container-sm text-center">
            <NexusIcon size={64} className="mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Ready to network smarter?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 text-balance">
              Join thousands of attendees who never miss the right connection.
            </p>
            <Button variant="accent" size="xl" asChild className="mx-auto">
              <Link href={ROUTES.LOGIN}>
                <Linkedin className="h-5 w-5" />
                Get started with LinkedIn
              </Link>
            </Button>
            <p className="mt-4 text-sm text-muted-foreground">
              Free for event attendees. No credit card required.
            </p>
          </div>
        </section>
      </main>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer className="border-t border-border bg-muted/20">
        <div className="container-nexus py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <NexusLogo size={24} variant="full" />
            <p className="text-sm text-muted-foreground text-center">
              © {new Date().getFullYear()} Nexus. Built for the networkers.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="/contact" className="hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
