# Nexus

> **Never miss the right connection at an event.**

A premium event networking web app that helps attendees at hackathons, conferences, and meetups discover relevant nearby people and connect via LinkedIn — with one tap.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (install from [nodejs.org](https://nodejs.org))
- npm 9+ or pnpm 8+
- A [Supabase](https://supabase.com) account (free)

### 1. Clone & Install

```bash
cd nexus
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Fill in the values in `.env.local` — see the [Setup Guide](#setup-guide) below.

### 3. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS + CVA |
| State | Zustand |
| Data Fetching | TanStack React Query |
| Backend | Supabase (Auth, DB, Realtime, Storage) |
| Auth | Supabase Auth + LinkedIn OAuth |
| Forms | React Hook Form + Zod |
| Animations | Framer Motion |
| Icons | Lucide React |

---

## 📁 Folder Structure

```
nexus/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Auth: login, onboarding
│   ├── (app)/              # Protected: dashboard, events, profile
│   ├── admin/              # Founder admin dashboard
│   ├── api/                # API routes
│   ├── layout.tsx          # Root layout (fonts, metadata)
│   ├── page.tsx            # Landing page
│   └── globals.css         # Design system + global styles
├── components/
│   ├── ui/                 # Design system components
│   ├── auth/               # Auth components
│   ├── events/             # Event components
│   ├── nearby/             # Nearby discovery components
│   ├── profile/            # Profile card components
│   └── admin/              # Admin dashboard components
├── lib/
│   ├── supabase/           # Supabase client (browser + server)
│   ├── hooks/              # Custom React hooks
│   ├── utils.ts            # Helper functions
│   └── validations/        # Zod schemas
├── store/                  # Zustand stores
├── types/                  # TypeScript types
└── constants/              # App constants
```

---

## ⚙️ Setup Guide

### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Copy your **Project URL** and **Anon Key** from Project Settings → API
3. Enable **LinkedIn OAuth** in Authentication → Providers
4. Run the database migrations (coming in M2)

### LinkedIn OAuth Setup

1. Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/apps)
2. Create a new app
3. Add these OAuth redirect URLs:
   - `http://localhost:3000/auth/callback` (development)
   - `https://yourdomain.com/auth/callback` (production)
4. Copy Client ID and Secret to your `.env.local`

---

## 📋 Milestones

| # | Milestone | Status |
|---|-----------|--------|
| M0 | Project Foundation | ✅ Complete |
| M1 | Auth & LinkedIn Login | 🔄 Next |
| M2 | Onboarding Flow | ⏳ Planned |
| M3 | Events System | ⏳ Planned |
| M4 | Nearby Discovery | ⏳ Planned |
| M5 | Heatmap & Recap | ⏳ Planned |
| M6 | User Profiles | ⏳ Planned |
| M7 | Founder Admin Dashboard | ⏳ Planned |

---

## 🔒 Security Notes

- JWT authentication via Supabase
- Row Level Security (RLS) on all database tables
- GPS coordinates never exposed to client — only approximate distance
- LinkedIn OAuth tokens stored securely via Supabase Auth
- Rate limiting on all API routes

---

## 📄 License

Private — All rights reserved. Nexus startup project.
